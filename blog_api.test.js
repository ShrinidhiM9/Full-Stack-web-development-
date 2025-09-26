// tests/blog_api.test.js
const { test, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('./app')
const Blog = require('../models/blog')
const config = require('../utils/config')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  }
]

describe('when there are initially some blogs saved', () => {
  test.before(async () => {
    // connect to the test DB
    await mongoose.connect(config.MONGODB_URI)
  })

  test.beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test.after(async () => {
    await mongoose.connection.close()
  })

  test('GET /api/blogs returns blogs as json and correct length', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id) // exists
    assert.strictEqual(blog._id, undefined) // original _id removed by toJSON
  })

  test('POST /api/blogs creates a new blog and increases total count by 1', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Tester',
      url: 'http://example.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const all = await Blog.find({})
    assert.strictEqual(all.length, initialBlogs.length + 1)

    const titles = all.map(b => b.title)
    assert.ok(titles.includes('New Blog'))
  })

  test('POST without likes defaults likes to 0', async () => {
    const newBlog = {
      title: 'No Likes Blog',
      author: 'Tester',
      url: 'http://nolikes.example'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const saved = await Blog.findById(response.body.id)
    assert.strictEqual(saved.likes, 0)
  })

  test('POST missing title or url returns 400', async () => {
    const blogNoTitle = {
      author: 'Tester',
      url: 'http://example.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(blogNoTitle)
      .expect(400)

    const blogNoUrl = {
      title: 'No URL',
      author: 'Tester'
    }

    await api
      .post('/api/blogs')
      .send(blogNoUrl)
      .expect(400)

    const blogsAfter = await Blog.find({})
    assert.strictEqual(blogsAfter.length, 1)
 })
})
