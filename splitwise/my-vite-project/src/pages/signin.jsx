import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Link, Container ,IconButton} from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateUser } from '../features/userSlice';
import { db } from '../firebase';
import { Google } from '@mui/icons-material';

const SignIn = () => {
    const auth = getAuth(app);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const signInUser = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            console.log(user);
            const snapshot = await getDoc(doc(db, 'users', user.uid));

            if (snapshot.exists()) {
                const userData = snapshot.data();
                dispatch(updateUser({
                    name: userData.name,
                    email: userData.email,
                    pic: userData.pic,
                    uid: user.uid,
                    groupChats: userData.groupChats || [{}],
                }));
            } else {
                console.log('User does not exist in firestore');
            }
            navigate('/dashboard');
            
        } catch (err) {
            console.log('Error in signing in...:', err);
        }
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
      
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-reqLblue to-reqDblue">
                <p className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">Sign In</p>
                <form className="w-full max-w-md bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold text-sm md:text-base mb-2">Email</label>
                        <TextField 
                            className='w-full bg-gray-200 border border-gray-400 rounded-md py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-reqLblue'
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
                    </div>
                    <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold text-sm md:text-base mb-2">Password</label>
                        <TextField
                            className='w-full bg-gray-200 border border-gray-400 rounded-md py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-reqLblue'
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
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                        <Button
                            onClick={signInUser}
                            variant="contained"
                            color="primary"
                            className="w-full md:w-auto mb-2 md:mb-0"
                        >
                            Sign In
                        </Button>
                    <IconButton onClick={signInWithGoogle} variant="outlined" color="primary">
                        <Google />
                    </IconButton>
                        <Link href="/signup" variant="body2" className="text-center md:text-left">
                            Don't have an account? Sign Up
                        </Link>
                    </div>
                    <div>
                       
                </div>
                </form>
            </div>
     
    );
};

export default SignIn;
