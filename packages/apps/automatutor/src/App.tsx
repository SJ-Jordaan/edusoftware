import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useGetUserInfoQuery } from './slices/userApi.slice';
import { useDispatch } from 'react-redux';
import { logout } from './slices/auth.slice';

function App() {
  const { data: session } = useGetUserInfoQuery();
  const dispatch = useDispatch();

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
            <button onClick={() => dispatch(logout())}>Sign out</button>
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
