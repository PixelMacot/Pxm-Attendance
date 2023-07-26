import React, { useContext } from 'react';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { createBrowserRouter, RouterProvider, Outlet,Navigate} from "react-router-dom";
// import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Admin from './pages/Admin';

import { AuthContext } from "./context/AuthContext";
import NotVerified from './pages/NotVerified';
import Pages from './pages/Pages';
import Test from './pages/Test';

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    else{
      if(currentUser.isverified){
        console.log("user is verified")
      }else{
        console.log("user is not verified")
        return <Navigate to="/notverified" />;
      }
    }

    return children
  };

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
          </div>
          <div className="contentContainer">
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          </div>
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
          element: <Admin />,
        },
        {
          path: "/adminpanel",
          element: <Pages />,
        },
        {
          path: "/attendance/:id",
          element: < Attendance />,
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/apptest",
      element: <Test/>,
    },
    {
      path: "/notverified",
      element: <NotVerified/>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;