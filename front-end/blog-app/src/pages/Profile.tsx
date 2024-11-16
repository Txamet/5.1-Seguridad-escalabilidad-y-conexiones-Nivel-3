import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import axios from 'axios';
import {User} from "../types";
import { useNavigate } from 'react-router-dom';


const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const {userId} = useParams<{ userId: string }>();
  const tokenUserId = localStorage.getItem("userId");
  const [adminUser, setAdminUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status == 403) {
          navigate("/");
        } else if (axios.isAxiosError(error) && error.response) {   
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
    }

    fetchUser();
    fetchAdminUser();
  }, [userId, navigate]);

  if (!user) {
    return <h1>Error 404</h1>;
  }

  const handleDelete = async () => {
    try {
      const like = await api.delete(`/users/${userId}`);
      alert(like.data.message);
      window.location.reload();
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status == 403) {
        navigate("/");
      } else if (axios.isAxiosError(error) && error.response) {   
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Unkown error');
      }
      console.error(error);
    }
  };

  const handleRecover = async () => {
    try {
      const like = await api.patch(`/users/${userId}/recover`);
      alert(like.data.message);
      window.location.reload();
        
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status == 403) {
        navigate("/");
      } else if (axios.isAxiosError(error) && error.response) {   
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Unkown error');
      }
      console.error(error);
    }
  };

  const handleAdmin = async () => {
    try {
      const setAdmin = await api.patch(`/users/${userId}/upgrade`);
      alert(setAdmin.data.message);
      window.location.reload();

    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status == 403) {
        navigate("/");
      } else if (axios.isAxiosError(error) && error.response) {   
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Unkown error');
      }
      console.error(error);
    }
  }

  return (
    <>
      <Navbar /> 
      <div className='form'>
      
      <p></p>
      { (!adminUser && user.id !== tokenUserId) && (<h2>Unauthorized access</h2>)} 

      { user.id === tokenUserId && (<div className='form'>
        <h2>Profile</h2>
        <div className='box'>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
        <p></p>
        <Link to={`/users/${userId}/edit`}>
            <button type = "submit">Edit profile</button>
          </Link>
        <p></p>
          <Link to={"/posts/create"}>
            <button type = "submit">Create post</button>
          </Link>
        <p></p>
          <Link to={`/posts/users/${userId}`}>
            <button type = "submit">View my posts</button>
          </Link>
        <p></p>
          <Link to={`/posts/users/${userId}/deleted`}>
            <button type = "submit">View my deleted posts</button>
          </Link>
        </div>)}  
        
      { adminUser && user.id !== tokenUserId && (<div className='form'>
          <h2>Profile</h2>
          <div className='box'>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
          <p></p>
          <Link to={`/posts/users/${userId}`}>
            <button type = "submit">View {user.name} posts</button>
          </Link>
          <br />
          <Link to={`/posts/users/${userId}/deleted`}>
            <button type = "submit">View {user.name} deleted posts</button>
          </Link>
          <br />   
            { user.deleted === false && user.role === "simpleUser" && (<button type = "submit" onClick = {handleDelete}>Ban {user.name}</button>)} 
            { user.deleted === true && user.role === "simpleUser" && (<button type = "submit" onClick = {handleRecover}>Unban {user.name}</button>)}
          <br />
            { user.deleted === false && user.role === "simpleUser" && (<button type = "submit" onClick = {handleAdmin}>Set {user.name} as admin</button>)}
        </div>)}

       
      </div>
    </>
  );
};

export default Profile;
