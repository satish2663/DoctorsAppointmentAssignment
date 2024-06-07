import { Link } from 'react-router-dom';
import './style.css';
import { useState } from 'react';
import {auth} from './fireBase'
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try { 
            createUserWithEmailAndPassword(auth,email,password)
            console.log("Account Created")
        } catch(err){
            console.log(err)
        }
    }
    return (
        <div className="signup-container">
            <form className="sign-form" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <label htmlFor="email">
                    Email:
                    <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label htmlFor="password">
                    Password:
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <button type="submit">Sign Up</button> <br/ >
                <p>Already Registered? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default SignUpForm;
