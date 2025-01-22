import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios';
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const BASE_URL = "https://chatifyy.up.railway.app";
    // const BASE_URL = "http://localhost:3000";

    
    const [user , setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const [openForgotPassword, setOpenForgotPassword] = useState(false);
    const [openOTPModal, setOpenOTPModal] = useState(false);
    const [openNewPassword, setOpenNewPassword] = useState(false);
    const [email , setEmail] = useState('');

    const [socket, setSocket] = useState(null);

    // check if user is Authenticated
    const isAuthenticated = async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            setUser(res.data);
            connectSocket();
        } catch(error) {
            console.log("Error in checkAuth:", error);
            setUser(null)
        } finally {
            setIsCheckingAuth(false);
        }
    }

    // signup
    const signup = async (formData) => {
        setIsSigningUp(true);
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            isAuthenticated();
            setUser(res.data.user);
            navigate('/');
            toast.success(res.data.msg);
            connectSocket();
        } catch(error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Signup failed");
        } finally {            
            setIsSigningUp(false);
        }
    }

    // login
    const login = async (formData) => {
        setIsLoggingIn(true);
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            setUser(res.data.user);
            toast.success(res.data.msg);
            navigate('/');
            connectSocket();
        } catch(error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Login failed");
        } finally {            
            setIsLoggingIn(false);
        }
    }

    // logout
    const logout = async () => {
        try {
            const res = await axiosInstance.get("/auth/logout");
            toast.success("logout successfull");
            navigate('/login');
            disconnectSocket();
        } catch(error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {            
            setUser(null);
        }
    }

    // update Profile
    const updateProfile = async (data) => {
        try {
            setIsUpdatingProfile(true);
            const res = await axiosInstance.put("/auth/update-profile", data);
            setUser(res.data.user);
            toast.success(res.data.msg);
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response?.data?.msg || "Profile Update failed");
        } finally {
            setIsUpdatingProfile(false);
        }
    }

    // Connect socket
    const connectSocket = () => {
        if(!user || socket?.connected) return; // Avoid duplicate connections

        const newSocket = io(BASE_URL, { query: { userId: user._id } } );

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    // Disconnect socket
    const disconnectSocket = () => {
        if(socket?.connected) {
            socket.disconnect();
            setSocket(null);
            setOnlineUsers([]);
        }
    };

    // update Profile
    const updatePassword = async (data) => {
        try {
            const res = await axiosInstance.post("/auth/updatePassword", data);
            toast.success("password Updated");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response?.data?.message || "Password Update failed");
        }
    }

    // forgot password
    const forgotPassword = async () => {
        try {
            const res = await axiosInstance.post("/auth/send-otp", {email});
            toast.success(res.data.message);
            setOpenForgotPassword(false);
            setOpenOTPModal(true);
        } catch (error) {
            console.log("error in sending OTP:", error);
            toast.error(error.response?.data?.message || "failed to send otp");
        }
    }

    // otp verifying
    const handleVerifyOTP = async (otp) => {
        try {
            const res = await axiosInstance.post("/auth/verify-otp", {otp, email});
            toast.success(res.data.message);
            setOpenForgotPassword(false);
            setOpenOTPModal(false);
            setOpenNewPassword(true);
        } catch (error) {
            console.error("Error in verifying OTP:", error);
            toast.error(error.response?.data?.message || "Failed to verify OTP");
        }
    };

    // otp verifying
    const resetPassword = async (newPassword, confirmNewPassword) => {
        try {
            const res = await axiosInstance.post("/auth/resetPassword", {email, newPassword, confirmNewPassword});
            toast.success(res.data.message);
            navigate('/login');
        } catch (error) {
            console.error("Error in resetting password:", error);
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setOpenForgotPassword(false);
            setOpenOTPModal(false);
            setOpenNewPassword(false);
            setEmail(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user, isSigningUp, isLoggingIn, isCheckingAuth, isUpdatingProfile, onlineUsers, theme, setTheme, isAuthenticated, signup, login, logout, updateProfile, socket, connectSocket, updatePassword, forgotPassword, handleVerifyOTP, openForgotPassword, setOpenForgotPassword, openOTPModal, setOpenOTPModal, openNewPassword, setOpenNewPassword, email , setEmail, resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};