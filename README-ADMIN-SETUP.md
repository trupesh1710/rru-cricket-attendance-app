# Admin Setup Guide

This guide explains how to set up the default admin user for the RRU Cricket Attendance system.

## Prerequisites

1. **Firebase Project**: Make sure you have a Firebase project set up
2. **Firebase Admin SDK**: The project should have Firebase Admin SDK configured
3. **Service Account Key**: You need a Firebase service account key file

## Step 1: Create Firebase Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file
6. Rename it to `firebase-service-account.json`
7. Place it in the root directory of your project (`rru-cricket-attendance/`)

## Step 2: Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

## Step 3: Run Admin Setup Script

### Option A: Create Default Admin (Recommended)

Run the setup script to create the default admin user:

```bash
node setup-admin.js
```

This will create an admin user with:
- **ID**: `admin`
- **Password**: `admin123`

### Option B: Update Admin Password

If you want to update the admin password:

```bash
node setup-admin.js --update "newpassword"
```

Replace `"newpassword"` with your desired password.

## Step 4: Verify Setup

After running the setup script, you should see output like:

```
🚀 RRU Cricket Attendance - Admin Setup
=====================================

🔄 Checking if admin user already exists...
🔐 Hashing admin password...
💾 Creating admin user document...
✅ Admin user created successfully!
📋 Admin credentials:
   ID: admin
   Password: admin123
🔒 Please change the password after first login for security.

🎉 Setup completed successfully!
```

## Step 5: Test Admin Login

1. Start your React application:
   ```bash
   npm start
   ```

2. Go to the login page
3. Use the admin credentials:
   - **Username/ID**: `admin`
   - **Password**: `admin123`

4. After successful login, you should see admin-specific buttons in the dashboard

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Password**: After first login, immediately change the default password
2. **Service Account Key**: Keep the `firebase-service-account.json` file secure and never commit it to version control
3. **Environment Variables**: Consider using environment variables for sensitive configuration in production

## Troubleshooting

### Common Issues:

1. **"firebase-service-account.json not found"**
   - Make sure you downloaded the service account key from Firebase Console
   - Ensure the file is named exactly `firebase-service-account.json`
   - Place it in the project root directory

2. **Permission Errors**
   - Make sure your Firebase project has Firestore enabled
   - Check that your service account has the necessary permissions

3. **Module Errors**
   - Ensure all dependencies are installed: `npm install`
   - Make sure you're running the command from the project root directory

### Getting Help

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify your Firebase project configuration
3. Ensure all prerequisites are met

## Admin Features Available

Once the admin is set up, you can access:

- **Admin Panel**: Global attendance statistics
- **User Management**: View and manage all users
- **Admin Reports**: Generate comprehensive attendance reports
- **CSV Export**: Export all attendance data

## Next Steps

After setting up the admin:
1. Test all admin features
2. Configure additional settings as needed
3. Set up regular backups of your data
4. Monitor usage and performance
