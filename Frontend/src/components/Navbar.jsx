import { useState } from 'react'
import '../styles/Navbar.css'
import { NavLink } from 'react-router'
import {Menu, X, HomeIcon, FileText, Bookmark, Lock, Award, BarChart3, LogIn, User} from 'lucide-react'


export default function Navbar({onSignIn}) {
  const [isMenuOpen, SetIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    SetIsMenuOpen((prev) => !prev);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isSignedIn = (user);

  return (
    <div className='navbar-container'>

      <button className="mobile-menu-button" onClick={ toggleMenu }>
        <Menu size={22} />
      </button>

        <div className={`mobile-menu ${isMenuOpen ? "mobile-menu-open" : ""}`}>
            <div className="mobile-menu-logo-div">
            <div className="mobile-logo-container">
                <NavLink id='logo' to={"/"}>
                    অধ্যায়.
                </NavLink>
            </div>

            <button className="mobile-menu-x-button" onClick={ toggleMenu }>
                <X size={22} />
            </button>
            </div>

            <div className='mobile-links-container'>
            <NavLink to={"/"} className={({isActive}) => isActive ? "mobile-active-links":"mobile-non-active-links"}>
                <HomeIcon size={16}/>
                হোম
            </NavLink>

            <NavLink to={"/questionsolving"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <FileText size={16}/>
                প্রশ্নব্যাংক
            </NavLink>

            <NavLink to={"/savedquestions"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <Bookmark size={16}/>
                সংরক্ষিত প্রশ্ন
            </NavLink>

            <NavLink to={"/unrankedexam"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <Award size={16}/>
                মডেল টেস্ট
            </NavLink>

            <NavLink to={"/rankedexam"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <BarChart3 size={16}/>
                প্রতিযোগীতামূলক পরীক্ষা
            </NavLink>
            </div>

            <div className="mobile-menu-footer-div">
            <div className="mobile-menu-footer-logo">
                <div id='small-logo'>
                    অধ্যায়.
                </div>
            </div>

            <div className='mobile-menu-footer-text'>Built for students, by students</div>
            </div>

        </div>


      <div className="app-logo-container">
        <NavLink id='logo' to={"/"}>
            অধ্যায়.
        </NavLink>
      </div>


      <div className="page-links">
        <NavLink to={"/"} className={({isActive}) => isActive ? "active-links":"non-active-links"}>
            <HomeIcon size={16}/>
            হোম
        </NavLink>

        <NavLink to={"/questionsolving"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <FileText size={16}/>
            প্রশ্নব্যাংক
        </NavLink>

        <NavLink to={"/savedquestions"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <Bookmark size={16}/>
            সংরক্ষিত প্রশ্ন
        </NavLink>

        <NavLink to={"/unrankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <Award size={16}/>
            মডেল টেস্ট
        </NavLink>

        <NavLink to={"/rankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <BarChart3 size={16}/>
            প্রতিযোগীতামূলক পরীক্ষা
        </NavLink>
      </div>

      <div className="sign-in-container">
          <NavLink to={"/profile"} className={isSignedIn ? "active-profile-icon":"hidden-profile-icon"}>
              <User size={16}/>
              { (isSignedIn) ? user.user.name : "null" }
          </NavLink>

          <NavLink onClick={onSignIn} className={isSignedIn ? "hidden-sign-in-link":"sign-in-link"}>
              <LogIn size={16}/>
              সাইন ইন
          </NavLink>
      </div>

    </div>
  )
}