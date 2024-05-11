import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import "../App.css"
import { removeUser, selectUserData } from "../features/userSlice";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const currentUser = useSelector(selectUserData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user,setUser]=useState('');
    const auth=getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getDoc(doc(db, "users", user.uid))
        setUser(userData.data());
      }
    });
  }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            dispatch(removeUser());
            navigate('/signin');
        } catch (error) {
            console.error("Error signing off", error);
        }
    };

    const handleSignIn = () => {
        handleClose();
        navigate("/signin");
    };

    const handleSignUp = () => {
        handleClose();
        navigate("/signup");
    };

    return (
        <AppBar position="static">
            <Toolbar style={{ justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: "Georgia, serif" }}>
                    SplitWise
                </Typography>
                <div>
                    <IconButton color="inherit" onClick={handleClick}>
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {currentUser ? (
                            <div>
                                <MenuItem>
                                    <div style={{ padding: "10px" }}>
                                        <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{currentUser.name}</p>
                                        <p style={{ color: "#777" }}>{currentUser.email}</p>
                                    </div>
                                </MenuItem>
                                <MenuItem onClick={handleSignout}>Logout</MenuItem>
                            </div>
                        ) : (
                            <div>
                                <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
                                <MenuItem onClick={handleSignUp}>Sign Up</MenuItem>
                            </div>
                        )}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
