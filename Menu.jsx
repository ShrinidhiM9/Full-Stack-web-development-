// src/components/Menu.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
  const style = { padding: 10, borderBottom: '1px solid #ddd', marginBottom: 10 }
  return (
    <nav style={style}>
      <Link to="/" style={{ marginRight: 10 }}>anecdotes</Link>
      <Link to="/create" style={{ marginRight: 10 }}>create new</Link>
      <Link to="/about">about</Link>
    </nav>
  )
}

export default Menu
