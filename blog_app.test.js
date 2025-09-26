// tests/blog_app.test.js
process.env.TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/bloglist_test'
process.env.SECRET = process.env.SECRET || 'testsecret'

const { test, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const config = require('../utils/config')

const api = supertest(app)

describe('Users and Blogs with token auth', () => {
  test.before(async () => {
    await mongoose.connect(config.MONGODB_URI)
  })

  test.beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // create a user via API (it will hash password)
    await api
      .post('/api/users')
      .send({ username: 'root', name: 'Root User', password: 'sekret' })
      .expect(201)
  })

  test.after(async () => {
    await mongoose.connection.close()
  })

  test('login returns a token', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    assert.ok(res.body.token)
    assert.strictEqual(res.body.username, 'root')
  })

  test('posting a blog succeeds with valid token and attaches user', async () => {
    // login to get token
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    const token = loginRes.body.token

    const newBlog = {
      title: 'Token Blog',
      author: 'Tester',
      url: 'http://example.com',
      likes: 3
    }

    const postRes = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // returned blog must include populated user username
    assert.strictEqual(postRes.body.user.username, 'root')

    // the user should have this blog in their blogs array when fetching users
    const usersRes = await api.get('/api/users').expect(200)
    const user = usersRes.body.find(u => u.username === 'root')
    assert.ok(user.blogs.length === 1)
    assert.strictEqual(user.blogs[0].title, 'Token Blog')
  })

  test('posting a blog fails with 401 if token not provided', async () => {
    const newBlog = { title: 'No Token', url: 'http://nobody', author: 'No' }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('delete only allowed by creator', async () => {
    // login as root
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
    const token = loginRes.body.token

    // create a blog
    const createRes = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'ToDelete', author: 'A', url: 'http://d', likes: 0 })
      .expect(201)

    const blogId = createRes.body.id

    // create another user
    await api
      .post('/api/users')
      .send({ username: 'alice', name: 'Alice', password: 'alicepwd' })
      .expect(201)

    // login as alice
    const loginAlice = await api
      .post('/api/login')
      .send({ username: 'alice', password: 'alicepwd' })
      .expect(200)

    const aliceToken = loginAlice.body.token

    // alice tries to delete root's blog -> should get 401
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${aliceToken}`)
      .expect(401)

    // root deletes their blog -> 204
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    // blog should be gone
    const blogsAfter = await Blog.find({})
    assert.strictEqual(blogsAfter.length, 0)
  })
})
