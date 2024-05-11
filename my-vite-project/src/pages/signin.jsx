// SignIn.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Link, Container, Grid } from '@mui/material';

const SignIn = () => {
    const auth = getAuth(app);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signInUser = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log('User signed in successfully');
            navigate('/dashboard');
        })
        .catch(error => console.error('Error signing in:', error));
    }

    const signInWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
        .then(() => {
            console.log('Sign in with Google successful');
            navigate('/dashboard');
        })
        .catch(error => console.error('Error signing in with Google:', error));
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className="signin-container">
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <form className="signin-form">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        onClick={signInUser}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="signin-button"
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                <div className="signin-google">
                    <Button
                        onClick={signInWithGoogle}
                        fullWidth
                        variant="outlined"
                        color="primary"
                    >
                        Sign In with Google
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default SignIn;
