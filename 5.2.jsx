import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import blogService from './services/blogs'

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

  // Fetch blogs only if user is logged in
  useEffect(() => {
    if (user) {
      blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
    }
  }, [user])

  // Notification helper
  const showNotification = (msg, timeout = 5000) => {
    setMessage(msg)
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
      showNotification(`Welcome ${user.name}!`)
    } catch (exception) {
      showNotification('Wrong username or password')
    }
  }

  // Logout handler
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    showNotification('Logged out')
  }

  // Add new blog
  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`A new blog "${returnedBlog.title}" added`)
    } catch (exception) {
      showNotification('Error creating blog')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {message && <div className="notification">{message}</div>}
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

  return (
    <div>
      <h2>blogs</h2>
      {message && <div className="notification">{message}</div>}
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
