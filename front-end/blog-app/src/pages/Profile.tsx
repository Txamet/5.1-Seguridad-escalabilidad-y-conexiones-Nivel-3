import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';

interface User {
  id: string;
  name: string
  email: string;
  password: string;
  role: string;
  deleted: boolean;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const {userId} = useParams<{ userId: string }>();
  const tokenUserId = localStorage.getItem("userId");
  const [adminUser, setAdminUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);

      } catch (error) {
        console.error('Error fetching post details:', error);
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
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleDelete = async () => {
    try {
      const like = await api.delete(`/users/${userId}`);
      alert(like.data.success);
      window.location.reload();
      
    } catch (error) {
      alert(error)
      console.error(error);
    }
  };

  const handleRecover = async () => {
    try {
      const like = await api.patch(`/users/${userId}/recover`);
      alert(like.data.success);
      window.location.reload();
        
    } catch (error) {
      alert(error)
      console.error(error);
    }
  };

  return (
    <>
      <Navbar /> 
      <div className='box'>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
      <p></p>
      { (!adminUser || user.id === tokenUserId) && (<div className='form'>
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
            { user.deleted === false && (<button type = "submit" onClick = {handleDelete}>Ban {user.name}</button>)} 
            { user.deleted === true && (<button type = "submit" onClick = {handleRecover}>Unban {user.name}</button>)} 
        <p></p>
          <Link to={`/posts/users/${userId}`}>
            <button type = "submit">View {user.name} posts</button>
          </Link>
        <p></p>
          <Link to={`/posts/users/${userId}/deleted`}>
            <button type = "submit">View {user.name} deleted posts</button>
          </Link>
        </div>)}  
    </>
  );
};

export default Profile;
