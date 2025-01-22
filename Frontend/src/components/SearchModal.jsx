import { Search, X, MessageSquare } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

export default function SearchModal({ searchModal, setSearchModal }) {

    const { user } = useContext(AuthContext);
    const { setSelectedUser, searchUser} = useContext(ChatContext);

    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitted(false);

        try {
            const res = await searchUser(searchInput);
            setUsers(res || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setSearchInput('');
            setLoading(false);
            setSubmitted(true);
        }
    };

    // exculde curr user
    const filteredUsers = users.filter((u) => u._id !== user._id);

    return (
        <>
            {searchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-base-300 rounded-lg shadow-xl p-6 w-full max-w-sm md:max-w-md lg:max-w-lg relative space-y-6 mx-4 transition-transform transform scale-100">

                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full bg-base-100"
                            aria-label="Close search modal"
                            onClick={() => {setSearchModal(false), setUsers([])}}
                        >
                            <X className="h-5 w-5 text-red-500" />
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-semibold text-center text-base-content/70">
                            Search User
                        </h2>

                        {/* Form */}
                        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                            <label htmlFor="search-input" className="text-sm text-gray-600">
                                Enter your friend's username or email
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="search-input"
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Username or email"
                                    className="flex-grow w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                    aria-label="Search input"
                                    required
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                    aria-label="Search"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </form>

                        {/* Loading State */}
                        {loading && <p className="text-center text-gray-500">Searching...</p>}

                        {/* Users List */}
                        {!loading && submitted && users.length > 0 && (
                            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-scroll">
                                {filteredUsers.map((user) => (
                                    <div key={user._id} className="flex gap-2 justify-between border py-2 px-4 rounded">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.image || '/avatar.png'}
                                                alt={`${user.username}'s avatar`}
                                                className="w-8 h-8 object-cover rounded-full"
                                            />
                                            <p>{user.username}</p>
                                        </div>
                                        <button
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                                            aria-label={`Add ${user.username}`}
                                        >
                                            <MessageSquare className='h-4 w-4' 
                                            onClick={() => {setSelectedUser(user) , setSearchModal(false), setUsers([])}} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State Message */}
                        {!loading && submitted && filteredUsers.length === 0 && (
                            <p className="text-center text-gray-500">No users found.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
