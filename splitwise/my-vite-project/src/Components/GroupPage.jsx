import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getDocs, query,updateDoc, collection, where, Timestamp,doc } from 'firebase/firestore';
import { db } from '../firebase';
import { selectUserData } from '../features/userSlice';
import Dashboard from '../pages/dashboard';
import ViewExpenseDetails from './ExpenseDetailPage';
import ManagePayments from './ManagePayments';
import Navbar from '../pages/Navbar';
const ChatPage = () => {
    const currentUser = useSelector(selectUserData);
    const { chatId } = useParams(); 
    const [chatDetails, setChatDetails] = useState(null);
    const [showUsers, setShowUsers] = useState(false);
    const [showViewExpenses, setShowViewExpenses] = useState(false);
    const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expensePaidBy, setExpensePaidBy] = useState('');
    const [expenseSplitAmong, setExpenseSplitAmong] = useState([]);

    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const chatQuery = query(
                    collection(db, `users/${currentUser.uid}/groupChats`),
                    where("chatId", "==", chatId)
                );
                const chatSnapshot = await getDocs(chatQuery);
                if (!chatSnapshot.empty) {
                    chatSnapshot.forEach((doc) => {
                        setChatDetails(doc.data());
                    });
                } else {
                    console.error("Chat document not found.");
                }
            } catch (error) {
                console.error("Error fetching chat details:", error);
            }
        };

        fetchChatDetails();
    }, [chatId, currentUser.uid]);

    const handleAddExpense = async () => {
        try {
            const newExpenseData = {
                groupId: chatId, // Use groupId from chatDetails
                expenseId: `expense_${Timestamp.now().seconds}`,
                expenseTitle,
                expenseAmount,
                expensePaidBy,
                expenseSplitAmong
            };
    
            // Query the groupChats collection to find the specific groupChat document
            const chatQuery = query(
                collection(db, `users/${currentUser.uid}/groupChats`),
                where("chatId", "==", chatDetails.chatId) // Use chatId from chatDetails
            );
            const chatSnapshot = await getDocs(chatQuery);
    
            // Get a reference to the specific groupChat document
            const groupChatDoc = chatSnapshot.docs[0]; // Assuming there's only one document with the specified chatId
    
            // Update the expenses field directly within the groupChat document
            await updateDoc(groupChatDoc.ref, {
                expenses: [...(chatDetails.expenses || []), newExpenseData]
            });
    
            // Clear input fields and toggle add expense form
            setExpenseTitle('');
            setExpenseAmount('');
            setExpensePaidBy('');
            setExpenseSplitAmong([]);
            setShowAddExpenseForm(false);
        } catch (err) {
            console.log("Error in adding expenses...", err);
        }
    };
    useEffect(()=>{
        handleAddExpense();
    },[chatId,currentUser.uid]);
   
    const handleViewExpensesList = () => {
        setShowViewExpenses(true);
        setShowAddExpenseForm(false);
    };

    const handleAddExpenseForm = () => {
        setShowAddExpenseForm(true);
        setShowViewExpenses(false);
    };
  

    return (
        <div>
        <Navbar/>
      <div className='flex'>
          <div>
              <Dashboard />
          </div>
         
          {chatDetails && (
              <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
                  <Typography variant="h5" gutterBottom className="text-xl font-bold mb-4">{chatDetails.groupName}</Typography>
                  <Typography variant="body1" gutterBottom className="text-gray-700 mb-4">{chatDetails.groupDescription}</Typography>
                  <div>
                  <div>

                  <Button variant="contained" onClick={handleAddExpenseForm}>Add Expenses</Button>
                  <Button variant="contained" onClick={handleViewExpensesList}>View Expenses</Button>
                  </div>
                  <ManagePayments/>
                  </div>
                  {showUsers && (
                      <List className="divide-y divide-gray-300">
                          {chatDetails.users.map((user, index) => (
                              <ListItem key={index} className="py-2">
                                  <ListItemText primary={user} />
                              </ListItem>
                          ))}
                      </List>
                  )}
                  <Button variant="outlined" onClick={() => setShowUsers(!showUsers)}>{showUsers ? 'Hide Users' : 'View Users'}</Button>
              </div>
          )}
          {showAddExpenseForm && (
              <div>
                  <Typography variant="h5" gutterBottom className="text-xl font-bold mb-4">Add Expense</Typography>
                  <TextField
                      label="Title"
                      variant="outlined"
                      fullWidth
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      margin="normal"
                  />
                  <TextField
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      margin="normal"
                  />
                  <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Paid By</InputLabel>
                      <Select
                          value={expensePaidBy}
                          onChange={(e) => setExpensePaidBy(e.target.value)}
                          label="Paid By"
                      >
                          {chatDetails.users.map((user, index) => (
                              <MenuItem key={index} value={user}>{user}</MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Split Among</InputLabel>
                      <Select
                          multiple
                          value={expenseSplitAmong}
                          onChange={(e) => setExpenseSplitAmong(e.target.value)}
                          label="Split Among"
                          renderValue={(selected) => selected.join(', ')} // Display selected values as a comma-separated list
                      >
                          {chatDetails.users.map((user, index) => (
                              <MenuItem key={index} value={user}>{user}</MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" onClick={handleAddExpense}>Add Expense</Button>
              </div>
          )}

          {showViewExpenses && (
              <div>
                  <ViewExpenseDetails/>
              </div>
          )}
         
                      </div>
      </div>
    
    );
};

export default ChatPage;

{/* <div>
        <Navbar/>
      <div className='flex'>
          <div>
              <Dashboard />
          </div>
         
          {chatDetails && (
              <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
                  <Typography variant="h5" gutterBottom className="text-xl font-bold mb-4">{chatDetails.groupName}</Typography>
                  <Typography variant="body1" gutterBottom className="text-gray-700 mb-4">{chatDetails.groupDescription}</Typography>
                  <div>
                  <div>

                  <Button variant="contained" onClick={handleAddExpenseForm}>Add Expenses</Button>
                  <Button variant="contained" onClick={handleViewExpensesList}>View Expenses</Button>
                  </div>
                  <ManagePayments/>
                  </div>
                  {showUsers && (
                      <List className="divide-y divide-gray-300">
                          {chatDetails.users.map((user, index) => (
                              <ListItem key={index} className="py-2">
                                  <ListItemText primary={user} />
                              </ListItem>
                          ))}
                      </List>
                  )}
                  <Button variant="outlined" onClick={() => setShowUsers(!showUsers)}>{showUsers ? 'Hide Users' : 'View Users'}</Button>
              </div>
          )}
          {showAddExpenseForm && (
              <div>
                  <Typography variant="h5" gutterBottom className="text-xl font-bold mb-4">Add Expense</Typography>
                  <TextField
                      label="Title"
                      variant="outlined"
                      fullWidth
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      margin="normal"
                  />
                  <TextField
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      margin="normal"
                  />
                  <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Paid By</InputLabel>
                      <Select
                          value={expensePaidBy}
                          onChange={(e) => setExpensePaidBy(e.target.value)}
                          label="Paid By"
                      >
                          {chatDetails.users.map((user, index) => (
                              <MenuItem key={index} value={user}>{user}</MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Split Among</InputLabel>
                      <Select
                          multiple
                          value={expenseSplitAmong}
                          onChange={(e) => setExpenseSplitAmong(e.target.value)}
                          label="Split Among"
                          renderValue={(selected) => selected.join(', ')} // Display selected values as a comma-separated list
                      >
                          {chatDetails.users.map((user, index) => (
                              <MenuItem key={index} value={user}>{user}</MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" onClick={handleAddExpense}>Add Expense</Button>
              </div>
          )}

          {showViewExpenses && (
              <div>
                  <ViewExpenseDetails/>
              </div>
          )}
         
                      </div>
      </div> */}


