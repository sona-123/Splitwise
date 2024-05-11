import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard";

import { useSelector, useDispatch } from "react-redux";
import { selectUserData, updateUser } from "../features/userSlice";
import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { TextField, Button, Typography, List } from "@mui/material";
import { db } from "../firebase";
import Navbar from "./Navbar";
import '../App.css'
const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showLists, setShowLists] = useState(false);
  const [error, setError] = useState("");
  const [Expenses, setExpenses] = useState([]);
  const currentUser = useSelector(selectUserData);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersData = usersSnapshot.docs.map((doc) => doc.data());
    setAllUsers(usersData);
  };

  const generateChatId = () => {
    return doc(collection(db, `users/${currentUser.uid}/groupChats`)).id;
  };

  const handleAddUser = (selectedUser) => {
    setUsers([...users, selectedUser]);
    alert(`User ${selectedUser} added successfully`);
    setShowLists(false);
  };

  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription || !users.length) {
      setError("All fields are required...");
      return;
    }

    try {
      if (!currentUser || !currentUser.uid) {
        setError("User not authenticated");
        return;
      }

      const userChatCollectionRef = collection(
        db,
        `users/${currentUser.uid}/groupChats`
      );
      const chatId = generateChatId();

      const docRef = await addDoc(userChatCollectionRef, {
        groupName,
        groupDescription,
        users,
        chatId,
        Expenses,
      });

      dispatch(
        updateUser({
          ...currentUser,
          groupChats: [
            ...currentUser.groupChats,
            {
              groupName,
              groupDescription,
              users,
              chatId,
              Expenses,
            },
          ],
        })
      );

      setGroupName("");
      setGroupDescription("");
      setUsers([]);
      setError("");
      setExpenses([{}]);
    } catch (error) {
      console.error("Error creating group:", error);
      setError("Unable to create this group");
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="flex">
    {/* className="bg-gray-200 h-screen p-4" */}
      <div >
        <Dashboard />
      </div>
      <div className="flex-1 p-4">
        <Typography variant="h5" className="mb-4 font-bold " style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Create Group
        </Typography>
        <TextField
          id="groupName"
          label="Group Name"
          variant="outlined"
          fullWidth
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
        />
        <TextField
          id="groupDescription"
          label="Group Description"
          variant="outlined"
          fullWidth
          multiline
          required
          rows={4}
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          margin="normal"
        />
        <div className="flex items-center mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowLists(!showLists)}
            required
          >
            {showLists ? "Hide User List" : "Add User"}
          </Button>
        </div>
        {showLists && (
          <List className="mt-4">
            {allUsers.map((user, index) => (
              <div
                className="cursor-pointer p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                key={index}
                onClick={() => handleAddUser(user.email)}
              >
                {user.email}
              </div>
            ))}
          </List>
        )}
        {error && (
          <Typography variant="body2" className="text-red-500 mt-4">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateGroup}
          className="mt-4"
        >
          Create Group
        </Button>
      </div>
    </div>
    </div>
  );
};

export default CreateGroup;
