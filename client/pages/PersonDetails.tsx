import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserIcon, CalendarIcon, PhoneIcon, GiftIcon, PencilIcon, TrashIcon, SaveIcon, XIcon } from 'lucide-react';
import { getPersonById, updatePerson, deletePerson, getDaysUntilBirthday } from '../utils/storage';
const PersonDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phoneNumber: '',
    relationship: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (id) {
      const foundPerson = getPersonById(id);
      if (foundPerson) {
        setPerson(foundPerson);
        setFormData({
          name: foundPerson.name,
          birthDate: foundPerson.birthDate,
          phoneNumber: foundPerson.phoneNumber,
          relationship: foundPerson.relationship,
          notes: foundPerson.notes || ''
        });
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);
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
  const handleSave = () => {
    if (validateForm() && id) {
      const updatedPerson = {
        ...person,
        ...formData
      };
      updatePerson(updatedPerson);
      setPerson(updatedPerson);
      setIsEditing(false);
    }
  };
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`) && id) {
      deletePerson(id);
      navigate('/');
    }
  };
  const formatBirthDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    // Adjust age if birthday hasn't occurred yet this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
      age--;
    }
    return age;
  };
  if (!person) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  const daysUntil = getDaysUntilBirthday(person.birthDate);
  return <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Person' : person.name}
        </h1>
        {!isEditing && <div className="flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button onClick={handleDelete} className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700">
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {isEditing ? <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} />
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
                <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`block w-full pl-10 pr-3 py-2 border ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`} />
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
                  <UserIcon className="h-5 w-5 text-gray-400" />
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
                <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setIsEditing(false)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                <XIcon className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div> : <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-medium text-purple-900">
                    Birthday Status
                  </h3>
                  <p className="text-purple-700">
                    {daysUntil === 0 ? <span className="font-bold">
                        Today is their birthday! 🎉
                      </span> : <span>{daysUntil} days until their next birthday</span>}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-lg text-gray-900">{person.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Birth Date
                </h3>
                <p className="mt-1 text-lg text-gray-900">
                  {formatBirthDate(person.birthDate)} (
                  {getAge(person.birthDate)} years old)
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Phone Number
                </h3>
                <p className="mt-1 text-lg text-gray-900">
                  {person.phoneNumber}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Relationship
                </h3>
                <p className="mt-1 text-lg text-gray-900">
                  {person.relationship}
                </p>
              </div>
            </div>
            {person.notes && <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-gray-900">{person.notes}</p>
              </div>}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link to={`/gift-management/${person.id}`} className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full">
                <GiftIcon className="h-5 w-5 mr-2" />
                Manage Gift Options
              </Link>
            </div>
          </div>}
      </div>
    </div>;
};
export default PersonDetails;