import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const ForgotPassword = () => {
    const { resetPassword, theme } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await resetPassword(email.trim());
        setLoading(false);
        setEmail("");
    };

    return (
        <div className="min-h-[60vh] w-full flex justify-center items-center mt-16">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 w-[90%] max-w-[385px] shadow-lg px-6 py-8 rounded-lg bg-base-100"
            >
                <AlertCircle className="w-12 h-12 text-primary" />
                <p className="font-semibold text-2xl text-base-content">Forgot Password</p>
                <p className="text-base-content text-sm text-center">
                    Enter your email and we will send you a link to reset your password.
                </p>

                <input
                    type="email"
                    className="input input-bordered w-full mt-4"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full mt-2"
                >
                    {loading ? "Sending..." : "Submit"}
                </button>

                <div className="mt-4 flex">
                    <Link to="/login" className="text-primary flex items-center gap-2">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
