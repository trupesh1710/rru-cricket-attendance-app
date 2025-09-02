import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithCustomToken
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
        username: userData.username,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);
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

      const generateAdminToken = httpsCallable(functions, 'generateAdminToken');
      const result = await generateAdminToken({ adminId });
      const { token } = result.data;

      const userCredential = await signInWithCustomToken(auth, token);

      const adminUser = {
        uid: adminId,
        name: adminData.name,
        email: adminData.email,
        role: 'admin',
        type: 'admin'
      };
      setUser(adminUser);

      return adminUser;
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
    adminLogin
  };
}
