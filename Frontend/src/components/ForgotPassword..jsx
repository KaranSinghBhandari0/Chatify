import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import OTPModal from "./OTPModal";
import { X } from "lucide-react";

export default function ForgotPassword() {
  const {
    forgotPassword,
    openForgotPassword,
    setOpenForgotPassword,
    email,
    setEmail,
  } = useContext(AuthContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {openForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-300 rounded-lg p-6 w-full max-w-sm md:max-w-md lg:max-w-lg relative space-y-4 mx-4">
            <button
              onClick={()=> {setOpenForgotPassword(false), setEmail('')}}
              className="absolute top-4 right-4 text-red-500"
              aria-label="Close forgot password modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-medium text-center">Forgot Password</h2>
            <p className="text-center text-sm text-base-content/70">
              Enter your email address, and we’ll send you instructions to reset
              your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-base-200 rounded-lg border"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OTPModal />
    </>
  );
}