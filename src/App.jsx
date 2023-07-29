import React, { useContext, useEffect } from 'react';
import './styles/global.scss'
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
// import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Team from './pages/Team';

import { AuthContext } from "./context/AuthContext";
import NotVerified from './pages/NotVerified';
import Pages from './pages/Pages';
import Test from './pages/Test';
import AdminHome from './adminpages/home/AdminHome';
import HolidayCalendar from './adminpages/holiday/HolidayCalendar';
import EmployeeAttendance from './adminpages/employee/EmployeeAttendance';
import Sidebar from './components/admin/sidebar/Sidebar';
import Projects from './adminpages/projects/Projects';
import Notes from './adminpages/Notes/Notes';
import SingleAttendance from './pages/SingleAttendance';
import AttendanceDashboard from './pages/attendance/AttendanceDashboard';
import { ErrorBoundary } from "react-error-boundary";

function MyFallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const { currentUser, userverified } = useContext(AuthContext)
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children
  };

  const Layout = () => {
    return (
      <div className="">
        <Navbar />
        <div className="">
          <div className="">
          </div>
          <div className="">
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  const AdminLayout = () => {
    return (
      <div className="">
        <Navbar />
        <div className="main">
          <div className=" container">
            <div className="menuContainer">
              <Sidebar />
            </div>
            <div className="contentContainer">
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  const BasicLayout = () => {
    return (
      <div className="">
        <Navbar />
        <div className="">
          <Outlet />
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/admin",
          element: <Team />,
        },
        {
          path: "/adminpanel",
          element: <Pages />,
        },
        {
          path: "/attendance",
          element: <SingleAttendance />,
        },
        {
          path: "/attendance/:id",
          element: < Attendance />,
        },
        {
          path: "/apptest",
          element: <Test />,
        },

        {
          path: "/attendancedashboard",
          element: <AttendanceDashboard />,
        }
      ],
    },
    {
      path: "/",
      element: <BasicLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/notverified",
          element: <NotVerified />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "/admin",
          element: <AdminHome />,
        },
        {
          path: "/admin/calendar",
          element: <HolidayCalendar />,
        },
        {
          path: "/admin/employees",
          element: <EmployeeAttendance />,
        },

        {
          path: "/admin/projects",
          element: <Projects />,

        },
        {
          path: "/admin/notes",
          element: <Notes />,
        },
      ],
    },

  ]);

  return <RouterProvider router={router} />;
  
}

export default App;