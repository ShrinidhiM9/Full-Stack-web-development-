import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}
const update = (id, updatedBlog) => axios.put(`${baseUrl}/${id}`, updatedBlog).then(res => res.data)
const remove = (id) => {
  const config = { headers: { Authorization: token } }
  return axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove, setToken }
