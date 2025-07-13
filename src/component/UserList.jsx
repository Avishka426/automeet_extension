import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Replace this URL with your actual API endpoint
    axios.get('http://localhost:8080/api/community/contacts')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="p-4 border rounded-lg shadow">
            <img src={user.profileimg} alt={user.username} className="w-20 h-20 rounded-full mx-auto" />
            <h3 className="text-lg font-semibold mt-2 text-center">{user.username}</h3>
            <p className="text-sm text-gray-600 text-center">{user.email}</p>
            <p className="text-sm text-gray-600 text-center">{user.phone || "No phone"}</p>
            <p className="text-xs text-gray-400 text-center mt-1">Created by: {user.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
