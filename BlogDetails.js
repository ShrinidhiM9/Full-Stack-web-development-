import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './BlogDetails.js'; // Make sure this file exists

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Fetch blog details from backend
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      await axios.post(`/api/blogs/${id}/comments`, { comment: newComment });

      // Update UI immediately
      setBlog({ ...blog, comments: [...blog.comments, newComment] });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="blog-container">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-content">{blog.content}</p>

      <h3>Comments</h3>
      {blog.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="comments-list">
          {blog.comments.map((comment, index) => (
            <li key={index} className="comment-item">{comment}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="comment-input"
        />
        <button type="submit" className="comment-button">Add Comment</button>
      </form>
    </div>
  );
};

export default BlogDetails;
