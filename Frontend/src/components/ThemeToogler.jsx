import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToogler() {
    const { theme, setTheme } = useContext(AuthContext)

    // Handle theme toggle
    const handleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div onClick={handleTheme} className="w-20 h-8 relative rounded-3xl border-gray-300 cursor-pointer overflow-hidden border">
            <div className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-300 rounded-3xl ${theme === 'dark' ? 'translate-x-full bg-gray-700' : 'translate-x-0 bg-gray-200' }`}>
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                <Sun className="w-4 h-4 text-yellow-500" />
                <Moon className="w-4 h-4 text-gray-300" />
            </div>
        </div>
    )
}
