import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Month from './pages/Month';
import Navbar from './components/Navbar';
import Location from './components/location';

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
          </Routes>
        </section>
        <Location/>
      </div>
    </Router>
  );
}

export default App;