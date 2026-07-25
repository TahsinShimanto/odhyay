import React, { useState } from 'react'
import '../styles/Navbar.css'
import { NavLink } from 'react-router'
import {Menu, X, HomeIcon, BookOpenCheck, Bookmark, Lock, NotebookPen, BarChart3, LogIn} from 'lucide-react'


export default function Navbar() {

  const [isMenuOpen, SetIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    SetIsMenuOpen((prev) => !prev);
  };

  return (
    <div className='navbar-container'>

      <button className="mobile-menu-button" onClick={ toggleMenu }>
        { isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isMenuOpen && (
        <div className="mobile-menu">
            <NavLink to={"/"} className={({isActive}) => isActive ? "active-links":"non-active-links"}>
                <HomeIcon size={16}/>
                Home
            </NavLink>

            <NavLink to={"/questionsolving"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
                <BookOpenCheck size={16}/>
                Question Solving
            </NavLink>

            <NavLink to={"/savedquestions"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
                <Bookmark size={16}/>
                Saved Questions
            </NavLink>

            <NavLink to={"/unrankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
                <NotebookPen size={16}/>
                Unranked Exam
            </NavLink>

            <NavLink to={"/rankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
                <BarChart3 size={16}/>
                Ranked Exam
            </NavLink>
        </div>
      )}


      <div className="app-logo-container">
        <NavLink id='logo' to={"/"}>
            অধ্যায়.
        </NavLink>
      </div>


      <div className="page-links">
        <NavLink to={"/"} className={({isActive}) => isActive ? "active-links":"non-active-links"}>
            <HomeIcon size={16}/>
            Home
        </NavLink>

        <NavLink to={"/questionsolving"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <BookOpenCheck size={16}/>
            Question Solving
        </NavLink>

        <NavLink to={"/savedquestions"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <Bookmark size={16}/>
            Saved Questions
        </NavLink>

        <NavLink to={"/unrankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <NotebookPen size={16}/>
            Unranked Exam
        </NavLink>

        <NavLink to={"/rankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <BarChart3 size={16}/>
            Ranked Exam
        </NavLink>
      </div>

      <div className="sign-in-container">
          <NavLink to={"/"} className="sign-in-link">
              <LogIn size={16}/>
              Sign In
          </NavLink>
      </div>

    </div>
  )
}
