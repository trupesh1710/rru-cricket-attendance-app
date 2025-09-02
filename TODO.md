# Fix Firestore Permission Error in add-admin.js

## Problem
- add-admin.js script fails with PERMISSION_DENIED error when trying to write to Firestore
- Error occurs because script uses client Firebase SDK without authentication
- Firestore security rules require authentication for all write operations

## Solution Plan
- [x] Update package-add-admin.json to include firebase-admin SDK
- [x] Modify add-admin.js to use Firebase Admin SDK instead of client SDK
- [ ] Guide user to download/create Firebase service account key
- [ ] Test the updated script to ensure admin user creation works

## Files to Modify
- rru-cricket-attendance/package-add-admin.json
- rru-cricket-attendance/add-admin.js

## Next Steps
- Install dependencies and test the fix
