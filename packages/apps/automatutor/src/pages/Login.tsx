function Login() {
  return (
    <div className="h-screen w-screen">
      <div>
        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google/authorize`}
          rel="noreferrer"
        >
          <button>Sign in with Google</button>
        </a>
      </div>
    </div>
  );
}

export default Login;
