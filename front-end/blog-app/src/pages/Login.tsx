import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.name);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('role', response.data.role);
      navigate('/posts');

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <form className = "form" onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <p></p>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <p></p>
      <button type="submit">Submit</button>
    </form>

    <div className='toRegister'>
      <p>New user? Register <a href="http://localhost:5173/register"><u>here</u></a></p>
    </div>
    </>
  );
};

export default Login;
