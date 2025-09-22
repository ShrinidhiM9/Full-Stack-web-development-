import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

export const getAll = () => axios.get(baseUrl).then(res => res.data);
export const create = (newPerson) => axios.post(baseUrl, newPerson).then(res => res.data);
export const update = (id, updatedPerson) => axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data);
export const remove = (id) => axios.delete(`${baseUrl}/${id}`);
