// Layout.js
import React from "react";
import Navbar from "./Navbar";
import { Dashboard } from "@mui/icons-material";

const Layout = ({ children }) => {
  return (
    <div>
      {/* <Dashboard /> */}
      {children}
    </div>
  );
};

export default Layout;
