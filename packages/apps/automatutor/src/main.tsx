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
import AdminTemplate from './pages/admin/AdminTemplate.tsx';
import LevelManager from './pages/admin/level-manager/LevelManager.tsx';
import LevelEditor from './pages/admin/level-editor/LevelEditor.tsx';
import LevelSolver from './pages/student/level-solver/LevelSolver.tsx';
import QuestionEditor from './pages/admin/question-editor/QuestionEditor.tsx';

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
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
        </Route>

        {/* Level Solving routes */}
        <Route path="/level/:id" element={<LevelSolver />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminTemplate />}>
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
      </React.StrictMode>
    </Provider>
  </ErrorBoundary>,
);
