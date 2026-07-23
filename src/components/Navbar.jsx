import React from 'react'
import '../styles/Navbar.css'
import { NavLink } from 'react-router-dom'
import {HomeIcon, BookOpenCheck, Bookmark, Lock, NotebookPen, BarChart, LogIn} from 'lucide-react'
const Navbar = () => {
  return (
    <div className='navbarWrapper'>
      <div className="appLogoContainer">
        <NavLink id='appName' to={"/"}>
            অধ্যায়.
        </NavLink>
      </div>


      <div className="pageLinks">
        <NavLink to={"/"} className={({isActive}) => isActive? "activeLinks":"nonActiveLinks"}>
            <HomeIcon size={18}/>
            Home
        </NavLink>

        <NavLink to={"/questionsolving"} className={({isActive}) => isActive? "activeLinks":"nonActiveLinks"}>
            <BookOpenCheck size={18}/>
            Question Solving
        </NavLink>

        <NavLink to={"/savedquestions"} className={({isActive}) => isActive? "activeLinks":"nonActiveLinks"}>
            <Bookmark size={18}/>
            Saved Questions
        </NavLink>

        <NavLink to={"/unrankedexam"} className={({isActive}) => isActive? "activeLinks":"nonActiveLinks"}>
            <NotebookPen size={18}/>
            Unranked Exam
        </NavLink>

        <NavLink to={"/rankedexam"} className={({isActive}) => isActive? "activeLinks":"nonActiveLinks"}>
            <BarChart size={18}/>
            Ranked Exam
        </NavLink>
      </div>

        <div className="signinContainer">
            <NavLink to={"/"} className="signInLink">
                <LogIn size={18}/>
                Sign In
            </NavLink>
        </div>

    </div>
  )
}

export default Navbar
