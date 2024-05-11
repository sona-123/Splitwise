import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, updateDoc,getDocs,query,where,collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Typography, TextField, Button, Chip } from '@mui/material';
import { selectUserData } from '../features/userSlice';
import {useSelector} from 'react-redux';
import Dashboard from './dashboard';
const ModifyGroupChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupUsers, setGroupUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const currentUser=useSelector(selectUserData);
  useEffect(() => {
    const fetchGroupChatDetails = async () => {
      try {
        const chatQuery = query(
          collection(db, `users/${currentUser.uid}/groupChats`),
          where("chatId", "==", chatId)
      );
      const chatSnapshot = await getDocs(chatQuery);
      if (!chatSnapshot.empty) {
          chatSnapshot.forEach((doc) => {
              // setChatDetails(doc.data());
              setGroupName(doc.data().groupName);
              setGroupDescription(doc.data().groupDescription);
              setGroupUsers(doc.data().users);
              console.log(groupUsers);
          });
      } else {
          console.error("Chat document not found.");
      }
        
      } catch (error) {
        console.error('Error fetching group chat details:', error);
      }
    };

    fetchGroupChatDetails();
  }, [chatId]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => doc.data());
        setAllUsers(usersData);
        console.log(allUsers);

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleAddUser = (email) => {
    if (!groupUsers.includes(email)) {
      setGroupUsers(prevUsers => [...prevUsers, email]);
    }
  };

  const handleRemoveUser = (userId) => {
    setGroupUsers(prevUsers => prevUsers.filter(id => id !== userId));
  };

  const handleSaveChanges = async () => {
    try {
      const chatQuery = query(
        collection(db, `users/${currentUser.uid}/groupChats`),
        where("chatId", "==", chatId)
      );
      
      const chatQuerySnapshot = await getDocs(chatQuery);
      
      if (!chatQuerySnapshot.empty) {
        const chatDocRef = chatQuerySnapshot.docs[0].ref;
        await updateDoc(chatDocRef, {
          groupName,
          groupDescription,
          users: groupUsers
        });
        navigate('/view-groups');
      } else {
        console.error('Group chat document not found.');
      }
    } catch (error) {
      console.error('Error updating group chat:', error);
    }
  };
  

  return (
    <div className="flex">
  <div className="mb-8">
    <Dashboard />
  </div>
  <div className="w-full max-w-lg bg-white shadow-md p-8 rounded-lg">
    <Typography variant="h5" gutterBottom>Modify Group Chat</Typography>
    <TextField
      label="Group Name"
      variant="outlined"
      fullWidth
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      margin="normal"
    />
    <TextField
      label="Group Description"
      variant="outlined"
      fullWidth
      multiline
      rows={4}
      value={groupDescription}
      onChange={(e) => setGroupDescription(e.target.value)}
      margin="normal"
    />
    <Typography variant="h6">Group Users:</Typography>
    <div className="flex flex-wrap gap-2">
      {groupUsers.map(emailId => {
        const user = allUsers.find(u => u.email === emailId);
        return (
          <Chip
            key={emailId}
            label={user ? user.name : 'Unknown User'}
            onDelete={() => handleRemoveUser(emailId)}
            className="bg-blue-500 text-white"
          />
        );
      })}
    </div>
    <Typography variant="h6">Add Users:</Typography>
    <div className="flex flex-wrap gap-2">
      {allUsers.map(user => (
        <Chip
          key={user.email}
          label={user.name}
          onClick={() => handleAddUser(user.email)}
          className="cursor-pointer"
        />
      ))}
    </div>
    <Button variant="contained" color="primary" onClick={handleSaveChanges}>Save Changes</Button>
  </div>
</div>
  );
};

export default ModifyGroupChatPage;
