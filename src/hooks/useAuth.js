import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import bcrypt from 'bcryptjs';
import { getFunctions, httpsCallable } from 'firebase/functions';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const functions = getFunctions();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...firebaseUser,
              ...userDoc.data()
            });
          } else {
            setUser(firebaseUser);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, userData) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: userData.name
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: userData.name,
        email: userData.email,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return userCredential.user;
    } catch (err) {
      // Suppress raw Firebase error message for email-already-in-use
      if (err.code === 'auth/email-already-in-use' || (err.message && err.message.includes('email-already-in-use'))) {
        setError(null);
      } else {
        setError(err.message);
      }
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const adminLogin = async (adminId, password) => {
    try {
      setError(null);
      const adminDoc = await getDoc(doc(db, 'admins', adminId));

      if (!adminDoc.exists()) {
        throw new Error('Invalid admin credentials');
      }

      const adminData = adminDoc.data();

      const isPasswordValid = bcrypt.compareSync(password, adminData.password);
      if (!isPasswordValid) {
        throw new Error('Invalid admin credentials');
      }

      // Create Firebase Auth user for admin with a temporary email
      const tempEmail = `${adminId}@admin.local`;
      const tempPassword = `temp_${adminId}_${Date.now()}`;

      // Create a temporary Firebase Auth user for admin
      const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, tempPassword);

      // Update the user profile with admin information
      await updateProfile(userCredential.user, {
        displayName: adminData.name
      });

      // Create or update user document with admin role
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: adminData.name,
        email: adminData.email,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const sendPasswordResetOTP = async (email) => {
    try {
      setError(null);
      const sendOTP = httpsCallable(functions, 'sendPasswordResetOTP');
      const result = await sendOTP({ email });
      return result.data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setError(null);
      const verify = httpsCallable(functions, 'verifyOTP');
      const result = await verify({ email, otp });
      return result.data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      setError(null);
      const reset = httpsCallable(functions, 'resetPassword');
      const result = await reset({ email, newPassword });
      return result.data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    adminLogin,
    sendPasswordResetOTP,
    verifyOTP,
    resetPassword
  };
}
