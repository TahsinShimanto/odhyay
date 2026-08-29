import '../styles/SignIn.css'
import { X } from 'lucide-react'

const SignIn = ({isOpen, setIsOpen}) => {

    if(!isOpen) {
        return null;
    }

    return (
        <div className="sign-in-overlay">
            <div className="floating-card">
                <X onClick={() => setIsOpen(false)} size={18} className="close-button"/>
                <h3 className="welcome-text">আবারও স্বাগতম!</h3>
                <p className="welcome-description">অধ্যায় এর সকল সেবা পেতে সাইন ইন করুন</p>

                <form>
                    <label className="input-label">ইমেইল অ্যাড্রেস</label>
                    <br/>
                    <input className="input-field" type="text" />
                    <br/>
                    <label className="input-label">পাসওয়ার্ড</label>
                    <br/>
                    <input className="input-field" type="password" />
                    <br/>
                    <p className="query-text">পাসওয়ার্ড ভুলে গেছেন?</p>
                    <br/>
                    <input className="submit-button" type="submit" value="সাইন ইন" />
                </form>
                <div className="divider" />
                <p className="query-text">
                    অ্যাকাউন্ট নেই?
                    <a className="register-now"> রেজিস্টার করুন</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;