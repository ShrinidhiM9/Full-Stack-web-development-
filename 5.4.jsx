import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import blogService from './services/blogs'

const Notification = ({ message }) => {
  if (!message) return null

  const style = {
    color: message.type === 'success' ? 'green' : 'red',
    background: '#f0f0f0',
    border: `2px solid ${message.type === 'success' ? 'green' : 'red'}`,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  }

  return <div style={style}>{message.text}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  // Check for logged-in user on page load
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Fetch blogs if user is logged in
  useEffect(() => {
    if (user) {
      blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
    }
  }, [user])

  // Notification helper
  const showNotification = (text, type = 'success', timeout = 5000) => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), timeout)
  }

  // Login handler
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      showNotification(`Welcome ${user.name}!`, 'success')
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  // Logout handler
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    showNotification('Logged out', 'success')
  }

  // Add new blog
  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`A new blog "${returnedBlog.title}" added`, 'success')
    } catch (exception) {
      showNotification('Error creating blog', 'error')
    }
  }

  // Render login form if not logged in
  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  // Render blogs + new blog form if logged in
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <BlogForm createBlog={createBlog} />
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
