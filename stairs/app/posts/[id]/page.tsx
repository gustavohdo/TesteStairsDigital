"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";


export default function Post() {

  let { id } = useParams();
  const [post, setPost] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.org/posts/${id}`);
        console.log("Retorno da API" + response)
        setPost(response.data)
      } catch (error) {
        console.error("Erro ao buscar post:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
        
        <h2 className="font-semibold">{post.title}</h2>
        <p>Status: {post.status}</p>
        <p>Data de Publicação: {post.publishedAt}</p>
    
    </div>
  )
}
