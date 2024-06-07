import { Link } from 'react-router-dom';
import './style.css';
import { useState } from 'react';
import {auth} from './fireBase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import Details from './loginDetails'

const LogInForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try { 
            await signInWithEmailAndPassword(auth,email,password)
            console.log("Login Successfull")
            setIsLoggedIn(true)
        } catch(err){
            console.log(err)
        }
    }
    if (isLoggedIn) {
        return <Details />;
    }
    return (
        <div className="signup-container">
            <form className="sign-form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <label htmlFor="email">
                    Email:
                    <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label htmlFor="password">
                    Password:
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <button type="submit">Login</button> <br/ >
                <p>Dont have Account? <Link to="/signup">Register</Link></p>
            </form>
        </div>
    );
}

export default LogInForm;
