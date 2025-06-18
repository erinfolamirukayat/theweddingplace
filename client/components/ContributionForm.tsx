import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaystackButton from './PaystackButton';

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
        amount: remainingAmount.toString(),
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
        } else if (numValue > remainingAmount) {
            setError(`Amount cannot exceed ${remainingAmount}`);
        } else if (numValue < MIN_CONTRIB) {
            setError(`Minimum contribution is ${MIN_CONTRIB}`);
        } else {
            setError('');
        }
    };

    const handlePaymentSuccess = (response: { reference: string }) => {
        navigate(`/payment/verify?reference=${response.reference}`);
    };

    const handlePaymentClose = () => {
        console.log('Payment cancelled');
    };

    const percent = !formData.amount || isNaN(Number(formData.amount)) || price === 0 ? 0 : Math.round((Number(formData.amount) / price) * 100);

    // Add validation function
    const isFormValid = () => {
        const amount = Number(formData.amount);
        return (
            formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            !isNaN(amount) &&
            amount >= MIN_CONTRIB &&
            amount <= remainingAmount
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
        const amount = Number(formData.amount);
        if (isNaN(amount) || amount < MIN_CONTRIB || amount > remainingAmount) {
            return null;
        }

        return {
            email: formData.email.trim(),
            amount: amount,
            metadata: {
                registry_item_id: registryItemId,
                name: formData.name.trim(),
                email: formData.email.trim(),
                message: formData.message.trim()
            }
        };
    };

    const paymentData = preparePaymentData();

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contribute to {itemName}</h2>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        This helps the couple know who contributed to their registry.
                    </p>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Contribution Amount <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            min={MIN_CONTRIB}
                            max={remainingAmount}
                            required
                            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
                        />
                        <span className="text-gray-600">₦</span>
                    </div>
                    <input
                        type="range"
                        min={MIN_CONTRIB}
                        max={remainingAmount}
                        value={formData.amount === '' ? MIN_CONTRIB : Number(formData.amount)}
                        onChange={(e) => handleAmountChange(parseFloat(e.target.value), true)}
                        className="w-full mb-2"
                    />
                    <p className="mb-2 text-xs text-gray-500">
                        You can change the amount to contribute by entering a new amount above or by moving this slider
                    </p>
                    <p className="mb-4 text-sm text-gray-700">
                        You are contributing <span className="font-semibold">₦{formData.amount.toLocaleString()}</span> ({percent}%)
                    </p>
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message to the couple (optional)
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B]"
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
                            Please fill in all required fields and ensure the amount is between ₦{MIN_CONTRIB.toLocaleString()} and ₦{remainingAmount.toLocaleString()}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ContributionForm; 