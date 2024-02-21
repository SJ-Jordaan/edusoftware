import EduSoftware from '../assets/edusoftware-logo.svg?react';
import GoogleIcon from '../assets/google-color-icon.svg?react';

function Login() {
  return (
    <div className="flex h-screen w-screen flex-col items-center p-4 pt-16 dark:bg-gray-900">
      <h1 className="text-3xl text-gray-800 dark:text-slate-100">Welcome to</h1>
      <h2 className="font-semiBold text-logo-primary text-3xl">AutomaTutor</h2>
      <EduSoftware className="h-36 w-36" />
      <p className="mt-8 text-center text-gray-800 dark:text-slate-100">
        Sign in with your <b>University of Pretoria</b> Google account to get
        started.
      </p>
      <a
        href={`${import.meta.env.VITE_API_URL}/auth/google/authorize`}
        rel="noreferrer"
        className="mb-2 mt-8 inline-flex
        w-full items-center justify-center self-center rounded-full bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 md:max-w-80 dark:focus:ring-gray-300"
      >
        <GoogleIcon className="me-2 h-6 w-6" />
        Sign in with Google
      </a>
    </div>
  );
}

export default Login;
