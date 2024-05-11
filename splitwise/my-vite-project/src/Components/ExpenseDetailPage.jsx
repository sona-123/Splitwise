import React, { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { selectUserData } from '../features/userSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from '../firebase';

const ViewExpenseDetails = () => {
    const { chatId } = useParams();
    const currentUser = useSelector(selectUserData);
    const [chatDetails, setChatDetails] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null); // State to hold selected expense details
    
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
            }
        } catch (err) {
            console.log("Error fetching chat details:", err);
        }
    };

    useEffect(() => {
        fetchChatDetails();
    }, [chatId, currentUser.uid]);

    // Function to handle click on expense item and show complete details
    const handleExpenseClick = (expense) => {
        setSelectedExpense(expense);
    };

    return (
        <div className="flex flex-col items-center">
    <form className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="mb-4">
            <Typography variant="h4" gutterBottom className="mb-4">Expense Details</Typography>
            {chatDetails && chatDetails.expenses && chatDetails.expenses.map((expense, index) => (
                <div key={index} onClick={() => handleExpenseClick(expense)} className="cursor-pointer p-4 border border-gray-300 rounded-lg mb-2 hover:bg-gray-100">
                    <Typography variant="h6" gutterBottom>{expense.expenseTitle}</Typography>
                </div>
            ))}
        </div>
        {/* Render complete details of the selected expense */}
        {selectedExpense && (
            <div className="p-4 shadow-lg rounded-lg bg-white">
                <Typography variant="h5" gutterBottom>{selectedExpense.expenseTitle}</Typography>
                <Typography variant="body1" gutterBottom>Amount: {selectedExpense.expenseAmount}</Typography>
                <Typography variant="body1" gutterBottom>Paid By: {selectedExpense.expensePaidBy}</Typography>
                <Typography variant="body1" gutterBottom>Split Among: {selectedExpense.expenseSplitAmong.join(', ')}</Typography>
                <Button variant="contained" color="primary" onClick={() => setSelectedExpense(null)}>Go Back</Button>
            </div>
        )}
    </form>
</div>

    
    
    );
};

export default ViewExpenseDetails;
