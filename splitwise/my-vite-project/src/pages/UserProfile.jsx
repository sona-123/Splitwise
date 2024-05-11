import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAuth ,onAuthStateChanged} from 'firebase/auth';
import { doc, getDoc,getDocs, getFirestore } from 'firebase/firestore';
import { selectUserData } from '../features/userSlice';
import { db } from '../firebase';
import "../styles/global.css"
const UserProfilePage = () => {
  const currentUser=useSelector(selectUserData);
  console.log(currentUser);
  const [user, setUser] = useState([]);
  // const auth=getAuth();
  // useEffect(() => {
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const userData = await getDoc(doc(db, "users", user.uid))
  //       setUser(userData.data());
  //       console.log(userData);
  //     //  console.log(userData.data().name);
  //       console.log(user);
  //     }
  //   });
  // }, []);

  

  return (
    <div>
      <h2>User Profile</h2>
    
      {currentUser && (
                            <div >
                                <div style={{ padding: "10px" }}>
                                    <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{currentUser.name}</p>
                                    <p style={{ color: "#777" }}>{currentUser.email}</p>
                                </div>
                            </div>
                        )}
    
    </div>
  );
};

export default UserProfilePage;
