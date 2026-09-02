import {createBrowserRouter, RouterProvider} from 'react-router'
import Navbar from '../components/Navbar'
import HomePage from './HomePage'
import QuestionSolving from './QuestionSolving.jsx'
import SavedQuestions from './SavedQuestions.jsx'
import SignIn from "./SignIn.jsx"
import UnrankedExam from './UnrankedExam'
import RankedExam from './RankedExam'
import Footer from '../components/Footer'
import Profile from './Profile.jsx'
import Register from './Register.jsx'



function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>
        <Navbar/>
        <HomePage/>
        <Footer/>
      </div>
    },

    {
      path: "/questionsolving",
      element: <div>
        <Navbar/>
        <QuestionSolving/>
        <Footer/>
      </div>
    },

    {
      path: "/savedquestions",
      element: <div>
        <Navbar/>
        <SavedQuestions/>
        <Footer/>
      </div>
    },

    {
      path: "/unrankedexam",
      element: <div>
        <Navbar/>
        <UnrankedExam/>
      </div>
    },

    {
      path: "/rankedexam",
      element: <div>
        <Navbar/>
        <RankedExam/>
      </div>
    },

    {
      path: "/profile",
      element: <div>
        <Navbar/>
        <Profile/>
      </div>
    },
    {
      path: "/signin",
      element: <div>
        <Navbar/>
        <SignIn/>
      </div>
    },
    {
      path: "/register",
      element: <div>
        <Navbar/>
        <Register/>
      </div>
    },
  ])

  return (
    <div className="appWrapper">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
