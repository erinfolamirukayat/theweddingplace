import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaystackButton from './PaystackButton';
import { Info } from 'lucide-react';

interface ContributionFormProps {
    registryItemId: string;
    itemName: string;
    price: number;
    remainingAmount: number;
}

const MIN_CONTRIB = 1000; // Minimum contribution amount

const ContributionForm: React.FC<ContributionFormProps> = ({
    registryItemId,
    itemName,
    price,
    remainingAmount
}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        amount: Math.max(MIN_CONTRIB, remainingAmount).toString(),
        message: ''
    });
    const [error, setError] = useState('');
    const [touchedFields, setTouchedFields] = useState({
        name: false,
        email: false,
        amount: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAmountChange = (value: number | string, fromSlider = false) => {
        setTouchedFields(prev => ({
            ...prev,
            amount: true
        }));
        let numValue: number;
        if (typeof value === 'string') {
            if (value === '') {
                setFormData(prev => ({
                    ...prev,
                    amount: value // allow empty string for editing
                }));
                setError('');
                return;
            }
            numValue = parseFloat(value);
            setFormData(prev => ({
                ...prev,
                amount: value // keep as string for editing
            }));
        } else {
            numValue = value;
            setFormData(prev => ({
                ...prev,
                amount: numValue.toString()
            }));
        }

        // Only show error, don't block editing
        if (isNaN(numValue)) {
            setError('');
        } else if (numValue < MIN_CONTRIB) {
            setError(`Minimum contribution is ₦${MIN_CONTRIB.toLocaleString()}`);
        } else {
            setError('');
        }
    };

    const handlePaymentSuccess = (response: { reference: string }) => {
        navigate(`/payment/verify?reference=${response.reference}`);
    };

    const handlePaymentClose = async (reference?: string) => {
        if (reference) {
            try {
                // For transfers, the user might close the modal while the payment is still processing
                // or after it succeeded but before Paystack called onSuccess.
                // We verify with our backend just to be sure.
                const { getConfig } = await import('../config');
                const response = await fetch(`${getConfig().apiUrl}/payments/verify?reference=${reference}`);
                const data = await response.json();
                
                if (data.status === 'success') {
                    // Payment actually succeeded!
                    navigate(`/payment/verify?reference=${reference}`);
                    return;
                }
            } catch (err) {
                console.error('Error verifying payment on close:', err);
            }
        }
        console.log('Payment cancelled or unverified');
    };

    const percent = !formData.amount || isNaN(Number(formData.amount)) || price === 0 ? 0 : Math.round((Number(formData.amount) / price) * 100);

    // Add validation function
    const isFormValid = () => {
        const amount = Number(formData.amount);
        return (
            formData.name.trim() !== '' &&
            
            !isNaN(amount) &&
            amount >= MIN_CONTRIB
        );
    };

    const shouldShowValidation = () => {
        // Show validation if all required fields have been touched
        return (touchedFields.name && touchedFields.email && touchedFields.amount) ||
               // Or if at least one field is touched and user attempts to proceed (paymentData is accessed)
               (Object.values(touchedFields).some(touched => touched) && !isFormValid() && !paymentData);
    };

    // Add function to prepare payment data
    const preparePaymentData = () => {
        const baseAmount = Number(formData.amount);
        if (isNaN(baseAmount) || baseAmount < MIN_CONTRIB) {
            return null;
        }

        const totalAmount = baseAmount * 1.03;

        return {
            email: formData.email.trim() || 'info@celebron.co',
            amount: totalAmount,
            metadata: {
                registry_item_id: registryItemId,
                name: formData.name.trim(),
                email: formData.email.trim() || 'info@celebron.co',
                message: formData.message.trim(),
                base_amount: baseAmount
            }
        };
    };

    const paymentData = preparePaymentData();
    const maxAllowedContrib = Math.max(MIN_CONTRIB, remainingAmount);

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contribute to {itemName}</h2>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-[#B8860B] focus:ring-[#B8860B]"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-[#B8860B] focus:ring-[#B8860B]"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        This helps the couple know who contributed to their registry.
                    </p>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Contribution Amount
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            min={MIN_CONTRIB}
                            required
                            className="w-32 px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-[#B8860B] focus:ring-[#B8860B]"
                        />
                        <span className="text-gray-600">₦</span>
                    </div>
                    <input
                        type="range"
                        min={MIN_CONTRIB}
                        max={maxAllowedContrib}
                        step={100}
                        value={formData.amount === '' ? MIN_CONTRIB : Number(formData.amount)}
                        onChange={(e) => handleAmountChange(parseFloat(e.target.value), true)}
                        className="w-full mb-2 accent-[#B8860B]"
                    />
                    <p className="mb-2 text-xs text-gray-500">
                        You can enter any amount above, or use the slider to choose a proportion of the remaining balance.
                    </p>
                    <p className="mb-4 text-sm text-gray-700">
                        You are gifting <span className="font-semibold">₦{Number(formData.amount || 0).toLocaleString()}</span> ({percent}%)
                    </p>

                    {Number(formData.amount) >= MIN_CONTRIB && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Gift Amount:</span>
                                <span className="text-sm font-medium text-gray-800">₦{Number(formData.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3 group relative">
                                <span className="text-sm text-gray-600 flex items-center cursor-help">
                                    Handling Fee (3%)
                                    <Info className="w-4 h-4 ml-1 text-gray-400" />
                                    
                                    {/* Tooltip */}
                                    <div className="absolute left-0 bottom-6 hidden group-hover:block w-64 p-3 bg-gray-800 text-white text-xs rounded shadow-lg z-10 font-normal leading-relaxed">
                                        This 3% fee covers the payment processing fee and helps support our registry and delivery services for the couple.
                                    </div>
                                </span>
                                <span className="text-sm font-medium text-gray-800">₦{Math.round(Number(formData.amount) * 0.03).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <span className="text-base font-bold text-gray-900">Total to Pay:</span>
                                <span className="text-base font-bold text-[#B8860B]">₦{Math.round(Number(formData.amount) * 1.03).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message to the couple
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-[#B8860B] focus:ring-[#B8860B]"
                        placeholder="Write a message to the couple..."
                    />
                </div>

                <div className="mt-6">
                    {paymentData ? (
                        <PaystackButton
                            email={paymentData.email}
                            amount={paymentData.amount}
                            metadata={paymentData.metadata}
                            onSuccess={handlePaymentSuccess}
                            onClose={handlePaymentClose}
                        />
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-full px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                        >
                            Pay with Paystack
                        </button>
                    )}
                    {!isFormValid() && shouldShowValidation() && (
                        <p className="mt-2 text-sm text-red-600">
                            Please fill in all required fields and ensure the amount is at least ₦{MIN_CONTRIB.toLocaleString()}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ContributionForm; 