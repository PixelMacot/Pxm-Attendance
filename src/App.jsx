import React, { useContext, useEffect } from 'react';
import './styles/global.scss'
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
// import { Routes, Route } from 'react-router-dom';
import Profile from './pages/profile/Profile';
import Attendance from './pages/Attendance';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Team from './pages/team/Team';

import { AuthContext } from "./context/AuthContext";
import NotVerified from './pages/notverified/NotVerified';
import Test from './pages/unusedfiles/Test';
import AdminHome from './adminpages/home/AdminHome';
import HolidayCalendar from './adminpages/holiday/HolidayCalendar';
import EmployeeAttendance from './adminpages/employee/EmployeeAttendance';
import Projects from './adminpages/projects/Projects';
import Notes from './adminpages/Notes/Notes';
import AttendanceDashboard from './pages/attendance/AttendanceDashboard';
import Sidebar from './components/sidebar/SideBar'
import HomePageLoader from './components/loader/HomePageLoader';
import { ErrorBoundary } from "react-error-boundary";
import UpdateEmpData from './adminpages/empoyeeupdate/UpdateEmpData';
function App() {

  const { currentUser, userDataLoading, userData } = useContext(AuthContext)

  if (userDataLoading) {
    return <div><HomePageLoader /></div>
  }
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    } else {
      if (currentUser.emailVerified) {
        return children
      } else {
        return <Navigate to="/notverified" />;
      }
    }
  };
  const AdminProtectedRoute = ({ children }) => {
    if (userData.prevelege == "admin") {
      return children
    } else {
      return <Navigate to="/" />;
    }
  };

  const Layout = () => {
    return (
      <div className="">
        <Navbar />
        <div className="">
          <div className="">
          </div>
          <div className="">
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            </ErrorBoundary>
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  const AdminLayout = () => {
    return (
      <div className="">
        <div className="fixed z-50 left-[50%] top-[3%] text-cyan-900 font-bold">Admin Panel</div>
        <Navbar />
        <div className="flex  min-h-[70vh] justify-center mx-auto">
          <div className="flex max-w-[95vw] lg:max-w-[100vw] mx-auto flex-col justify-center ">
            <div className="min-w-[100%]">
              <Sidebar />
            </div>
            <div className="min-w-[100%]">
              <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <ProtectedRoute>
                  <AdminProtectedRoute>
                    <Outlet />
                  </AdminProtectedRoute>
                </ProtectedRoute>
              </ErrorBoundary>
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
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/team",
          element: <Team />,
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
          path: "/admin/employee/:id",
          element: < Attendance />,
        },
        {
          path: "/admin/update/employee/:id",
          element: < UpdateEmpData />,
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