import React, { useEffect, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { selectUserData } from '../features/userSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from '../firebase';

const ManagePayments = () => {
    const { chatId } = useParams();
    const currentUser = useSelector(selectUserData);
    const [chatDetails, setChatDetails] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState([]);

    const fetchChatDetails = async () => {
        try {
            const chatQuery = query(
                collection(db, `users/${currentUser.uid}/groupChats`),
                where("chatId", "==", chatId)
            );
            const chatSnapshot = await getDocs(chatQuery);
            if (!chatSnapshot.empty) {
                chatSnapshot.forEach((doc) => {
                    const data = doc.data();
                   // setChatDetails(data);
                    calculatePayments(data);
                });
            }
        } catch (err) {
            console.log("Error fetching chat details:", err);
        }
    };

    // Calculate payments based on user balances
    const calculatePayments = (data) => {
        if (data && data.expenses) {
            const balances = {};
            data.expenses.forEach((expense) => {
                const paidBy = expense.expensePaidBy;
                const splitAmong = expense.expenseSplitAmong;
                const amount = parseFloat(expense.expenseAmount);
                const share = amount / splitAmong.length;
                // Subtract the share from the user who paid
                if (balances[paidBy]) {
                    balances[paidBy] -= amount;
                } else {
                    balances[paidBy] = -amount;
                }
                // Add the share to each user in splitAmong
                splitAmong.forEach((user) => {
                    console.log(currentUser.email)
                    if(user==currentUser.email){
                        user=="you";
                    }
                    if (balances[user]) {
                        balances[user] += share;
                    } else {
                        balances[user] = share;
                    }
                });
            });
            // Generate payment details
            const payments = [];
            for (const user1 in balances) {
                for (const user2 in balances) {
                    if (user1 !== user2) {
                        const balance1 = balances[user1];
                        const balance2 = balances[user2];
                        if (balance1 > 0 && balance2 < 0) {
                            const paymentAmount = Math.min(Math.abs(balance1), Math.abs(balance2));
                            payments.push({ from: user1, to: user2, amount: paymentAmount });
                        }
                    }
                }
            }
            setPaymentDetails(payments);
        }
    };

    useEffect(() => {
        fetchChatDetails();
    }, [chatId, currentUser.uid]);

    return (
        <div>
          
            {paymentDetails.length > 0 && (
                <Box mt={4}>
                   
                    {paymentDetails.map((payment, index) => (
                        <Box key={index} mt={2} p={2} boxShadow={2} borderRadius={4} style={{ width: '300px', backgroundColor: '#fff' }}>
                            <Typography variant="body1" gutterBottom>{payment.from} has to pay  ${payment.amount.toFixed(2)} to {payment.to}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </div>
    );
};

export default ManagePayments;
