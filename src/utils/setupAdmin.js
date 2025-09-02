import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import bcrypt from 'bcryptjs';

// This function should be called once to set up initial admin accounts
export async function setupInitialAdmin() {
  try {
    // Create a sample admin account
    const plainPassword = 'admin123';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);

    const adminData = {
      adminId: 'admin001',
      name: 'System Administrator',
      email: 'admin@rru-cricket.com',
      password: hashedPassword, // Store hashed password
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'admins', adminData.adminId), adminData);
    console.log('Admin account created successfully:', adminData.adminId);
    
    return adminData;
  } catch (error) {
    console.error('Error setting up admin account:', error);
    throw error;
  }
}

// Function to check if admin setup is needed
export async function checkAdminSetup() {
  try {
    // You can add logic here to check if admin accounts exist
    // For now, we'll just return true to indicate setup might be needed
    return true;
  } catch (error) {
    console.error('Error checking admin setup:', error);
    return false;
  }
}
