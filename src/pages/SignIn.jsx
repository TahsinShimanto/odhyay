import '../styles/SignIn.css'

const SignIn = () => {
    return (
        <div className="sign-in-page">
            <div className="overlay" />

            <div className="floating-card">
                <h3>Welcome Back</h3>
                <p>Sign in with an account to unlock all features</p>

                <form>
                    <label>email address</label>
                    <br/>
                    <input type="text" placeholder="Email Address" />
                    <br/>
                    <label>password</label>
                    <br/>
                    <input type="password" placeholder="password" />
                    <br/>
                    <input type="submit" value="Sign In" />
                </form>
                <div className="divider" />
                <p>
                    don't have an account?
                    <a>Register Now</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;