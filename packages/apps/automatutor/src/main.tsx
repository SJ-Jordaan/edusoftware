import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store.ts';
import Login from './pages/Login.tsx';
import LoginRedirect from './pages/LoginRedirect.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login/callback" element={<LoginRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<App />}></Route>
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>,
);
