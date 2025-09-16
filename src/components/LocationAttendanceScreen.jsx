import React, { useState, useEffect } from 'react';
import { getCurrentLocation, isWithinRadius, formatDistance, DEFAULT_GROUND_LOCATION } from '../utils/LocationUtils';
import { recordAttendance } from '../utils/AttendanceService';

export default function LocationAttendanceScreen({ user, onBack }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, locating, success, out_of_range, error
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState('');
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);

  const handleMarkAttendance = async () => {
    setLoading(true);
    setStatus('locating');
    setError('');

    try {
      // Get user's current location
      const userLocation = await getCurrentLocation();
      
      // Check if within radius of ground location
      const isWithinRange = isWithinRadius(
        userLocation.latitude,
        userLocation.longitude,
        DEFAULT_GROUND_LOCATION.latitude,
        DEFAULT_GROUND_LOCATION.longitude,
        DEFAULT_GROUND_LOCATION.radius
      );

      const calculatedDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        DEFAULT_GROUND_LOCATION.latitude,
        DEFAULT_GROUND_LOCATION.longitude
      );
      
      setDistance(calculatedDistance);

      if (isWithinRange) {
        // Record attendance
        await recordAttendance(
          user.uid,
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            accuracy: userLocation.accuracy
          },
          calculatedDistance,
          'success'
        );
        
        setStatus('success');
        setAttendanceRecorded(true);
      } else {
        // Record out of range attempt
        await recordAttendance(
          user.uid,
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            accuracy: userLocation.accuracy
          },
          calculatedDistance,
          'absent'
        );
        
        setStatus('out_of_range');
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError(err.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in meters
  };

  const renderStatus = () => {
    switch (status) {
      case 'locating':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Getting your location...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Attendance Marked Successfully!</h3>
            <p className="text-slate-300">You are {formatDistance(distance)} from the ground</p>
          </div>
        );

      case 'out_of_range':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">You are not on the ground</h3>
            <p className="text-slate-300">You are {formatDistance(distance)} away from the cricket ground</p>
            <p className="text-slate-400 text-sm mt-2">Please come within 100m of the ground to mark attendance</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-slate-300">{error}</p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Mark Attendance</h3>
            <p className="text-slate-300 mb-6">
              Click the button below to mark your attendance. 
              You must be within 100m of the cricket ground.
            </p>
            <button
              onClick={handleMarkAttendance}
              disabled={loading || attendanceRecorded}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {attendanceRecorded ? 'Attendance Recorded' : 'Mark Attendance'}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Location Attendance
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Cricket Ground: {DEFAULT_GROUND_LOCATION.name}
            </p>
          </div>

          {/* Status Content */}
          {renderStatus()}

          {/* Back Button */}
          <button
            onClick={onBack}
            className="mt-8 w-full px-6 py-3 bg-white/10 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
