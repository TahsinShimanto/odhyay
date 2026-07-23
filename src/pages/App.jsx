import '../styles/App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './HomePage'
import Navbar from '../components/Navbar'
import QuesSolving from './QuesSolving'
import SavedQues from './SavedQues'
import UnrankedExam from './UnrankedExam'
import RankedExam from './RankedExam'
function App() {
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>
        <Navbar/>
        <HomePage/>
      </div>
    },

    {
      path: "/questionsolving",
      element: <div>
        <Navbar/>
        <QuesSolving/>
      </div>
    },

    {
      path: "/savedquestions",
      element: <div>
        <Navbar/>
        <SavedQues/>
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
  ])

  return (
    <div className="appWrapper">
        <RouterProvider router={router} />
    </div>
  )
}

export default App
