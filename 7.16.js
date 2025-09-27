import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const BlogView = () => {
  const { id } = useParams()
  const blog = useSelector(state => state.blogs.find(b => b.id === id))

  if (!blog) return null

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>URL: <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>
      <p>Likes: {blog.likes || 0}</p>
    </div>
  )
}

export default BlogView
