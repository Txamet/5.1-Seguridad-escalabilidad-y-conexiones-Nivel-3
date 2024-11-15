import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import api from "../api/api";
import axios from "axios";

const EditPost: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const oldData = async () => {
            try {
                const oldPost = await api.get(`/posts/${postId}`);
                const oldTitle = oldPost.data.data.title;
                const oldContent = oldPost.data.data.content;
                console.log(oldTitle)
                setTitle(oldTitle);
                setContent(oldContent);

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    alert(`Error: ${error.response.data.message}`);
                  } else {
                    alert('Unkown error');
                  }
                  console.error(error);
            }

        }

        oldData();
    }, [postId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.put(`/posts/${postId}`, {title, content});
            navigate(`/posts/${postId}`);

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
                <h2>Edit post</h2>
                <label>Title:</label><br />
                <input type = "title" value = {title} onChange={(e) => setTitle(e.target.value)}></input>
                <p></p>
                <label>Post:</label><br />
                <textarea value = {content} onChange={(e) => setContent(e.target.value)}></textarea>
                <p></p>
                <button type = "submit">Save changes</button>
            </form> 
        </>     
    )
};

export default EditPost;