import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => axios.get(baseUrl).then(res => res.data)

export default { getAll }
