import { db } from '../firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const DEFAULT_ADMIN_ID = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

/**
 * Initialize the default admin user
 * This function should be called once during application setup
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const initializeDefaultAdmin = async () => {
  try {
    // Check if admin user already exists
    const adminDocRef = doc(db, 'admins', DEFAULT_ADMIN_ID);
    const adminDoc = await getDoc(adminDocRef);

    if (adminDoc.exists()) {
      return {
        success: false,
        message: 'Admin user already exists. Use updateAdminPassword() to change password if needed.'
      };
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, salt);

    // Create admin user document
    await setDoc(adminDocRef, {
      name: 'Administrator',
      email: 'admin@rrucricket.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      success: true,
      message: `Admin user created successfully!\nID: ${DEFAULT_ADMIN_ID}\nPassword: ${DEFAULT_ADMIN_PASSWORD}`
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      message: `Failed to create admin user: ${error.message}`
    };
  }
};

/**
 * Update admin password
 * @param {string} newPassword - New password for admin
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateAdminPassword = async (newPassword) => {
  try {
    const adminDocRef = doc(db, 'admins', DEFAULT_ADMIN_ID);
    const adminDoc = await getDoc(adminDocRef);

    if (!adminDoc.exists()) {
      return {
        success: false,
        message: 'Admin user does not exist. Use initializeDefaultAdmin() first.'
      };
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update admin user document
    await setDoc(adminDocRef, {
      ...adminDoc.data(),
      password: hashedPassword,
      updatedAt: new Date()
    }, { merge: true });

    return {
      success: true,
      message: 'Admin password updated successfully!'
    };
  } catch (error) {
    console.error('Error updating admin password:', error);
    return {
      success: false,
      message: `Failed to update admin password: ${error.message}`
    };
  }
};

/**
 * Get admin credentials (for display purposes only)
 * @returns {object} Admin credentials object
 */
export const getAdminCredentials = () => {
  return {
    id: DEFAULT_ADMIN_ID,
    password: DEFAULT_ADMIN_PASSWORD,
    note: 'These are the default credentials. Change the password after first login for security.'
  };
};

/**
 * Check if admin user exists
 * @returns {Promise<boolean>}
 */
export const adminExists = async () => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', DEFAULT_ADMIN_ID));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};
