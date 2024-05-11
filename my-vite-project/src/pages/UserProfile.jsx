import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAuth ,onAuthStateChanged} from 'firebase/auth';
import { doc, getDoc,getDocs, getFirestore } from 'firebase/firestore';
import { selectUserData } from '../features/userSlice';
import { db } from '../firebase';
import "../styles/global.css"
const UserProfilePage = () => {
  const [user, setUser] = useState([])
  const auth=getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapshot = await getDoc(doc(db, "users", user.uid))
        setUser(user);
        console.log(snapshot);
        console.log(snapshot.data());
        console.log(user.displayName);
      }
    });
  }, []);

  

  return (
    <div>
      <h2>User Profile</h2>
    
      {user && (
                            <div >
                                <div style={{ padding: "10px" }}>
                                    <p style={{ marginBottom: "5px", fontWeight: "bold" }}>{user.displayName}</p>
                                    <p style={{ color: "#777" }}>{user.email}</p>
                                </div>
                            </div>
                        )}
    
    </div>
  );
};

export default UserProfilePage;
