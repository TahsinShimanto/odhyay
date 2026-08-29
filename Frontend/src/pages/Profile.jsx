import React, { useState } from 'react'
import User from '../components/User.jsx'
import Admin from '../components/Admin.jsx'
const Profile = () => {
    const [isAdmin, setIsAdmin] = useState(false)
  return (
    <div>
      {
        isAdmin? ( <Admin/> ) : ( <User/> )  //props.isAdmin sign in page theika pass
      }
    </div>
  )
}

export default Profile
