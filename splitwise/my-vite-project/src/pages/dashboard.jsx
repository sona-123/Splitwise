import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, Link, useNavigate } from "react-router-dom"
import "../App.css"
import { removeUser, selectUserData } from "../features/userSlice";
import Navbar from "./Navbar";
const Dashboard = () => {
  const currentUser = useSelector(selectUserData);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      dispatch(removeUser());
      navigate('/signin');
    } catch (error) {
      console.error("Error signing off", error);
    }
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    // <div>
    //   {/* <div>
    //     <Navbar/>
    //   </div> */}
      <div className="flex">
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
   // </div>
  );
};

export default Dashboard;
