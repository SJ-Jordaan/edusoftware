import { useState } from 'react';
import EduSoftware from '../assets/edusoftware-logo.svg?react';
import GoogleIcon from '../assets/google-color-icon.svg?react';

function Login() {
  const [showUPInfo, setShowUPInfo] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 px-4 py-12">
      {/* Logo Section */}
      <div className="mb-12 text-center">
        <EduSoftware className="mx-auto h-24 w-24 sm:h-32 sm:w-32" />
        <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
          Welcome to <span className="text-logo-primary">AutomaTutor</span>
        </h1>
        <p className="mt-4 max-w-sm text-gray-400">
          Master automata theory through interactive challenges and hands-on
          learning
        </p>
      </div>

      {/* Login Options */}
      <div className="w-full max-w-sm space-y-4 rounded-xl bg-gray-800 p-6 shadow-xl">
        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google/authorize?state=logictutor`}
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </a>

        <button
          onClick={() => setShowUPInfo(!showUPInfo)}
          className="w-full text-sm text-gray-400 hover:text-white"
        >
          UP Student? Click here
        </button>

        {showUPInfo && (
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-200">
            <p>
              To participate in University of Pretoria specific challenges,
              please sign in with your UP email address (@tuks.co.za).
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}

export default Login;
