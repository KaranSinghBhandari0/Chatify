import React, { createContext, useContext, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

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
            const res = await axiosInstance.get("/messages/users");
            setUsers(res.data);
        } catch (error) {
            console.log(error.response.data.message);
        } finally {
            setIsUserLoading(false);
        }
    };

    // send message
    const sendMessage = async (messageData) => {
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            setMessages((prevMessages) => [...prevMessages, res.data]);
            socket.emit("sendMessage", { ...res.data, recipientId: selectedUser._id });
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
            const res = await axiosInstance.get(`/messages/${userId}`);
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
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    };

    const unsubscribeFromMessages = () => {
        socket.off("newMessage");
    };

    // clear chat
    const clearChat = async () => {
        const receiverId = selectedUser._id;
        try {
            const res = await axiosInstance.get(`/messages/clearChat/${receiverId}`);
            await getMessages(user._id);
        } catch (error) {
            console.log(error);
        }
    };

    // search User
    const searchUser = async (searchInput) => {
        try {
            const res = await axiosInstance.post('/messages/searchUser', { searchInput });
            return (res.data.users || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
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