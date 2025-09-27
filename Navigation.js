import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <div style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: 10 }}>Home</Link>
      <Link to="/users">Users</Link>
    </div>
  )
}

export default Navigation
