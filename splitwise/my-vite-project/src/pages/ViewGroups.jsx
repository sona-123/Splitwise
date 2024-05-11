import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { getDocs, collection,query,deleteDoc,where } from "firebase/firestore";
import { List, ListItem, ListItemText ,Button} from "@mui/material";
import { selectUserData } from "../features/userSlice";
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Navbar from "./Navbar";
import '../App.css'

const ViewGroups = () => {
  const [chats, setChats] = useState([]);
  const currentUser = useSelector(selectUserData);
  const navigate=useNavigate();
  const fetchRooms = async () => {
    try {
      const userChatCollectionRef = collection(db, `users/${currentUser.uid}/groupChats`);
      const chatsSnapshot = await getDocs(userChatCollectionRef);
      const chatData = chatsSnapshot.docs.map(doc => doc.data());
      setChats(chatData);
      console.log(chatData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentUser]); // Add dependency on currentUser to fetch new data when it changes
  const handleDelete = async (chatId) => {
    try {
        const groupChatQuery = query(
            collection(db, `users/${currentUser.uid}/groupChats`),
            where("chatId", "==", chatId)
        );
        const chatSnapshot = await getDocs(groupChatQuery);
        if (!chatSnapshot.empty) {
            chatSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref); // Use doc.ref to get the reference to the document
            });
            fetchRooms(); // Fetch rooms after deleting the chat
            
            navigate('/view-groups');
        } else {
            console.error("Chat document not found.");
        }
    } catch (error) {
        console.error("Error deleting chat:", error);
    }
}

  return (
    <div>
      <Navbar/>
    <div className="flex">
      <div >
        <Dashboard />
      </div>
      <div variant="outlined" style={{ margin: '20px', padding: '20px', width: '800px' }}>
        <List>
          {chats && chats.map((chat, index) => (
            <ListItem
              key={index}
              className="cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100"
              component={Link}
              to={`/groupChats/${chat.chatId}`}
            >
              <ListItemText primary={chat.groupName} />
              <div>
                <Button component={Link} to={`/groupChats/modify/${chat.chatId}`} variant="contained" color="primary" style={{ marginRight: '10px' }}>Modify</Button>
                <Button onClick={()=>handleDelete(chat.chatId)} variant="contained" color="secondary">Delete</Button>
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
    </div>
  );
};

export default ViewGroups;
