const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/pages/Profile.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('from "lucide-react"') && !content.includes("from 'lucide-react'")) {
    content = content.replace('import { useNotification } from \'../components/Layout\';', 'import { useNotification } from \'../components/Layout\';\nimport { UserIcon, SaveIcon, ArrowLeftIcon, AlertCircleIcon, MessageSquareIcon } from "lucide-react";\nimport { Link } from "react-router-dom";');
} else {
    content = content.replace(/import \{[^}]*\}\s+from\s+["']lucide-react["'];/, 'import { UserIcon, SaveIcon, ArrowLeftIcon, AlertCircleIcon, MessageSquareIcon } from "lucide-react";\nimport { Link } from "react-router-dom";');
}

const returnIndex = content.lastIndexOf('  return (');
if (returnIndex === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const prefix = content.substring(0, returnIndex);

const newRender = `  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#FFF8F3] px-6 py-8 sm:px-10 flex flex-col items-center border-b border-[#E8DCC4]/50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-[#E8DCC4]">
              <UserIcon className="w-10 h-10 text-[#B8860B]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810]">
              My Profile
            </h1>
            <p className="mt-2 text-gray-500 font-medium">
              Manage your personal information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    required
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    required
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                How did you hear about us?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MessageSquareIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="how_heard"
                  required
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                  value={form.how_heard}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-100">
                <AlertCircleIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-medium text-sm">{error}</span>
              </div>
            )}

            <div className="pt-6 mt-8 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 bg-[#B8860B] text-white font-bold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
`;

fs.writeFileSync(filePath, prefix + newRender, 'utf-8');
console.log('Profile updated.');
