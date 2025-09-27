import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
  },

  //7.12
reducers: {
  setBlogs(state, action) { return action.payload },
  appendBlog(state, action) { state.push(action.payload) },
  updateBlog(state, action) {
    const updated = action.payload
    return state.map(blog => blog.id === updated.id ? updated : blog)
  },
  removeBlog(state, action) {
    const id = action.payload
    return state.filter(blog => blog.id !== id)
  }
}

})
export const { setBlogs, appendBlog } = blogSlice.actions
export default blogSlice.reducer
