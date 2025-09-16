import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UserProfileScreen({ user, onBack }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch the complete user document from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails({
          ...userData,
          uid: user.uid,
          // Include any additional fields from Firebase auth if needed
          email: user.email || userData.email,
          displayName: user.displayName || userData.name
        });
      } else {
        // If no user document exists, use the basic auth data
        setUserDetails({
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'User',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setError('No detailed user profile found in database');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    if (date instanceof Date) {
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Handle Firestore timestamps
    if (date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 overflow-y-auto hide-scrollbar">
      <div className="max-w-md w-full mx-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                User Profile
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Complete account information
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/10 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Back
            </button>
          </div>

          {error && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6 text-yellow-300">
              {error}
            </div>
          )}

          {/* User Details */}
          {userDetails && (
            <div className="max-h-[360px] overflow-y-auto space-y-4 hide-scrollbar">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {userDetails.name || userDetails.displayName || 'User'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {userDetails.role ? userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1) : 'User'}
                </p>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-slate-400 mb-1">User ID</div>
                  <div className="text-slate-200 font-mono text-sm truncate">{userDetails.uid}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-slate-400 mb-1">Email</div>
                  <div className="text-slate-200">{userDetails.email || 'N/A'}</div>
                </div>

                {userDetails.username && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Username</div>
                    <div className="text-slate-200">@{userDetails.username}</div>
                  </div>
                )}

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-slate-400 mb-1">Role</div>
                  <div className="text-slate-200 capitalize">{userDetails.role || 'user'}</div>
                </div>

                {userDetails.createdAt && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Account Created</div>
                    <div className="text-slate-200 text-sm">{formatDate(userDetails.createdAt)}</div>
                  </div>
                )}

                {userDetails.updatedAt && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Last Updated</div>
                    <div className="text-slate-200 text-sm">{formatDate(userDetails.updatedAt)}</div>
                  </div>
                )}
              </div>

              {/* Additional user data can be added here as needed */}
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={fetchUserDetails}
            className="mt-6 w-full px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl font-semibold text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all duration-300"
          >
            Refresh Profile
          </button>
        </div>
      </div>
    </div>
  );
}
