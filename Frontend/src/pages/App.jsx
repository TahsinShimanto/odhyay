import {useState} from "react";
import {createBrowserRouter, RouterProvider} from 'react-router'
import Navbar from '../components/Navbar'
import HomePage from './HomePage'
import QuestionSolving from './QuestionSolving.jsx'
import SavedQuestions from './SavedQuestions.jsx'
import SignIn from "../components/SignIn.jsx";
import UnrankedExam from './UnrankedExam'
import RankedExam from './RankedExam'
import Footer from '../components/Footer'
import Profile from './Profile.jsx'


function App() {
  const [showSignIn, setShowSignIn] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>
        <Navbar onSignIn={() => setShowSignIn(true)} />
        <HomePage/>
        <Footer/>
      </div>
    },

    {
      path: "/questionsolving",
      element: <div>
        <Navbar onSignIn={() => setShowSignIn(true)} />
        <QuestionSolving/>
        <Footer/>
      </div>
    },

    {
      path: "/savedquestions",
      element: <div>
        <Navbar onSignIn={() => setShowSignIn(true)} />
        <SavedQuestions/>
        <Footer/>
      </div>
    },

    {
      path: "/unrankedexam",
      element: <div>
        <Navbar onSignIn={() => setShowSignIn(true)} />
        <UnrankedExam/>
      </div>
    },

    {
      path: "/rankedexam",
      element: <div>
        <Navbar onSignIn={() => setShowSignIn(true)} />
        <RankedExam/>
      </div>
    },

    {
      path: "/profile",
      element: <div>
        <Navbar onSignIn={() => setShowSignIn(true)} />
        <Profile/>
      </div>
    },
  ])

  return (
    <div className="appWrapper">
      <RouterProvider router={router} />
      <SignIn isOpen={showSignIn} setIsOpen={setShowSignIn} />
    </div>
  )
}

export default App
