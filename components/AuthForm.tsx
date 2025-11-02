import React, { useState } from 'react';
// Fix: Firebase auth functions are methods on the auth object in compat mode.
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import * as database from "firebase/database";
import { auth, db } from '../firebase';
import { Logo } from './icons';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cleanErrorMessage = (message: string) => {
      return message.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.$/, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isLogin) {
      try {
        // Fix: Use auth.signInWithEmailAndPassword from compat mode.
        await auth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged will handle UI change
      } catch (err: any) {
        if (err.code === 'auth/invalid-credential') {
            setError("Invalid email or password. Please try again.");
        } else {
            setError(cleanErrorMessage(err.message));
        }
      }
    } else {
      if (password !== confirmPassword) {
        setError("The passwords you entered do not match. Please try again.");
        setIsLoading(false);
        return;
      }
      try {
        // Fix: Use auth.createUserWithEmailAndPassword from compat mode.
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        if (!user) {
          throw new Error("User could not be created.");
        }
        // Fix: Use db.ref().set() from compat mode.
        await db.ref('users/' + user.uid).set({
            name: name,
            email: email,
            role: 'user', // Default role for new users
        });
        // onAuthStateChanged will handle UI change
      } catch (err: any) {
        setError(cleanErrorMessage(err.message));
      }
    }
    setIsLoading(false);
  };


  return (
    <div className="auth-container">
      {!isLogin && (
        <button className="back-button" onClick={() => setIsLogin(true)} aria-label="Go back to login">
          &larr;
        </button>
      )}
      
      <header className="auth-header">
        <Logo />
      </header>
      
      <main className="auth-main">
        <h2>{isLogin ? 'Login to your Account' : 'Create your Account'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="name" className="sr-only">Name</label>
              <input type="text" id="name" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input type="email" id="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input type="password" id="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input type="password" id="confirm-password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
          </button>
        </form>
        
        {isLogin && (
            <div className="toggle-form">
                <span>Don't have an account?</span>
                <button type="button" onClick={() => setIsLogin(false)}>Sign up</button>
            </div>
        )}
      </main>
    </div>
  );
};

export default AuthForm;
