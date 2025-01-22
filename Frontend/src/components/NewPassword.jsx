import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { X } from "lucide-react";

export default function NewPassword() {
    const { openNewPassword, setOpenNewPassword, resetPassword } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (newPassword !== confirmNewPassword) {
                return alert("Passwords do not match");
            }
            resetPassword(newPassword, confirmNewPassword);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

return (
    <div>
        {openNewPassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-base-300 rounded-lg p-6 w-full max-w-sm md:max-w-md lg:max-w-lg relative space-y-4 mx-4">
                    <button
                        onClick={() => setOpenNewPassword(false)}
                        className="absolute top-4 right-4 text-red-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-medium text-center">Create a New Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <input
                                type="password"
                                name="new"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-base-200 rounded-lg border"
                            />
                            <input
                                type="password"
                                name="confirm"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-base-200 rounded-lg border"
                            />
                        </div>
                        <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update"}
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
)}
