import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';

const PrivateRoute = () => {
  const { token } = useAppSelector((state) => state.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
