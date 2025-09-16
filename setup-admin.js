const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json'); // You'll need to provide this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rru-cricket-attendance.firebaseio.com' // Replace with your Firebase project URL
});

const db = admin.firestore();

const DEFAULT_ADMIN_ID = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

/**
 * Initialize the default admin user
 */
async function initializeDefaultAdmin() {
  try {
    console.log('🔄 Checking if admin user already exists...');

    // Check if admin user already exists
    const adminDocRef = db.collection('admins').doc(DEFAULT_ADMIN_ID);
    const adminDoc = await adminDocRef.get();

    if (adminDoc.exists) {
      console.log('⚠️  Admin user already exists!');
      console.log('📋 Current admin credentials:');
      console.log(`   ID: ${DEFAULT_ADMIN_ID}`);
      console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`);
      console.log('💡 Use updateAdminPassword() to change password if needed.');
      return;
    }

    console.log('🔐 Hashing admin password...');

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, salt);

    console.log('💾 Creating admin user document...');

    // Create admin user document
    await adminDocRef.set({
      name: 'Administrator',
      email: 'admin@rrucricket.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Admin user created successfully!');
    console.log('📋 Admin credentials:');
    console.log(`   ID: ${DEFAULT_ADMIN_ID}`);
    console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log('🔒 Please change the password after first login for security.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

/**
 * Update admin password
 */
async function updateAdminPassword(newPassword) {
  try {
    console.log('🔄 Checking if admin user exists...');

    const adminDocRef = db.collection('admins').doc(DEFAULT_ADMIN_ID);
    const adminDoc = await adminDocRef.get();

    if (!adminDoc.exists) {
      console.log('❌ Admin user does not exist. Run without arguments first to create it.');
      return;
    }

    console.log('🔐 Hashing new password...');

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    console.log('💾 Updating admin password...');

    // Update admin user document
    await adminDocRef.update({
      password: hashedPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Admin password updated successfully!');

  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  console.log('🚀 RRU Cricket Attendance - Admin Setup');
  console.log('=====================================\n');

  if (args.length === 0) {
    // Initialize default admin
    await initializeDefaultAdmin();
  } else if (args.length === 1 && args[0] === '--update') {
    // Update password (you would need to provide the new password)
    console.log('❌ Please provide the new password as an argument:');
    console.log('   node setup-admin.js --update "newpassword"');
  } else if (args.length === 2 && args[0] === '--update') {
    // Update password with provided password
    const newPassword = args[1];
    await updateAdminPassword(newPassword);
  } else {
    console.log('❌ Invalid arguments!');
    console.log('\n📖 Usage:');
    console.log('   Create default admin: node setup-admin.js');
    console.log('   Update admin password: node setup-admin.js --update "newpassword"');
    process.exit(1);
  }

  console.log('\n🎉 Setup completed successfully!');
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Setup interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the setup
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
