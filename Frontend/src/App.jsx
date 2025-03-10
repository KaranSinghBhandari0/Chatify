import { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";

import { AuthContext } from "./context/AuthContext";

export default function App() {
    const { user, theme, connectSocket, checkingAuth } = useContext(AuthContext);

    // Connect socket when user changes
    useEffect(() => {
        if (user) {
            connectSocket();
        }
    }, [user]);

    // Toggle Theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div>
            {checkingAuth && !user ? (
                <div className="flex items-center justify-center h-screen">
                    <Loader className="size-10 animate-spin" />
                </div>
            ) : (
                <>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                        <Route path="/forgot-password" element={<ForgotPassword/>} />
                    </Routes>
                    <Toaster />
                </>
            )}
        </div>
    );
}
