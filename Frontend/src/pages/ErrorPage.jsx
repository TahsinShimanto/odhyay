import { useNavigate, useRouteError } from 'react-router'
import '../styles/ErrorPage.css'

const ErrorPage = () => {
  const navigate = useNavigate()
  const error = useRouteError()

  console.error(error)

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-code">404</div>

        <div className="error-divider" />

        <h1>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>

        <p>
          দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে,
          পরিবর্তন করা হয়েছে, অথবা আর বিদ্যমান নেই।
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="home-button"
        >
          <span>হোমে ফিরে যান</span>
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  )
}

export default ErrorPage
