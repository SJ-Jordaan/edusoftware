import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import './index.css';
import { Provider } from 'react-redux';
import store from './store.ts';
import Login from './pages/Login.tsx';
import LoginRedirect from './pages/LoginRedirect.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import StudentTemplate from './pages/student/StudentTemplate.tsx';
import ErrorPage, { ErrorConfig } from './pages/ErrorPage.tsx';
import AdminTemplate from './pages/admin/AdminTemplate.tsx';
import LevelManager from './pages/admin/level-manager/LevelManager.tsx';
import LevelEditor from './pages/admin/level-editor/LevelEditor.tsx';
import LevelSolver from './pages/student/level-solver/LevelSolver.tsx';
import QuestionEditor from './pages/admin/question-editor/QuestionEditor.tsx';
import Dashboard from './pages/admin/dashboard/Dashboard.tsx';
import { ReloadPrompt } from './components/ReloadPrompt.tsx';
import { PracticeLevels } from './pages/student/practice/Practice.tsx';
import ChallengePage from './pages/student/challenges/Challenges.tsx';
import TestLevelSolver from './pages/student/level-solver/TestLevelSolver.tsx';
import { Temp } from './pages/student/temp/temp.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/login/unauthorized"
        element={<ErrorPage {...ErrorConfig.Unauthorized} />}
      />
      <Route
        path="/login/forbidden"
        element={<ErrorPage {...ErrorConfig.Forbidden} />}
      />
      <Route path="/login/failed" element={<ErrorPage />} />
      <Route path="/login/callback" element={<LoginRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<PrivateRoute />}>
        {/* Authenticated student routes */}
        <Route path="/" element={<StudentTemplate />}>
          <Route path="/" element={<ChallengePage />} />
          <Route path="/practice" element={<PracticeLevels />} />
          <Route path="/temp" element={<Temp />} />
        </Route>

        {/* Level Solving routes */}
        <Route path="/level/:id" element={<LevelSolver />} />
        <Route path="/level/circuit" element={<TestLevelSolver />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminTemplate />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/levels" element={<LevelManager />} />
          <Route path="/admin/levels/:id" element={<LevelEditor />} />
          <Route
            path="/admin/levels/:levelId/:questionId"
            element={<QuestionEditor />}
          />
        </Route>
      </Route>

      {/* Page does not exist route */}
      <Route path="*" element={<ErrorPage {...ErrorConfig.NotFound} />} />
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <Provider store={store}>
      <React.StrictMode>
        <RouterProvider router={router} />
        <ReloadPrompt />
        <ToastContainer position="bottom-center" pauseOnHover theme="dark" />
      </React.StrictMode>
    </Provider>
  </ErrorBoundary>,
);
