import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { X } from "lucide-react";
import NewPassword from "./NewPassword";

export default function OTPModal() {
  const {
    setOpenForgotPassword,
    openOTPModal,
    setOpenOTPModal,
    handleVerifyOTP,
    setEmail
  } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await handleVerifyOTP(otp);
    } catch (error) {
      console.error(error);
    } finally {
      setOtp('');
      setIsVerifying(false);
    }
  };

  return (
    <>
      {openOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-300 rounded-lg p-6 w-full max-w-sm md:max-w-md lg:max-w-lg relative space-y-4 mx-4">
            <button
              onClick={() => { setOpenOTPModal(false), setOpenForgotPassword(false), setEmail('') }}
              className="absolute top-4 right-4 text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-medium text-center">Verify OTP</h2>
            <p className="text-center text-sm text-base-content/70">
              Enter the OTP sent to your registered email or phone number.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 bg-base-200 rounded-lg border text-center tracking-widest"
              />
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NewPassword />
    </>
  );
}
