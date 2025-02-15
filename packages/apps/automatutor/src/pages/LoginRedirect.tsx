import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../slices/auth.slice';
import { useEffect, useState } from 'react';
import { useGetUserInfoQuery } from '../slices/userApi.slice';
import { PageLoader } from '../components/loaders/PageLoader';
import { isPrivilegedUser } from '@edusoftware/core/src/organisations';

enum Progress {
  Started,
  InProgress,
  Completed,
}

function LoginRedirect() {
  const [progress, setProgress] = useState<Progress>(Progress.Started);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');
  const {
    token: existingToken,
    user: existingUser,
    setCredentials,
    setUser,
  } = useAuth();
  const {
    data: session,
    isLoading,
    isError,
  } = useGetUserInfoQuery(undefined, { skip: progress === Progress.Started });

  useEffect(() => {
    if (existingToken && existingUser) {
      setProgress(Progress.Completed);

      if (isPrivilegedUser(existingUser.roles)) {
        navigate('/admin', { replace: true });
        return;
      }

      navigate('/', { replace: true });
    } else if (token) {
      setCredentials(token);
      setProgress(Progress.InProgress);
    } else {
      navigate('/login', { replace: true });
    }
  }, [existingToken, navigate, token]);

  useEffect(() => {
    if (session && !isLoading && !isError) {
      setProgress(Progress.Completed);
      setUser(session);

      if (isPrivilegedUser(session.roles)) {
        navigate('/admin', { replace: true });
        return;
      }

      navigate('/', { replace: true });
    }

    if (isError) {
      navigate('/login/failed', { replace: true });
    }
  }, [session, isLoading, isError, navigate]);

  return <PageLoader />;
}

export default LoginRedirect;
