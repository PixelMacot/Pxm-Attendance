import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import NoPage from './pages/NoPage';
import Month from './pages/Month';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Admin from './pages/Admin';


function App() {

  return (
    <Router>
      <div>
        <Navbar />
        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Month" element={<Month />} />
            <Route path="/attendance/:id" element={<Attendance />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </section>
  <Footer/>
      </div>
    </Router>
  );
}

export default App;