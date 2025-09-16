const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const db = admin.firestore();

// Configure nodemailer transporter (replace with your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

// Added admin user creation function
exports.createDefaultAdminUser = functions.https.onRequest(async (req, res) => {
  try {
    const adminId = 'admin';
    const plainPassword = 'admin123';
    const bcrypt = require('bcryptjs');

    // Check if admin user already exists
    const adminDoc = await db.collection('admins').doc(adminId).get();
    if (adminDoc.exists) {
      res.status(200).send('Admin user already exists.');
      return;
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);

    // Create admin user document
    await db.collection('admins').doc(adminId).set({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).send('Error creating admin user.');
  }
});

// Function to generate admin token
exports.generateAdminToken = functions.https.onCall(async (data, context) => {
  const { adminId } = data;

  if (!adminId) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with an adminId.');
  }

  try {
    const adminDoc = await db.collection('admins').doc(adminId).get();

    if (!adminDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Admin user not found.');
    }

    // Generate custom token for adminId
    let customToken;
    try {
      customToken = await admin.auth().createCustomToken(adminId, { role: 'admin' });
    } catch (tokenError) {
      console.error('Token creation error:', tokenError);
      throw new functions.https.HttpsError('internal', 'Unable to generate custom token due to token creation error.');
    }

    return { token: customToken };
  } catch (error) {
    console.error('Error generating custom token:', error);
    throw new functions.https.HttpsError('internal', 'Unable to generate custom token.');
  }
});

// Function to validate attendance location
exports.validateAttendanceLocation = functions.https.onCall(async (data, context) => {
  const { userLat, userLng, targetLat, targetLng, radius } = data;

  if (!userLat || !userLng || !targetLat || !targetLng || !radius) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required location parameters.');
  }

  try {
    // Calculate distance using Haversine formula
    const distance = calculateDistance(userLat, userLng, targetLat, targetLng);
    const isWithinRange = distance <= radius;

    return {
      isWithinRange,
      distance,
      userLocation: { latitude: userLat, longitude: userLng },
      targetLocation: { latitude: targetLat, longitude: targetLng },
      radius
    };
  } catch (error) {
    console.error('Error validating location:', error);
    throw new functions.https.HttpsError('internal', 'Unable to validate location.');
  }
});

// Haversine formula implementation for server-side distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
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
}

// Function to send OTP for password reset
exports.sendPasswordResetOTP = functions.https.onCall(async (data, context) => {
  const { email } = data;

  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required.');
  }

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Firestore with expiration (10 minutes)
    const otpDoc = {
      otp,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000) // 10 minutes
    };

    await db.collection('passwordResets').doc(email).set(otpDoc);

    // Send OTP via email
    const mailOptions = {
      from: functions.config().email.user,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'OTP sent to your email.' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw new functions.https.HttpsError('internal', 'Unable to send OTP.');
  }
});

// Function to verify OTP
exports.verifyOTP = functions.https.onCall(async (data, context) => {
  const { email, otp } = data;

  if (!email || !otp) {
    throw new functions.https.HttpsError('invalid-argument', 'Email and OTP are required.');
  }

  try {
    const otpDoc = await db.collection('passwordResets').doc(email).get();

    if (!otpDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'OTP not found or expired.');
    }

    const otpData = otpDoc.data();

    if (otpData.otp !== otp) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid OTP.');
    }

    if (!otpData.expiresAt || typeof otpData.expiresAt.toMillis !== 'function') {
      console.error('Invalid or missing expiresAt field in OTP data:', otpData);
      throw new functions.https.HttpsError('internal', 'OTP expiration data is invalid.');
    }

    if (otpData.expiresAt.toMillis() < Date.now()) {
      throw new functions.https.HttpsError('deadline-exceeded', 'OTP has expired.');
    }

    // OTP verified, delete it
    await db.collection('passwordResets').doc(email).delete();

    return { success: true, message: 'OTP verified successfully.' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    // Return the actual error message if available
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', `Unable to verify OTP: ${error.message || error}`);
  }
});

// Function to reset password
exports.resetPassword = functions.https.onCall(async (data, context) => {
  const { email, newPassword } = data;

  if (!email || !newPassword) {
    throw new functions.https.HttpsError('invalid-argument', 'Email and new password are required.');
  }

  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // Update password
    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });

    return { success: true, message: 'Password reset successfully.' };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw new functions.https.HttpsError('internal', 'Unable to reset password.');
  }
});
