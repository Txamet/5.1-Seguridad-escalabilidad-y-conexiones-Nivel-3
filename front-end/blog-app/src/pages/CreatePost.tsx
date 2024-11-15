import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/api";
import Navbar from '../components/NavBar';
import axios from 'axios';

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("/posts/create", {title, content});
            navigate("/posts");

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(`Error: ${error.response.data.message}`);
              } else {
                alert('Unkown error');
              }
              console.error(error);
        }
    };

    return (
        <>  
        <Navbar />     
            <form className = "block & content" onSubmit={handleSubmit}>
                <h2>Create new post</h2>
                <label>Title:</label><br />
                <input type = "title" placeholder="Title" onChange={(e) => setTitle(e.target.value)}></input>
                <p></p>
                <label>Post:</label><br />
                <textarea placeholder="Content" onChange={(e) => setContent(e.target.value)}></textarea>
                <p></p>
                <button type = "submit">Create post</button>
            </form>   
        </>   
    )
};

export default CreatePost;