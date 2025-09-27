// src/hooks/index.js
import { useState, useEffect } from 'react'
import axios from 'axios'

/* ----------------------------
   useField (utility for forms)
   ---------------------------- */
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (e) => setValue(e.target.value)
  const reset = () => setValue('')

  return { type, value, onChange, reset }
}


//exercise 7.7
export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name || name.trim() === '') {
      setCountry(null)
      return
    }

    let cancelled = false

    const fetchFromCourseApi = async (q) => {
      // course endpoint documented in Full Stack course (older server)
      // e.g. https://studies.cs.helsinki.fi/restcountries/api/name/{name}
      const url = `https://studies.cs.helsinki.fi/restcountries/api/name/${encodeURIComponent(q)}`
      const resp = await axios.get(url) // may throw
      // The course endpoint returns a single object (not array) in that API.
      return resp.data
    }

    const fetchFromRestCountries = async (q) => {
      // restcountries.com v3.1 endpoint: returns an array
      const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=true`
      const resp = await axios.get(url)
      return Array.isArray(resp.data) ? resp.data[0] : resp.data
    }

    const fetchCountry = async () => {
      try {
        // Try course API first (more likely to be present in exercises)
        let data
        try {
          data = await fetchFromCourseApi(name)
        } catch (eCourse) {
          // fallback to public restcountries if course API fails
          data = await fetchFromRestCountries(name)
        }

        if (!cancelled) {
          setCountry({ found: true, data })
        }
      } catch (err) {
        if (!cancelled) setCountry({ found: false })
      }
    }

    fetchCountry()

    return () => { cancelled = true }
  }, [name])

  return country
}

// exercise 7.8

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      try {
        const resp = await axios.get(baseUrl)
        if (!cancelled) setResources(resp.data)
      } catch (err) {
        console.error('useResource: fetch error', err)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const resp = await axios.post(baseUrl, resource)
      setResources(prev => prev.concat(resp.data))
      return resp.data
    } catch (err) {
      console.error('useResource: create error', err)
      throw err
    }
  }

  const getAll = async () => {
    const resp = await axios.get(baseUrl)
    setResources(resp.data)
    return resp.data
  }

  const service = { create, getAll }

  return [resources, service]
}
