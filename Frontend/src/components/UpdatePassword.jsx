import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UpdatePassword({ openUpdatePassword, setOpenUpdatePassword }) {

    const {updatePassword, forgotPassword} = useContext(AuthContext);

    const [passwords, setPasswords] = useState({ current: "", new: "" });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        try {
            updatePassword(passwords);
        } catch (error) {
            console.log(error);
        }
        setPasswords({ current: "", new: "" });
        setIsUpdatingPassword(false);
        setOpenUpdatePassword(false);
    };

return (
    <div>
        {openUpdatePassword && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <form className="bg-base-300 rounded-lg p-6 w-full max-w-sm space-y-4" onSubmit={handlePasswordSubmit}>
                    <h2 className="text-xl font-medium text-center">Update Password</h2>
                    <div className="space-y-3">
                        <input
                            type="password"
                            name="current"
                            placeholder="Current Password"
                            value={passwords.current}
                            onChange={handlePasswordChange}
                            required
                            className="w-full px-4 py-2 bg-base-200 rounded-lg border"
                        />
                        <input
                            type="password"
                            name="new"
                            placeholder="New Password"
                            value={passwords.new}
                            onChange={handlePasswordChange}
                            required
                            className="w-full px-4 py-2 bg-base-200 rounded-lg border"
                        />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            onClick={() => setOpenUpdatePassword(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            type="submit"
                        >
                            {isUpdatingPassword ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
        </div>
        
        )}
    </div>
);}