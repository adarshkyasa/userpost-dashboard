'use client';

import { useState, useEffect } from 'react';

export default function UsersPostsDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        setError('Failed to load users');
        setLoadingUsers(false);
      });
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setLoadingPosts(true);
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoadingPosts(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoadingPosts(false);
      });
  };
  
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      )
    );
  };

  const handleSort = (event) => {
    const criteria = event.target.value;
    setSortBy(criteria);
    setFilteredUsers(
      [...filteredUsers].sort((a, b) => (a[criteria]?.localeCompare(b[criteria]) || 0))
    );
  };

  return (
    <div className="font-title min-h-screen bg-[#ced4da] p-5 grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
      {/* User List */}
      <div className="font-title p-4 bg-[#f8f9fa] shadow-md rounded-lg overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 mb-3 border rounded-md"
        />
        <select
          value={sortBy}
          onChange={handleSort}
          className="w-full p-2 mb-3 border rounded-md"
        >
          <option value="name">Sort by Name</option>
          <option value="company.name">Sort by Company</option>
        </select>
        {loadingUsers && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className={`p-3 cursor-pointer border-b hover:bg-gray-200 ${selectedUser?.id === user.id ? 'bg-blue-100' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              <p className="text-sm text-gray-800">User ID: {user.id}</p>
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">
                {user.address
                  ? `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`
                  : 'Address not available'}
              </p>
              <p className="text-xs font-semibold text-gray-700">
                {user.company ? user.company.name : 'Company not available'}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Posts Section */}
      <div className="font-title p-4 bg-[#f8f9fa] shadow-md rounded-lg overflow-y-auto max-h-screen col-span-2">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {loadingPosts && <p>Loading posts...</p>}
        {selectedUser && <p className="text-gray-700 mb-2">Showing posts for: <strong>{selectedUser.name}</strong></p>}
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="mb-4 p-4 bg-gray-50 shadow-lg rounded-lg">
                <h4 className="text-lg font-bold">{post.title}</h4>
                <p className="text-gray-600">{post.body}</p>
              </li>
            ))}
          </ul>
        ) : selectedUser ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          <p className="text-gray-500">Select a user to see posts.</p>
        )}
      </div>
    </div>
  );
}
