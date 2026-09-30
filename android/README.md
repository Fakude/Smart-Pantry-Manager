# Smart Pantry Manager

## App Description
Smart Pantry Manager is a native Android application developed in Java. It helps users keep track of their pantry inventory (quantities, units, categories, and expiry dates) and automatically suggests recipes that can be prepared using strictly the available ingredients currently in the pantry.

## Database Option Chosen & Why: SQLite
- **Choice:** SQLite
- **Rationale:** 
  1. **Built-in & Lightweight:** SQLite comes built-in with the Android platform, requiring zero external server setup or complex cloud configurations.
  2. **Relational Support:** It provides robust SQL relational support for storing and querying structured pantry items, recipes, and recipe ingredients efficiently.
  3. **Offline Reliability:** Mobile pantry management requires instant, reliable offline access without internet dependency. SQLite ensures fast local CRUD operations and data persistence across app sessions.

## Project Structure
- `app/src/main/java/za/ac/richfield/smartpantry/`: Contains all Java source files (Activities, Adapters, DatabaseHelper, Data Models, Matching Engine, and UI helpers).
- `app/src/main/AndroidManifest.xml`: App manifest declaring activities and permissions.

## Setup & Run Instructions
1. **Prerequisites:**
   - Install [Android Studio](https://developer.android.com/studio).
   - Android SDK (compatible with API 23+ / compileSdk 35).
2. **Opening the Project:**
   - Open Android Studio and select **Open an Existing Project**.
   - Navigate to and select the `android` directory.
3. **Gradle Sync & Build:**
   - Wait for Gradle sync to complete.
   - Click **Run** (`Shift + F10`) or deploy to an Android Virtual Device (AVD) or physical device running Android 6.0 (API 23) or higher.
