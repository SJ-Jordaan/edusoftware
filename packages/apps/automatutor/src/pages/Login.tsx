import EduSoftware from '../assets/edusoftware-logo.svg?react';
import GoogleIcon from '../assets/google-color-icon.svg?react';

function Login() {
  return (
    <div className="h-screen w-screen flex flex-col items-center p-4 pt-16 dark:bg-gray-900">
      <h1 className="text-3xl text-gray-800 dark:text-slate-100">Welcome to</h1>
      <h2 className="text-3xl font-semiBold text-logo-primary">AutomaTutor</h2>
      <EduSoftware className="w-36 h-36" />
      <p className="mt-8 text-center text-gray-800 dark:text-slate-100">
        Sign in with your University of Pretoria Google account to get started.
      </p>
      <a
        href={`${import.meta.env.VITE_API_URL}/auth/google/authorize`}
        rel="noreferrer"
        className="text-gray-800 w-full self-center
        mt-8 justify-center md:max-w-80 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-300 mb-2"
      >
        <GoogleIcon className="w-6 h-6 me-2" />
        Sign in with Google
      </a>
    </div>
  );
}

export default Login;
