import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {useNavigate} from "react-router-dom"
import "../App.css"
const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const navigate=useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const snapshot = await getDoc(doc(db, 'users', user.uid));
                setUser(user);
                console.log(snapshot);
                console.log(snapshot.data());
                console.log(user.displayName);
            } else {
                setUser(null);
            }
        });
    }, [auth]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignout = async () => {
        try {
            await signOut(auth);
            console.log("User Signed Out..");
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
                        {user ? (
                            [
                                <MenuItem key="user-details" onClick={handleClose}>
                                    <div style={{ padding: "10px" }}>
                                        <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{user.displayName}</p>
                                        <p style={{ color: "#777" }}>{user.email}</p>
                                    </div>
                                </MenuItem>,
                                <MenuItem key="logout" onClick={handleSignout}>Logout</MenuItem>
                            ]
                        ) : (
                            [
                                <MenuItem key="sign-in" onClick={handleSignIn}>Sign In</MenuItem>,
                                <MenuItem key="sign-up" onClick={handleSignUp}>Sign Up</MenuItem>
                            ]
                        )}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
