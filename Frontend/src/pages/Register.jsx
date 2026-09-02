import '../styles/SignIn.css'
import { useFormik } from 'formik'
import { X } from 'lucide-react'
import { useNavigate, NavLink } from 'react-router'
const Register = () => {
    const navigate = useNavigate();
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
            console.log(values);
        }
    });

  return (
    <div className="register-overlay">
            <div className="floating-card">
                <X onClick={() => navigate(-1)} size={18} className="close-button"/>
                <h3 className="welcome-text">অধ্যায়ে স্বাগতম!</h3>
                <p className="welcome-description">অধ্যায় এর সকল সেবা পেতে রেজিস্টার করুন</p>

                <form onSubmit={formik.handleSubmit}>
                    <label className="input-label" htmlFor="displayName">আপনার নাম</label>
                    <br/>
                    <input
                        className={formik.touched.displayName && formik.errors.displayName ? 'input-field error' : 'input-field'}
                        id="displayName"
                        name="displayName"
                        type="text"
                        placeholder={formik.touched.displayName && formik.errors.displayName ? formik.errors.displayName : 'আপনার নাম'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.displayName}
                    />
                    <br/>
                    <label className="input-label" htmlFor="username">ইউজারনেম</label>
                    <br/>
                    <input
                        className={formik.touched.username && formik.errors.username ? 'input-field error' : 'input-field'}
                        id="username"
                        name="username"
                        type="text"
                        placeholder={formik.touched.username && formik.errors.username ? formik.errors.username : 'ইউজারনেম'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    <br/>
                    <label className="input-label" htmlFor="email">ইমেইল অ্যাড্রেস</label>
                    <br/>
                    <input
                        className={formik.touched.email && formik.errors.email ? 'input-field error' : 'input-field'}
                        id="email"
                        name="email"
                        type="text"
                        placeholder={formik.touched.email && formik.errors.email ? formik.errors.email : 'ইমেইল অ্যাড্রেস'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    <br/>
                    <label className="input-label" htmlFor="password">পাসওয়ার্ড</label>
                    <br/>
                    <input
                        className={formik.touched.password && formik.errors.password ? 'input-field error' : 'input-field'}
                        id="password"
                        name="password"
                        type="password"
                        placeholder={formik.touched.password && formik.errors.password ? formik.errors.password : 'পাসওয়ার্ড'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <br/>
                    <label className="input-label" htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</label>
                    <br/>
                    <input
                        className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'input-field error' : 'input-field'}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : 'পাসওয়ার্ড নিশ্চিত করুন'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                    />
                    <br/>
                    <button className="submit-button" type="submit">রেজিস্টার করুন</button>
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
