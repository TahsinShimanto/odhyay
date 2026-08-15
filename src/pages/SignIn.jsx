import '../styles/SignIn.css'

const SignIn = ({isOpen}) => {

    if(!isOpen) {
        return null;
    }

    return (
        <div className="sign-in-overlay">
            <div className="floating-card">
                <h3 className="welcome-text">Welcome Back</h3>
                <p className="welcome-description">Sign in with an account to unlock all features</p>

                <form>
                    <label className="input-label">email address</label>
                    <br/>
                    <input className="input-field" type="text" placeholder="Email Address" />
                    <br/>
                    <label className="input-label">password</label>
                    <br/>
                    <input className="input-field" type="password" placeholder="password" />
                    <br/>
                    <p className="query-text">Forgot Password?</p>
                    <br/>
                    <input className="submit-button" type="submit" value="Sign In" />
                </form>
                <div className="divider" />
                <p className="query-text">
                    don't have an account?
                    <a className="register-now"> Register Now</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;