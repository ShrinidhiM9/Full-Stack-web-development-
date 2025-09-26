// controllers/blogs.js
const express = require('express')
const Blog = require('../models/blog')


const router = express.Router()


router.get('/', async (req, res, next) => {
try {
const blogs = await Blog.find({})
res.json(blogs)
} catch (err) {
next(err)
}
})


router.post('/', async (req, res, next) => {
try {
const body = req.body
const blog = new Blog({
title: body.title,
author: body.author,
url: body.url,
likes: body.likes || 0,
})


const saved = await blog.save()
res.status(201).json(saved)
} catch (err) {
next(err)
}
})


module.exports = router