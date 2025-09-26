// utils/list_helper.js


const dummy = (blogs) => {
return 1
}


const totalLikes = (blogs) => {
return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}


const favoriteBlog = (blogs) => {
if (blogs.length === 0) return null
return blogs.reduce((prev, curr) => (curr.likes > prev.likes ? curr : prev))
}


const mostBlogs = (blogs) => {
if (blogs.length === 0) return null


const counts = {}
blogs.forEach((blog) => {
counts[blog.author] = (counts[blog.author] || 0) + 1
})


const topAuthor = Object.keys(counts).reduce((a, b) =>
counts[a] > counts[b] ? a : b
)


return {
author: topAuthor,
blogs: counts[topAuthor],
}
}


const mostLikes = (blogs) => {
if (blogs.length === 0) return null


const likeCounts = {}
blogs.forEach((blog) => {
likeCounts[blog.author] = (likeCounts[blog.author] || 0) + (blog.likes || 0)
})


const topAuthor = Object.keys(likeCounts).reduce((a, b) =>
likeCounts[a] > likeCounts[b] ? a : b
)


return {
author: topAuthor,
likes: likeCounts[topAuthor],
}
}


module.exports = {
dummy,
totalLikes,
favoriteBlog,
mostBlogs,
mostLikes,
}