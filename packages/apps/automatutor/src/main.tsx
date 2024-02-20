import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';
import { Provider } from 'react-redux';
import store from './store.ts';
import Login from './pages/Login.tsx';
import LoginRedirect from './pages/LoginRedirect.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import StudentTemplate from './pages/student/StudentTemplate.tsx';
import Home from './pages/student/home/Home.tsx';
import ErrorPage, { ErrorConfig } from './pages/ErrorPage.tsx';
import { LeaderBoard } from './pages/student/leaderboard/Leaderboard.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login/failed" element={<ErrorPage />} />
      <Route path="/login/callback" element={<LoginRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<StudentTemplate />}>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage {...ErrorConfig.NotFound} />} />
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <Provider store={store}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </Provider>
  </ErrorBoundary>,
);
