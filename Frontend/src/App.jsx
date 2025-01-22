import { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

import { AuthContext } from "./context/AuthContext";

export default function App() {
    const {user, isAuthenticated, isCheckingAuth, theme, connectSocket} = useContext(AuthContext);

    // auth check
    useEffect(()=> {
        isAuthenticated();
    },[])

    useEffect(()=> {
        connectSocket();
    },[user])

    // Toogle Theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme]);

    if(isCheckingAuth && !user)
        return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
        </div>
    );

  return (
    <div>
        <Navbar/>
        <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      <Toaster />
    </div>
  )
}
