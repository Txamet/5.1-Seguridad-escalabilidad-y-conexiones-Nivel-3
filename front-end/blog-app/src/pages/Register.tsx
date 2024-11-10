import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/register', { name, email, password });
      navigate('/posts');
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className= "form" onSubmit={handleSubmit}>
      <h2>Register new user</h2>
      <input type="name" placeholder="Username" onChange={(e) => setName(e.target.value)} />
      <p></p>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <p></p>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <p></p>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Register;
