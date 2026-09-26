import {createBrowserRouter, Outlet, RouterProvider} from 'react-router'
import Navbar from '../components/Navbar'
import HomePage from './HomePage'
import QuestionSolving from './QuestionSolving.jsx'
import SavedQuestions from './SavedQuestions.jsx'
import SignIn from "./SignIn.jsx"
import Footer from '../components/Footer'
import Register from './Register.jsx'
import UnrankedSimulator from './UnrankedSimulator.jsx'
import RankedSimulator from './RankedSimulator.jsx'
import ExamCard from './ExamCard'
import Result from './Result'
import ErrorPage from './ErrorPage.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import AdminProtectedRoute from '../components/AdminProtectedRoute.jsx'
import User from './User.jsx'
import AdminLayout from '../components/AdminLayout.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminQuestions from './AdminQuestions.jsx'
import AdminTaxonomy from './AdminTaxonomy.jsx'
import { Navigate } from "react-router";



const StudentLayout = () => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className='load-error'>লোড হচ্ছে...</div>;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  );
} 

const StudentBareLayout = () => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className='load-error'>লোড হচ্ছে...</div>;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  );
};

const RootRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className='load-error'>লোড হচ্ছে...</div>;
  if (isAuthenticated) return <Navigate to="/profile" replace />;
  return <HomePage/>;
};

function App() {

  const router = createBrowserRouter([
    {
      element: <StudentLayout/>,
      children: [
        { path: "/", element: <RootRoute/> },
        { path: "/questionsolving", element: <QuestionSolving/> },
        { path: "/savedquestions", element: <ProtectedRoute><SavedQuestions/></ProtectedRoute> },
        { path: "/unrankedexam", element: <ProtectedRoute><UnrankedSimulator/></ProtectedRoute> },
        { path: "/rankedexam", element: <ProtectedRoute><RankedSimulator/></ProtectedRoute> },
        { path: "/profile", element: <ProtectedRoute><User/></ProtectedRoute> },
        { path: "/signin", element: <SignIn/> },
        { path: "/register", element: <Register/> },
      ]
    },

    {
      element: <StudentBareLayout/>,
      children: [
          { path: "/exam/:type/:attemptId", element: <ProtectedRoute><ExamCard/></ProtectedRoute> },
          { path: "/result/:type/:attemptId", element: <ProtectedRoute><Result/></ProtectedRoute> },
        ]
    },

    {
      path: "/admin",
      element: <AdminProtectedRoute><AdminLayout/></AdminProtectedRoute>,
      children: [
        { element: <AdminDashboard/>, index: true },
        { path: "questions", element: <AdminQuestions/> },
        { path: "taxonomy", element: <AdminTaxonomy/> },
      ]
    },

    { path: "*", element: <ErrorPage/> }
  ])

  return (
    <div className="appWrapper">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
