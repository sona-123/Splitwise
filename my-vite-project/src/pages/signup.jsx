import React, { useState } from 'react';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../features/userSlice';

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      pic: null,
    },
    onSubmit: async (values) => {
      try {
        const { email, password, name, pic } = values;

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user data to Firestore
        await db.collection('users').doc(user.uid).set({
          name,
          email,
          pic: pic || 'default-profile-pic-url', // Set default profile pic URL if pic is not provided
        });

        // Dispatch action to update user state in Redux store
        dispatch(updateUser({ uid: user.uid, name, email, pic }));

        // Redirect to dashboard after successful signup
        navigate('/dashboard');
      } catch (error) {
        console.error('Error signing up:', error);
      }
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-reqLblue">
      <p className="text-white text-2xl font-semibold mb-4">Sign Up</p>
      <form onSubmit={formik.handleSubmit} className="w-40 sm:w-1/2 bg-reqDblue p-8 rounded-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-white">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="w-full bg-white rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-white">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full bg-white rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-white">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full bg-white rounded-md p-2"
          />
        </div>

        <button type="submit" className="bg-reqLblue text-white px-4 py-2 rounded-md font-semibold">
          Submit
        </button>
      </form>
    </div>
  );
}
