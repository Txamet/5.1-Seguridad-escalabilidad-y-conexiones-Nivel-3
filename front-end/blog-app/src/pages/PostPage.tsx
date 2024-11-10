import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

interface Post {
  author: string;
  popularity: string;
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    userId: string;
  }
}

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null >(null);
  const [authUser, setAuthUser] = useState(false);
  const [adminUser, setAdminUser] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responsePost = await api.get(`/posts/${postId}`);
        setPost(responsePost.data);
  
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const authId = post?.post.userId;
        const userId = localStorage.getItem("userId");
        setAuthUser(authId === userId);

      } catch (error) {
        console.error('Error fetching post authorization:', error);
      }
    }

    const fetchAdminUser = async () => {
      try {
        const userRole = localStorage.getItem("role");
        if (userRole === "admin") setAdminUser(true);

      } catch (error) {
        console.error('Error fetching post authorization:', error);
      }
    }

    fetchAuthUser();
    fetchAdminUser();
    
  })

  const handleLike = async () => {
    try {
      const like = await api.post(`/posts/${postId}/like`);
      alert(like.data.success)

    } catch (error) {
      alert(error)
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      navigate(`/posts/${postId}/edit`);
       
    } catch (error) {
      alert(error)
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const like = await api.delete(`/posts/${postId}`);
      alert(like.data.success);
      window.location.reload();
      
    } catch (error) {
      alert(error)
      console.error(error);
    }
  };

  const handleRecover = async () => {
    try {
      const like = await api.patch(`/posts/${postId}/recover`);
      alert(like.data.success);
      window.location.reload();
        
    } catch (error) {
      alert(error)
      console.error(error);
    }
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  const lastDate = (post.post.createdAt !== post.post.updatedAt) ? post.post.updatedAt : post.post.createdAt
  let showDate;

  if (lastDate === post.post.createdAt) {
    showDate = `Creation date: ${new Date(lastDate).toLocaleDateString()}`
  } else {
    showDate = `Last update: ${new Date(lastDate).toLocaleDateString()}`
  }
  
  return (
    <>
      <Navbar /> 
      <div className = 'form'>
        <h2>{post.post.title}</h2>
        <p>{post.post.content}</p>
        <p>Author: {post.author}</p>
        <p>Popularity: {post.popularity}%</p>
        <small>{showDate}</small>
      </div>
      <p></p><br />
      <p></p><br />
      <div className = "form"> 
        {!authUser && (
          <button onClick = {handleLike} >Like this post</button>
        )}
        <p></p> 
        {authUser && (
          <button onClick = {handleEdit} >Edit this post</button>
        )}
        <p></p> 
        {(authUser || adminUser) && post.post.deleted === false && (
          <button onClick = {handleDelete} >Delete this post</button>
        )}
        <p></p> 
        {(authUser || adminUser) && post.post.deleted === true && (
          <button onClick = {handleRecover} >Recover this post</button>
        )}
      </div>
    </>
  );
};

export default PostPage;