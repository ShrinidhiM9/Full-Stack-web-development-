import { createSlice } from '@reduxjs/toolkit'

const userListSlice = createSlice({
  name: 'userList',
  initialState: [],
  reducers: {
    setUsers: (state, action) => action.payload
  }
})

export const { setUsers } = userListSlice.actions
export default userListSlice.reducer
