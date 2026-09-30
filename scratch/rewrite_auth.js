const fs = require('fs');
const path = require('path');

// --- LOGIN ---
const loginPath = path.join(__dirname, '../client/pages/Login.tsx');
let loginContent = fs.readFileSync(loginPath, 'utf-8');

if (!loginContent.includes('from "lucide-react"') && !loginContent.includes("from 'lucide-react'")) {
    loginContent = loginContent.replace('import { useNavigate, useLocation, Link } from \'react-router-dom\';', 'import { useNavigate, useLocation, Link } from \'react-router-dom\';\nimport { HeartIcon, MailIcon, LockIcon } from "lucide-react";');
}

const loginReturnIndex = loginContent.lastIndexOf('  return (');
const loginPrefix = loginContent.substring(0, loginReturnIndex);

const loginRender = `  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <HeartIcon className="mx-auto h-12 w-12 text-[#B8860B]" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#2C1810]">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your registry
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm transition-colors"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[#B8860B] hover:text-[#8B6508]"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#B8860B] hover:bg-[#8B6508] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8860B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link
              to="/register"
              className="font-bold text-[#B8860B] hover:text-[#8B6508] transition-colors"
            >
              Start your registry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
`;
fs.writeFileSync(loginPath, loginPrefix + loginRender, 'utf-8');

// --- REGISTER ---
const registerPath = path.join(__dirname, '../client/pages/Register.tsx');
let registerContent = fs.readFileSync(registerPath, 'utf-8');

if (!registerContent.includes('from "lucide-react"') && !registerContent.includes("from 'lucide-react'")) {
    registerContent = registerContent.replace('import { useNotification } from \'../components/Layout\';', 'import { useNotification } from \'../components/Layout\';\nimport { HeartIcon, UserIcon, MailIcon, LockIcon, MessageSquareIcon } from "lucide-react";');
}

const registerReturnIndex = registerContent.lastIndexOf('  return (');
const registerPrefix = registerContent.substring(0, registerReturnIndex);

const registerRender = `  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <HeartIcon className="mx-auto h-12 w-12 text-[#B8860B]" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#2C1810]">
          Create your registry
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join thousands of happy couples
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  First Name
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm transition-colors"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Last Name
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm transition-colors"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm transition-colors"
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                How did you hear about us?
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquareIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B] sm:text-sm transition-colors"
                  placeholder="Friend, Google, Instagram..."
                  value={howHeard}
                  onChange={(e) => setHowHeard(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#B8860B] hover:bg-[#8B6508] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8860B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <a
              href="/login"
              className="font-bold text-[#B8860B] hover:text-[#8B6508] transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
`;
fs.writeFileSync(registerPath, registerPrefix + registerRender, 'utf-8');

console.log('Login and Register updated.');
