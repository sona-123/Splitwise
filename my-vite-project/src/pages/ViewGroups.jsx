import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import { List, ListItem, ListItemText } from "@mui/material";

const ViewGroups = () => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const roomsSnapshot = await getDocs(collection(db, "rooms"));
      const roomData = roomsSnapshot.docs.map((doc) => doc.data());
      setRooms(roomData);
      console.log(roomData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex">
        <div className="bg-gray-200 h-screen p-4">

      <Dashboard />
        </div>
      <div variant="outlined" style={{ margin: '20px', padding: '20px', width:'800px'}}>
        <List>
          {rooms && rooms.map((room, index) => (
            <ListItem
              key={index}
              className="cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100"
              component={Link}
              to={`/room/${room.uid}`}
            >
              <ListItemText primary={room.groupName} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ViewGroups;
