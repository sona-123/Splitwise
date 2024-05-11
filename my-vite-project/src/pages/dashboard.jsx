import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation

const Dashboard = () => {
  const location = useLocation();

  return (
    <div>
      <div className="flex">
        {/* Sidebar */}
        <div className="bg-gray-200 h-screen p-4">
          <ul>
            <li className={`mb-2 ${location.pathname === '/create-group' ? 'text-blue-500' : ''}`}>
              <Link to="/create-group" className="cursor-pointer">Create Group</Link>
            </li>
            <li className={`mb-2 ${location.pathname === '/view-groups' ? 'text-blue-500' : ''}`}>
              <Link to="/view-groups" className="cursor-pointer">View Groups</Link>
            </li>
            {/* Add other necessary sidebar items */}
          </ul>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Main content of the dashboard */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
