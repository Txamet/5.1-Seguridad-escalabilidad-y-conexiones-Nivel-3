import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
        if (userRole === "admin") setAdminUser(true);
  }, []) 
    
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfile = () => {
    const userId = localStorage.getItem("userId")
    navigate(`/users/${userId}`)
  }

  const handleHome = () => {
    navigate("/posts")
  }

  const handleCreate = () => {
    navigate("/posts/create")
  }

  const handleUsers = () => {
    navigate("/users")
  }

  return (
    <nav>
      <button onClick={handleHome}>Home</button>
      <button onClick={handleProfile}>Profile</button>
      <button onClick={handleCreate}>Create Post</button>
      {adminUser && (<button onClick={handleUsers}>View users</button>)}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;