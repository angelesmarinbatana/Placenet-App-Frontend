# Running Placenet App
This document will be a step by step manual on how to setp up running the Placenet App on your local envoronment. 

Before getting started, make sure you have a code editor for running (we use Visual Studio Code)
* VS Code: https://code.visualstudio.com/download

## Installations
1. **Node JS**
    * Install Node.JS: https://nodejs.org/en
      
2. **EXPO**
    * Sign Up for Expo: https://expo.dev/signup
    * Install Expo locally: [npx create-expo-app@latest](https://docs.expo.dev/more/expo-cli/)
    * Intsall Expo Mobile App: https://apps.apple.com/us/app/expo-go/id982107779
    * Log in
   
3. **EXPO Router**
    * Install Expo Router https://docs.expo.dev/router/installation/ 

4. **Watchman**
    * Install Watchman: https://facebook.github.io/watchman/docs/install
We installed Watchman to help with app file handling, as the operating system might limit files that can be watched by a single app.

## Getting the Placenet App 
From Github: 
1. Clone the Repository
    * git clone https://github.com/angelesmarin/Placenet.git
  
In your terminal:
   *  watchman watch [path to Placenet project directory]
      *  This ensures that watchman is watching your project

In your code editor:

1. Navigate to the Project Directory
     * cd Placenet 
2. Install Dependencies
     * npm install
3. Start the App
     * npx expo start

## Running App on Device
1. Open EXPO GO mobile application on your device
2. Scan QR code displayed from the terminal

### Optional: Running App on Web Browser 
   *  In code editor terminal, select W to launch the app on your local web browser.

### For more information, visit Expo website: https://expo.dev/ 
