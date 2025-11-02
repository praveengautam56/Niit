import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// Fix: Use firebase from compat for User type. The modular import was failing.
import firebase from 'firebase/compat/app';

import { auth, db } from './firebase';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

const App = () => {
  // Fix: Use firebase.User type.
  const [authUser, setAuthUser] = useState<firebase.User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let roleRef: firebase.database.Reference | null = null;
    let roleListener: ((snapshot: firebase.database.DataSnapshot) => void) | null = null;

    // Fix: Use auth.onAuthStateChanged from compat mode.
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      // Clean up previous role listener
      if (roleRef && roleListener) {
        roleRef.off('value', roleListener);
        roleRef = null;
        roleListener = null;
      }

      const finishLoading = () => {
          setTimeout(() => {
              const preloader = document.getElementById('preloader');
              if (preloader) {
                  preloader.classList.add('hide');
              }
              setLoading(false);
          }, 2500); // 2.5 second delay
      };

      if (user) {
        // Fix: Use db.ref() from compat mode.
        roleRef = db.ref(`users/${user.uid}/role`);
        
        // Fix: Use ref.on('value', ...) from compat mode.
        roleListener = roleRef.on('value', (snapshot) => {
          if (snapshot.exists()) {
            setUserRole(snapshot.val());
          } else {
            setUserRole('user'); // Default to 'user' if role is not set
          }
          setAuthUser(user);
          finishLoading();
        }, (error) => {
            console.error("Error fetching user role in real-time: ", error);
            setUserRole('user'); // Fallback on error
            setAuthUser(user);
            finishLoading();
        });

      } else {
        // User is signed out.
        setAuthUser(null);
        setUserRole(null);
        finishLoading();
      }
    });

    return () => {
        authUnsubscribe();
        if (roleRef && roleListener) {
          roleRef.off('value', roleListener);
        }
    };
  }, []);
  
  if (loading) {
      // Show nothing or a minimal loader while preloader is visible
      return null;
  }

  return authUser ? <Dashboard userRole={userRole} /> : <AuthForm />;
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
