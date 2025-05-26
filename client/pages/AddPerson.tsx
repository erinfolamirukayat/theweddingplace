import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, CalendarIcon, PhoneIcon, UsersIcon, SaveIcon } from 'lucide-react';
import { addPerson, generateId } from '../utils/storage';
const AddPerson = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phoneNumber: '',
    relationship: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const updated = {
          ...prev
        };
        delete updated[name];
        return updated;
      });
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newPerson = {
        id: generateId(),
        ...formData
      };
      addPerson(newPerson);
      navigate('/');
    }
  };
  return <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add a Person</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} placeholder="John Doe" />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Birth Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="date" name="birthDate" id="birthDate" value={formData.birthDate} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.birthDate ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} />
              </div>
              {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} placeholder="(123) 456-7890" />
              </div>
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>}
            </div>
            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                Relationship
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select name="relationship" id="relationship" value={formData.relationship} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.relationship ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}>
                  <option value="">Select relationship</option>
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.relationship && <p className="mt-1 text-sm text-red-600">
                  {errors.relationship}
                </p>}
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <div className="mt-1">
                <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Add any additional information here..."></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Person
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
};
export default AddPerson;