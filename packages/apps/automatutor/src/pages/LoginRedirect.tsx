import { useNavigate, useSearchParams } from 'react-router-dom';
import { setCredentials } from '../slices/auth.slice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useAppSelector } from '../store';

function LoginRedirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const token = params.get('token');
  const { token: existingToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If there's an existing token, redirect to home
    if (existingToken) {
      navigate('/', { replace: true });
    } else if (token) {
      // If a new token is provided in the URL, set it and redirect
      dispatch(setCredentials(token));
      navigate('/', { replace: true });
    } else {
      // Handle case where no token is available
      // Redirect to login page or show an error message
      navigate('/login', { replace: true });
    }
  }, [dispatch, existingToken, navigate, token]);

  // Since all outcomes result in a redirect, we don't render anything
  return null;
}

export default LoginRedirect;
