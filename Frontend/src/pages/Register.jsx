import '../styles/SignIn.css'
import { useFormik } from 'formik'
import { X } from 'lucide-react'
import { useNavigate, NavLink } from 'react-router'
import { useState } from 'react'
import axios from "../services/axios.js";
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
const Register = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            displayName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.displayName) {
                errors.displayName = 'আপনার নাম দিন';
            }
            if (!values.username) {
                errors.username = 'ইউজারনেম দিন';
            }
            if (!values.email) {
                errors.email = 'ইমেইল অ্যাড্রেস দিন';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = 'সঠিক ইমেইল অ্যাড্রেস দিন';
            }
            if (!values.password) {
                errors.password = 'পাসওয়ার্ড দিন';
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = 'পাসওয়ার্ড আবার দিন';
            } else if (values.password && values.confirmPassword !== values.password) {
                errors.confirmPassword = 'পাসওয়ার্ড মিলছে না';
            }
            return errors;
        },
        onSubmit: (values) => {
            setServerError('');
            setLoading(true);

            axios.post('/api/users', values)
            .then((res) => {
                console.log(res.data);
                navigate('/signin');
            })
            .catch((err) => {
                    const message = err.response?.data?.error || 'কিছু একটা সমস্যা হয়েছে';
                    setServerError(message);
            })
            .finally(() => {
                    setLoading(false);
            });
        }
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) return null;

  return (
    <div className="register-overlay" onClick={(e) => e.target === e.currentTarget && navigate(-1)}>
            <div className="floating-card">
                <X onClick={() => navigate(-1)} size={18} className="close-button"/>
                <h3 className="welcome-text">অধ্যায়ে স্বাগতম!</h3>
                <p className="welcome-description">অধ্যায় এর সকল সেবা পেতে রেজিস্টার করুন</p>

                {serverError && <p className="server-error">{serverError}</p>}

                <form onSubmit={formik.handleSubmit}>
                    <label className="input-label" htmlFor="displayName">আপনার নাম</label>
                    <br/>
                    <input
                        className={formik.touched.displayName && formik.errors.displayName ? 'input-field error' : 'input-field'}
                        id="displayName"
                        name="displayName"
                        type="text"
                        placeholder='আপনার নাম'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.displayName}
                    />
                    <br/>
                    <p className='error-text'>{formik.touched.displayName && formik.errors.displayName ? formik.errors.displayName : ''}</p>
                    <label className="input-label" htmlFor="username">ইউজারনেম</label>
                    
                    <input
                        className={formik.touched.username && formik.errors.username ? 'input-field error' : 'input-field'}
                        id="username"
                        name="username"
                        type="text"
                        placeholder='ইউজারনেম'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    
                    <p className='error-text'>{formik.touched.username && formik.errors.username ? formik.errors.username : ''}</p>
                    <label className="input-label" htmlFor="email">ইমেইল অ্যাড্রেস</label>
                    
                    <input
                        className={formik.touched.email && formik.errors.email ? 'input-field error' : 'input-field'}
                        id="email"
                        name="email"
                        type="text"
                        placeholder='ইমেইল অ্যাড্রেস'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    
                    <p className='error-text'>{formik.touched.email && formik.errors.email ? formik.errors.email : ''}</p>
                    <label className="input-label" htmlFor="password">পাসওয়ার্ড</label>
                    
                    <input
                        className={formik.touched.password && formik.errors.password ? 'input-field error' : 'input-field'}
                        id="password"
                        name="password"
                        type="password"
                        placeholder='পাসওয়ার্ড'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    
                    <p className='error-text'>{formik.touched.password && formik.errors.password ? formik.errors.password : ''}</p>
                    <label className="input-label" htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</label>
                    
                    <input
                        className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'input-field error' : 'input-field'}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder='পাসওয়ার্ড নিশ্চিত করুন'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                    />
                    
                    <p className='error-text'>{formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ''}</p>
                    <button className="submit-button" type="submit" disabled={loading}>
                        {loading ? 'অপেক্ষা করুন...' : 'রেজিস্টার করুন'}
                    </button>
                </form>
                <div className="divider" />
                <p className="query-text">
                    অ্যাকাউন্ট আছে?
                    <NavLink to="/signin" replace  className="register-now"> সাইন ইন করুন</NavLink>
                </p>
            </div>
        </div>
  )
}

export default Register
