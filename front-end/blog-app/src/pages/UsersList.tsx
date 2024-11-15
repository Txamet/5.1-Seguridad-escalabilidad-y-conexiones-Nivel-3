
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/NavBar';
import axios from 'axios';
import {User} from "../types"


const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [adminUser, setAdminUser] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const response = await api.get('/users');
          setUsers(response.data);
          
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            alert(`Error: ${error.response.data.message}`);
          } else {
            alert('Unkown error');
          }
          console.error(error);
        }
    };

    const fetchAdminUser = async () => {
        try {
          const userRole = localStorage.getItem("role");
          if (userRole === "admin") setAdminUser(true);
  
        } catch (error) {
          console.error('Error fetching post authorization:', error);
        }
    };

    fetchUsers();
    fetchAdminUser();
  }, []);

  return (
    <>
      <Navbar /> 
      { adminUser && (<div className='form'>
        <h2>User List</h2>
          {users.map((user: User) => (
            <div key={user.id} className="post">
              <Link to={`/users/${user.id}`}>
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {(user.role === "admin") ? "administrator" : "user"}</p>
                <p>Status: {(user.deleted === false) ? "active" : "banned"}</p>
                <p></p><br />
              </Link>
            </div>
          ))}
      </div>)}
      { !adminUser && (<p>Unauthorized access</p>)}
    </>
  );
};

export default UsersList;