//list of users 
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUsers } from '../reducers/userListSlice'
import usersService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.userList)

  useEffect(() => {
    usersService.getAll().then(users => dispatch(setUsers(users)))
  }, [dispatch])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
