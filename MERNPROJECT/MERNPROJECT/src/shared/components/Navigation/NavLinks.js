import React ,{useContext}  from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

import './NavLinks.css'
import Button from '../FormElements/Button'

const NavLinks = () => {

  const login = useContext(AuthContext)

  return (
    <ul className='nav-links' >
    <li>
        <NavLink to={"/"} exact > All Users </NavLink>
    </li>
    <li>
      {login.isLoggedIn && <NavLink to={`${login.userId}/places`}  > My Places </NavLink> }

    </li>
    <li>
        { login.isLoggedIn &&  <NavLink to={"places/new"}  > Add Places </NavLink> }
    </li>
    <li>
        { !login.isLoggedIn &&<NavLink to={"/auth"}  > Login </NavLink>}
    </li>

    <li>
        {login.isLoggedIn &&<Button onClick = {login.logout} > Logout </Button>}
    </li>

    </ul>
  )
}

export default NavLinks
