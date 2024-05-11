import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FirebaseProvider } from './pages/firebaseContextProvider';
import SignUp from './pages/signup';
import SignIn from './pages/signin';
import Dashboard from './pages/dashboard';
import AnimatedCover from './pages/frontPage';
import UserProfilePage from './pages/UserProfile';
import Layout from './pages/Layout';
import CreateGroup from './pages/Creategrp';
import ViewGroups from './pages/ViewGroups';


const App = () => {
  return (
    <Router>
      <FirebaseProvider>
         {/* Include the Navbar component outside of the Routes */}
         <Routes>
         <Route path="/" element={<AnimatedCover />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/signin" element={<SignIn />} />
         </Routes>
        <Layout> {/* Use the Layout component as a wrapper */}
     

          <Routes>
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/view-groups" element={<ViewGroups />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/userProfile" element={<UserProfilePage />} />
            {/* Add more routes as needed */}
          </Routes>
      
        </Layout>
      </FirebaseProvider>
    </Router>
  );
};

export default App;
