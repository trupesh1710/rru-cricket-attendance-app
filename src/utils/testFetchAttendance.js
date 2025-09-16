import { getUserAttendance } from './AttendanceService';

async function testFetchAttendance(userId) {
  try {
    const records = await getUserAttendance(userId);
    console.log('Attendance records for user:', userId);
    console.log(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
  }
}

// Replace with a valid user ID to test
const testUserId = 'RDAyevajchS7ZrKfSvflhzRI4cG3';

testFetchAttendance(testUserId);
