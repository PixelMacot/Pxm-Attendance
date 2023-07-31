// Sidebar.js
import React from 'react';
import { FaHome, FaUser, FaCog, FaSignOutAlt,FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-[100vw] px-10 my-5  border border-gray-200 bg-white border-r-2 text-black  flex  gap-10  items-center py-4">
      <div className="mb-4">
        <Link to="/admin" className="text-black">
          <FaHome size={24} />
        </Link>
      </div>
      <div className="mb-4">
        <Link to="/admin/calendar" className="text-black">
          <FaCalendarAlt size={24} />
        </Link>
      </div>
    
    </div>
  );
};

export default Sidebar;
