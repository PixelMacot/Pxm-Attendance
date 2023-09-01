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
import AttendanceDashboard from './pages/attendance/AttendanceDashboard';
import Sidebar from './components/sidebar/SideBar'
import HomePageLoader from './components/loader/HomePageLoader';
import { ErrorBoundary } from "react-error-boundary";
import UpdateEmpData from './adminpages/empoyeeupdate/UpdateEmpData';
import NotAllowed from './pages/notallowed/NotAllowed';
import OfficeLocation from './adminpages/location/OfficeLocation';
import Message from './adminpages/message/Message';
import Contact from './pages/contact/Contact';
import { requestForToken, onMessageListener } from './firebase'
import SingleMessage from './components/singlemessage/SingleMessage';
import CreateAnnouncement from './adminpages/createannouncement/CreateAnnouncement';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import SideNav from './components/sidenav/SideNav';
import ShowEmployee from './adminpages/showemployee/ShowEmployee';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  // getFirebaseToken()
  const [isTokenFound, setTokenFound] = useState(false);

  const { currentUser, userDataLoading, userData, updateFcmToken } = useContext(AuthContext)

  // onMessageListener().then(payload => {
  //   // setShow(true);
  //   alert(payload.notification.body)
  //   console.log(payload.notification.title);
  // }).catch(err => console.log('failed: ', err));
  // isTokenFound ? console.log("Token found") : console.log("Token not found");

  if (userDataLoading) {
    return <div><HomePageLoader /></div>
  }

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    } else {

      if (!userData.dummyData) {
        if (userData.status) {
          if (currentUser.emailVerified) {
            requestForToken().then((data) => {
              console.log(data)
              // updateFcmToken(userData, data)
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
        <div className="main-container">
          <div className="sidenav">
            <SideNav />
          </div>
          {/* <Notification /> */}
          <div className="page-wrapper">
           
            <div className="layout">
              {/* <ErrorBoundary fallback={<div className='my-40 px-20 font-bold'>Something went wrong refresh page </div>}> */}
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
              {/* </ErrorBoundary> */}
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  };
  const AdminLayout = () => {
    return (
      <div className="main">
        {/* <div className="fixed z-50 left-[50%] top-[3%] text-cyan-900 font-bold">Admin Panel</div> */}

        <div className="">

          <div className="main-container">
            <div className="sidenav">
              <SideNav />
            </div>
            <div className="sidebar -mt-2 lg:-mt-8  lg:-ml-5 w-full lg:fixed top-6 z-50">
                <Sidebar />
              </div>
            <div className="page-wrapper">
              
             
              <div className="content">
                {/* <ErrorBoundary fallback={<div className='my-40 px-20 font-bold'>Something went wrong refresh page</div>}> */}
                <ProtectedRoute>
                  <AdminProtectedRoute>
                    <Outlet />
                  </AdminProtectedRoute>
                </ProtectedRoute>
                {/* </ErrorBoundary> */}
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  };
  const BasicLayout = () => {
    return (
      <div className="main">
        <Outlet />
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
          path: "/forgotpassword",
          element: <ForgotPassword />,
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
          path: "/admin/employee/:id",
          element: <ShowEmployee />,
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
          path: "/admin/createannouncement",
          element: <CreateAnnouncement />,
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