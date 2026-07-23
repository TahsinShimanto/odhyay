import '../styles/App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './HomePage'
import Navbar from '../components/Navbar'
function App() {
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>
        <Navbar/>
        <HomePage/>
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
