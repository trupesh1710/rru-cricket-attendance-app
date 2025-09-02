import { db } from '../firebase.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  limit
} from 'firebase/firestore';

/**
 * Record attendance for a user
 * @param {string} userId - User's UID
 * @param {object} location - User's location { latitude, longitude }
 * @param {number} distance - Distance from predefined location in meters
 * @param {string} status - Attendance status ('success' or 'out_of_range')
 * @returns {Promise<string>} Document ID of the attendance record
 */
export const recordAttendance = async (userId, location, distance, status) => {
  try {
    const attendanceRef = collection(db, 'attendance');
    const docRef = await addDoc(attendanceRef, {
      userId,
      location,
      distance,
      status,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error recording attendance:', error);
    throw error;
  }
};

/**
 * Get attendance records for a specific user
 * @param {string} userId - User's UID
 * @param {number} maxRecords - Maximum number of records to fetch
 * @returns {Promise<Array>} Array of attendance records
 */
export const getUserAttendance = async (userId, maxRecords = 50) => {
  try {
    const attendanceRef = collection(db, 'attendance');
    const q = query(
      attendanceRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(maxRecords)
    );
    
    const querySnapshot = await getDocs(q);
    const attendanceRecords = [];
    
    querySnapshot.forEach((doc) => {
      attendanceRecords.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return attendanceRecords;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    // Provide more detailed error information
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied: You do not have access to view attendance records');
    } else if (error.code === 'failed-precondition') {
      throw new Error('Database error: Please check if the timestamp field is indexed');
    } else {
      throw new Error(`Failed to load attendance records: ${error.message} (code: ${error.code})`);
    }
  }
};

/**
 * Format timestamp for display
 * @param {object} timestamp - Firestore timestamp
 * @returns {string} Formatted date and time string
 */
export const formatAttendanceTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = timestamp.toDate();
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Get status badge class based on attendance status
 * @param {string} status - Attendance status
 * @returns {string} Tailwind CSS classes
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'success':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'out_of_range':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};
