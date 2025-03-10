import React, { createContext, useContext, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const {user,socket} = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUsersLoading, setIsUserLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    // get all Users
    const getUsers = async () => {
        try {
            setIsUserLoading(true);
            const usersRef = collection(db, "Chatify");
            const usersSnapshot = await getDocs(usersRef);
            
            const users = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            setUsers(users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsUserLoading(false);
        }
    };

    // send message
    const sendMessage = async (messageData) => {
        try {
            const data = [messageData , user.userId];
            const res = await axiosInstance.post(`/messages/send/${selectedUser.userId}`, data);
            setMessages((prevMessages) => [...prevMessages, res.data]);
            socket.emit("sendMessage", { ...res.data, recipientId: selectedUser.userId });
        } catch (error) {
            if (error.response?.status === 413) {
                toast.error('File too large'); // Show toast error message
            } else {
                console.error('Failed to send message:', error.message); // Log error for debugging
            }
        }
    };

    // get messages
    const getMessages = async (userId) => {
        try {
            setIsMessagesLoading(true);
            const res = await axiosInstance.post(`/messages/${userId}`, user);
            setMessages(res.data);
        } catch (error) {
            console.log(error.response.data.message);
        } finally {
            setIsMessagesLoading(false);
        }
    };

    const subscribeToMessages = () => {
        if (!selectedUser) return;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser.userId;
            if (!isMessageSentFromSelectedUser) return;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    };

    const unsubscribeFromMessages = () => {
        socket.off("newMessage");
    };

    // clear chat
    const clearChat = async () => {
        try {
            await axiosInstance.post(`/messages/clearChat/${selectedUser.userId}`, user);
            await getMessages(user.userId);
        } catch (error) {
            console.log(error);
        }
    };

    const searchUserByUsernameOrEmail = async (searchInput) => {
        try {
            const usersRef = collection(db, "Chatify");
    
            // Query for username
            const q1 = query(usersRef, where("username", "==", searchInput));
            const querySnapshot1 = await getDocs(q1);
            const usersByUsername = querySnapshot1.docs.map(doc => doc.data());
    
            // Query for email
            const q2 = query(usersRef, where("email", "==", searchInput));
            const querySnapshot2 = await getDocs(q2);
            const usersByEmail = querySnapshot2.docs.map(doc => doc.data());
    
            // Merge results and remove duplicates
            const mergedUsers = [...usersByUsername, ...usersByEmail].filter(
                (user, index, self) => 
                    index === self.findIndex(u => u.userId === user.userId) // Ensure uniqueness
            );
    
            return mergedUsers;
        } catch (error) {
            console.error("Error searching user:", error);
            return [];
        }
    };
    
    // Wrapper function for searching
    const searchUser = async (searchInput) => {
        try {
            const users = await searchUserByUsernameOrEmail(searchInput);
            return users;
        } catch (err) {
            console.error('Failed to fetch users:', err);
            return [];
        }
    };
    
    return (
        <ChatContext.Provider value={{
            messages,
            users,
            selectedUser,
            setSelectedUser,
            isUsersLoading,
            isMessagesLoading,
            getUsers,
            sendMessage,
            getMessages,
            subscribeToMessages,
            unsubscribeFromMessages,
            clearChat,
            searchUser
        }}>
            {children}
        </ChatContext.Provider>
    );
};