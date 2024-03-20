import { LoginSignup } from './LoginSignup.jsx'
import { userService } from '../services/user.service.js'
import { UserMsg } from './UserMsg.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { Link, NavLink } = ReactRouterDOM
const { useState, useEffect } = React
const { useNavigate } = ReactRouter

export function AppHeader({ onSetPage }) {

  const navigate = useNavigate()

  const [user, setUser] = useState(userService.getLoggedinUser())

  function onLogout() {
    userService.logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg('OOPS try again')
      })
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  return (
    <header className="app-header full main-layout">
      <div className="header-container">
        <h1>React Bug App</h1>
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/bug">Bugs</NavLink>
          {user && <NavLink to={`/user/${user._id}`} >Profile</NavLink>}
          {user && user.isAdmin && <NavLink to="/user/admin" >User List</NavLink>}
        </nav>
      </div>
      {
        user ? (
          < section >
            <Link to={`/user/${user._id}`}>Hello {user.fullName}</Link>
            <button onClick={onLogout}>Logout</button>
          </ section >
        ) : (
          <section>
            <LoginSignup onSetUser={onSetUser} />
          </section>
        )
      }
      <UserMsg />
    </header>
  )
}
