import React, { useContext, useState } from 'react';
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
import AdminHome from './adminpages/home/AdminHome';
import HolidayCalendar from './adminpages/holiday/HolidayCalendar';
import EmployeeAttendance from './adminpages/employee/EmployeeAttendance';
import AttendanceDashboard from './pages/attendance/AttendanceDashboard';
import Sidebar from './components/sidebar/SideBar'
import HomePageLoader from './components/loader/HomePageLoader';
import { ErrorBoundary } from "react-error-boundary";
import UpdateEmpData from './adminpages/empoyeeupdate/UpdateEmpData';
import NotAllowed from './pages/notallowed/NotAllowed';
import OfficeLocation from './adminpages/location/OfficeLocation';
import Message from './adminpages/message/Message';
import Contact from './pages/contact/Contact';
import Notification from './components/notification/Notification';
import { requestForToken,onMessageListener } from './firebase'
import SingleMessage from './components/singlemessage/SingleMessage';
import Inbox from './components/inbox/Inbox';

function App() {
  // getFirebaseToken()
  const [isTokenFound, setTokenFound] = useState(false);
  
  const { currentUser, userDataLoading, userData,updateFcmToken } = useContext(AuthContext)

  onMessageListener().then(payload => {
    // setShow(true);
    alert(payload.notification.body )
    console.log(payload.notification.title);
  }).catch(err => console.log('failed: ', err));
  // isTokenFound ? console.log("Token found") : console.log("Token not found");

  if (userDataLoading) {
    return <div><HomePageLoader /></div>
  }

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Login />;
    } else {

      if (!userData.dummyData) {
        if (userData.status) {
          if (currentUser.emailVerified) {
           requestForToken().then((data)=>{
            console.log(data)
            updateFcmToken(userData,data)
           })
            return children
          } else {
            // return <Navigate to="/notverified" />;
            return <NotVerified />;
          }
        } else {
          // return <Navigate to="/notallowed" />;
          return <NotAllowed />;
        }
      } else {
        return <div><HomePageLoader /></div>
      }

    }
  };
  const AdminProtectedRoute = ({ children }) => {
    if (userData.prevelege == "admin" || userData.prevelege == "superadmin") {
      return children
    } else {
      return <Navigate to="/" />;
    }
  };

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <Notification />
        <div className="page-wrapper">
          <div className="maincontainer">
          </div>
          <div className="layout">
            {/* <ErrorBoundary fallback={<div>Something went wrong</div>}> */}
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
            {/* </ErrorBoundary> */}
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  const AdminLayout = () => {
    return (
      <div className="main">
        {/* <div className="fixed z-50 left-[50%] top-[3%] text-cyan-900 font-bold">Admin Panel</div> */}
        <Navbar />
        <div className="page-wrapper">
          <div className="main-container">
            <div className="">
              <Sidebar />
            </div>
            <div className="admin-container">
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
      <div className="main">
        <Navbar />
        <div className="page-wrapper">
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
          path: "/notallowed",
          element: <NotAllowed />,
        },
        {
          path: "/attendancedashboard",
          element: <AttendanceDashboard />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/inbox",
          element: <Inbox/>,
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
          path: "/admin/officelocation",
          element: <OfficeLocation />,
        },
        {
          path: "/admin/message",
          element: <Message />,
        },
        {
          path: "/admin/message/:id",
          element: <SingleMessage />,
        },
      ],
    },

  ]);

  return <RouterProvider router={router} />;

}

export default App;