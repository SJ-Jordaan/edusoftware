import { useEffect, useState } from 'react';
import { UserSession } from '@edusoftware/core/src/types';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    const token = localStorage.getItem('session');
    if (token) {
      const user = await getUserInfo(token);
      if (user) {
        setSession(user);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('session', token);
      window.location.replace(window.location.origin);
    }
  }, []);

  const getUserInfo = async (token: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/session`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
      alert(error);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('session');
    setSession(null);
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="container">
        {session ? (
          <div>
            <p>Yeah! You are signed in.</p>
            <p>Welcome {session.name}</p>
            <img
              src={session.picture}
              alt={session.name}
              style={{ borderRadius: '50%' }}
              width={100}
              height={100}
            />
            <p>{session.email}</p>
            <button onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <div>
            <a
              href={`${import.meta.env.VITE_API_URL}/auth/google/authorize`}
              rel="noreferrer"
            >
              <button>Sign in with Google</button>
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
