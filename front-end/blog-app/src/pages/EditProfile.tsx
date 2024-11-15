import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import api from '../api/api';
import axios from 'axios';

const EditProfile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const oldData = async () => {
        try {
            
            const oldPost = await api.get(`/users/${userId}`);
            const oldName = oldPost.data.name;
            const oldEmail = oldPost.data.email;
            
            setName(oldName);
            setEmail(oldEmail);

        } catch (error) {
            console.error(error);
        }
    }

    oldData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${userId}`, { name, email, password });
      navigate(`/users/${userId}`);
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Unkown error');
      }
      console.error(error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePasswordChange = (e: any) => {
    if (e.target.value !== "") setPassword(e.target.value) 
  }

  return (
    <>
    <Navbar /> 
      <form className= "form" onSubmit={handleSubmit}>
        <h2>Edit profile</h2>
        <input type="name"  value = {name} onChange={(e) => setName(e.target.value)} />
        <p></p>
        <input type="email" value = {email} onChange={(e) => setEmail(e.target.value)} />
        <p></p>
        <input type="password" placeholder="New password" onChange={handlePasswordChange} />
        <p></p>
        <button type="submit">Apply changes</button>
      </form>
    </>
  );
};

export default EditProfile;