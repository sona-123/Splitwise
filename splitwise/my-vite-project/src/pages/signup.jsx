import React from 'react';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../features/userSlice';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function SignupForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
            pic: null,
            groupChats: [{}],
        },
        onSubmit: async (values) => {
            try {
                const { email, password, name, pic, groupChats } = values;

                // Create user with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Set user data in Firestore
                const userRef = doc(collection(db, 'users'), user.uid);
                await setDoc(userRef, {
                    name,
                    email,
                    pic: pic || 'default-profile-pic-url',
                    uid: user.uid,
                    groupChats,
                });

                // Dispatch action to update Redux store
                dispatch(updateUser({ uid: user.uid, name, email, pic, groupChats }));

                navigate('/dashboard');
            } catch (error) {
                console.error('Error signing up:', error);
            }
        },
    });

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-reqLblue to-reqDblue">
            <p className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">Sign Up</p>
            <form onSubmit={formik.handleSubmit} className="w-full max-w-md bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold text-sm md:text-base mb-2">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        className="w-full bg-gray-200 border border-gray-400 rounded-md py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-reqLblue"
                        placeholder="Enter your name"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold text-sm md:text-base mb-2">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="w-full bg-gray-200 border border-gray-400 rounded-md py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-reqLblue"
                        placeholder="Enter your email"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold text-sm md:text-base mb-2">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        className="w-full bg-gray-200 border border-gray-400 rounded-md py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-reqLblue"
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit" className="bg-reqLblue text-white px-4 py-2 rounded-md font-semibold w-full">Submit</button>
            </form>
        </div>
    );
}
