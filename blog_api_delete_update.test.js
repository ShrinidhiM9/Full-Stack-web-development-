// tests/blog_api_delete_update.test.js
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
    title: 'First blog',
    author: 'Author One',
    url: 'http://first.example',
    likes: 1
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'http://second.example',
    likes: 5
  }
]

describe('DELETE and PUT operations on /api/blogs', () => {
  test.before(async () => {
    await mongoose.connect(config.MONGODB_URI)
  })

  test.beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test.after(async () => {
    await mongoose.connection.close()
  })

  test('DELETE /api/blogs/:id removes the blog and returns 204', async () => {
    // fetch all blogs to get an id to delete
    const before = await Blog.find({})
    assert.strictEqual(before.length, initialBlogs.length)

    const blogToDelete = before[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const after = await Blog.find({})
    assert.strictEqual(after.length, initialBlogs.length - 1)

    const ids = after.map(b => b.id)
    assert.ok(!ids.includes(blogToDelete.id))
  })

  test('DELETE non-existing id still returns 204 (idempotent) and leaves collection unchanged', async () => {
    const before = await Blog.find({})
    const fakeId = new mongoose.Types.ObjectId().toString()

    await api
      .delete(`/api/blogs/${fakeId}`)
      .expect(204)

    const after = await Blog.find({})
    assert.strictEqual(after.length, before.length)
  })

  test('PUT /api/blogs/:id updates likes and returns the updated blog', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[1] // pick second blog

    const updatedData = {
      likes: blogToUpdate.likes + 10
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Response should have updated likes
    assert.strictEqual(response.body.likes, updatedData.likes)

    // DB also reflects update
    const refreshed = await Blog.findById(blogToUpdate.id)
    assert.strictEqual(refreshed.likes, updatedData.likes)
  })

  test('PUT non-existing id returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    const updatedData = { likes: 999 }

    await api
      .put(`/api/blogs/${fakeId}`)
      .send(updatedData)
      .expect(404)
  })

  test('PUT can update multiple fields (title, url, author) when provided', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      title: 'Updated Title',
      url: 'http://updated.example',
      author: 'New Author',
      likes: 42
    }

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.title, updatedData.title)
    assert.strictEqual(res.body.url, updatedData.url)
    assert.strictEqual(res.body.author, updatedData.author)
    assert.strictEqual(res.body.likes, updatedData.likes)
  })
})
