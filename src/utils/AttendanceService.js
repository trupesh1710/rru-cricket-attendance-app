import { db } from '../firebase.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  doc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

/**
 * Record attendance for a user
 * @param {string} userId - User's UID
 * @param {object} location - User's location { latitude, longitude }
 * @param {number} distance - Distance from predefined location in meters
 * @param {string} status - Attendance status ('success' or 'absent')
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
    case 'absent':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>} Array of all users
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error(`Failed to load users: ${error.message}`);
  }
};

/**
 * Get all attendance records (Admin only)
 * @param {number} maxRecords - Maximum number of records to fetch
 * @returns {Promise<Array>} Array of all attendance records
 */
export const getAllAttendance = async (maxRecords = 1000) => {
  try {
    const attendanceRef = collection(db, 'attendance');
    const q = query(
      attendanceRef,
      orderBy('timestamp', 'desc'),
      limit(maxRecords)
    );
    const querySnapshot = await getDocs(q);
    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return records;
  } catch (error) {
    console.error('Error fetching all attendance records:', error);
    throw new Error(`Failed to load attendance records: ${error.message}`);
  }
};

/**
 * Delete a user (Admin only)
 * @param {string} userId - User's UID
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    // Note: Firebase Auth user deletion requires admin SDK on server-side
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Get user details by ID
 * @param {string} userId - User's UID
 * @returns {Promise<object|null>} User data or null if not found
 */
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Failed to load user: ${error.message}`);
  }
};
