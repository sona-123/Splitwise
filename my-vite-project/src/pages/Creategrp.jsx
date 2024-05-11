import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import {addDoc,collection,getDocs} from "firebase/firestore"
import { TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import {db} from "../firebase"
const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [allUsers,setAllUsers]=useState([]);
  const [showLists,setShowLists]=useState(false);
  const [error,setError]=useState(' ');
const [uid,setuId]=useState();
  const handleAddUser=(selectedUser)=>{
      
      setUsers([...users, selectedUser]);
      alert(`user ${selectedUser} added successfully`);
      setShowLists(false);
  }
  const handleCreateGroup=async()=>{
    if (!groupName || !groupDescription || !users.length) {
      setGroupName('');
        setGroupDescription('');
        setUsers([]);
        setUserEmail('');
      setError('All fields are required...'); 
      alert('All fields are required...');// Set formError to true if any required field is empty
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "rooms"), {
        groupName,
        groupDescription,
        users,
      });
  
      console.log("Document saved with id:", docRef.id);
      setGroupName('');
      setGroupDescription('');
      setUsers([]);
      setUserEmail('');
      setError('');
      setuId(docRef.id); // Set the UID of the room
    } catch (error) {
      setError("Unable to create this group");
    }
    console.log(uid);
  }
 
  const fetchAllUsers=async()=>{
      const usersSnapshot=await getDocs(collection(db,"users"));
      const usersData=usersSnapshot.docs.map(doc=>doc.data());
      setAllUsers(usersData);
  } 
  useEffect(()=>{
    fetchAllUsers();
  },[]);
return(


  <div className="flex">
      {/* Dashboard (Sidebar) */}
      <div className="bg-gray-200 h-screen p-4">
        <Dashboard />
      </div>

      {/* Main Content (CreateGroup Form) */}
      <div className="flex-1 p-4">
        <Typography variant="h5" gutterBottom>Create Group</Typography>
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
        <div className="flex items-center">
          {/* <TextField
            id="userEmail"
            label="Add User"
            variant="outlined"
            // fullWidth
            required
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            margin="normal"
          /> */}
          <Button
            variant="contained"
            color="primary"
            onClick={()=>setShowLists(!showLists)}
            required
            style={{ marginLeft: '10px' }}
          >
            Add User +
          </Button>
        </div>
        {showLists && (<List>
          {allUsers.map((user, index) => (
            <div className="cursor-pointer p-2  border border-gray-300 rounded-md hover:bg-gray-100" key={index} onClick={() => handleAddUser(user.email)}>
            {user.email}
          </div>
          
          ))}
        </List>)}
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateGroup}
          style={{ marginTop: '20px' }}
        >
          Create Group
        </Button>
      </div>
    </div>
  );
};

export default CreateGroup;
