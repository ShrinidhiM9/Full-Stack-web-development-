import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setBlogs, appendBlog, updateBlog, removeBlog } from '../reducers/blogSlice'
import { setNotification, clearNotification } from '../reducers/notificationSlice'
import { setUser, clearUser } from '../reducers/userSlice'
import blogService from '../services/blogs'
import loginService from '../services/login'

const Blogs = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  // Fetch blogs on mount
  useEffect(() => {
    blogService.getAll().then(blogs => dispatch(setBlogs(blogs)))
  }, [dispatch])

  // Check local storage for logged-in user on mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  // Login handler
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      dispatch(setUser(user))
      window.localStorage.setItem('loggedAppUser', JSON.stringify(user))
      blogService.setToken(user.token) // set token for authenticated requests
      dispatch(setNotification(`Welcome ${user.name}`))
      setTimeout(() => dispatch(clearNotification()), 5000)
      setUsername('')
      setPassword('')
    } catch (error) {
      dispatch(setNotification('Wrong credentials'))
      setTimeout(() => dispatch(clearNotification()), 5000)
    }
  }

  // Logout handler
  const handleLogout = () => {
    dispatch(clearUser())
    window.localStorage.removeItem('loggedAppUser')
    blogService.setToken(null)
    dispatch(setNotification('Logged out'))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  // Add new blog
  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const created = await blogService.create({ title: newTitle, author: newAuthor, url: newUrl })
      dispatch(appendBlog(created))
      dispatch(setNotification(`Blog "${created.title}" added!`))
      setTimeout(() => dispatch(clearNotification()), 5000)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (error) {
      dispatch(setNotification('Error adding blog'))
      setTimeout(() => dispatch(clearNotification()), 5000)
    }
  }

  // Like blog
  const likeBlog = async (blog) => {
    const updated = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    dispatch(updateBlog(updated))
  }

  // Delete blog
  const deleteBlog = async (blog) => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(setNotification(`Blog "${blog.title}" deleted!`))
      setTimeout(() => dispatch(clearNotification()), 5000)
    }
  }

  // If user not logged in, show login form
  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  // Main blog view for logged-in user
  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>

      <form onSubmit={addBlog}>
        <div>
          Title: <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </div>
        <div>
          Author: <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
        </div>
        <div>
          URL: <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {blogs.map(blog => (
          <div key={blog.id} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
            <div>
              <strong>{blog.title}</strong> by {blog.author}
            </div>
            <div>Likes: {blog.likes || 0} <button onClick={() => likeBlog(blog)}>Like</button></div>
            <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
            <button onClick={() => deleteBlog(blog)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blogs
