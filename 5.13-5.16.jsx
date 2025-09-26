// Blog.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('Blog component', () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: { username: 'johndoe', name: 'John Doe' }
  }

  test('5.13: renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={null} />)

    expect(screen.getByText('Test Blog John Doe')).toBeDefined()
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
  })

  test('5.14: shows url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={null} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(/likes/i)).toBeDefined()
  })

  test('5.15: like button clicked twice calls event handler twice', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={() => {}} user={null} />)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

describe('BlogForm component', () => {
  test('5.16: form calls event handler with right details', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'New Blog')
    await user.type(authorInput, 'Alice')
    await user.type(urlInput, 'http://newblog.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('New Blog')
    expect(createBlog.mock.calls[0][0].author).toBe('Alice')
    expect(createBlog.mock.calls[0][0].url).toBe('http://newblog.com')
  })
})
