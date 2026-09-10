import { useNavigate, useRouteError } from 'react-router'
import '../styles/ErrorPage.css'
const ErrorPage = () => {

  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page">
        <h2>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h2>
        <p>আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।</p>
        <button onClick={() => navigate('/')}>হোমে ফিরে যান</button>
    </div>
  )
}

export default ErrorPage
