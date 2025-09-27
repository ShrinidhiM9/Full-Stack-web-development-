import { useSelector, useDispatch } from 'react-redux'
import { setNotification, clearNotification } from './reducers/notificationSlice'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)

  if (!notification) return null

  setTimeout(() => dispatch(clearNotification()), 5000)

  return <div className="notification">{notification}</div>
}
