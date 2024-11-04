"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";

const POSTS_PER_PAGE = 10;

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.org/posts");
        const postsWithDate = response.data.map(post => ({
          ...post,
          publishedAt: new Date(post.publishedAt).toLocaleDateString(),
          status: Math.random() > 0.5 ? "publicado" : "rascunho"
        }));
        setPosts(postsWithDate);
        setTotalPages(Math.ceil(postsWithDate.length / POSTS_PER_PAGE));
        setFilteredPosts(postsWithDate);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const generateRandomDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString(); 
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = posts;

      if (titleFilter) {
        filtered = filtered.filter((post) =>
          post.title.toLowerCase().includes(titleFilter.toLowerCase())
        );
      }

      if (statusFilter) {
        filtered = filtered.filter((post) => post.status === statusFilter);
      }

      if (dateFilter) {
        const filterDate = new Date(dateFilter).toISOString().split('T')[0];
        filtered = filtered.filter((post) => {
          const postDate = new Date(post.publishedAt).toISOString().split('T')[0];
          return postDate === filterDate;
        });
      }

      setFilteredPosts(filtered);
      setTotalPages(Math.ceil(filtered.length / POSTS_PER_PAGE)); 
      setCurrentPage(1);
    };

    applyFilters();
  }, [titleFilter, statusFilter, dateFilter, posts]);

  const handleTitleFilterChange = (e) => {
    setTitleFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center place-content-center bg-blue-500 bg-opacity-50">
      <h1 className="text-2xl font-bold">Posts</h1>

      <div className="my-4 w-11/12">
        <input
          type="text"
          placeholder="Filtrar por título"
          value={titleFilter}
          onChange={handleTitleFilterChange}
          className="border rounded p-2 mr-2"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border rounded p-2"
        >
          <option value="">Filtrar por status</option>
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateFilterChange}
          className="border rounded p-2 ml-2"
        />
      </div>

      <ul className="space-y-4 w-11/12">
        {displayedPosts.map((post) => (
          <a key={post.id} href={`/posts/${post.id}`}>
            <li className="border p-4 rounded">
              <h2 className="font-semibold">{post.title}</h2>
              <p>ID {post.id}</p>
              <p>Status: {post.status}</p>
              <p>Data de Publicação: {post.publishedAt}</p>
            </li>
          </a>
          
        ))}
      </ul>

      <div className="my-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 border rounded mr-2 ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;

