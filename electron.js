const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * Creates the main application window.
 */
function createWindow() {
    // We get the primary screen size to set a good starting window size
    const screen = require('electron').screen.getPrimaryDisplay();
    const { width, height } = screen.workAreaSize;

    const mainWindow = new BrowserWindow({
        // Starting size can be full screen or a large window
        width: width,
        height: height,
        title: "The Campsite",
        webPreferences: {
            // Allows using Node.js modules (like 'path') in the render process,
            // which is sometimes required by build tools or specific A-Frame components.
            nodeIntegration: true,
            // Disabling context isolation is a common practice for older tutorials/setups
            // but is generally discouraged for security. Using it here for compatibility.
            contextIsolation: false,
        },
        // Optional: Hide the menu bar for a cleaner game feel
        autoHideMenuBar: true,
        // Optional: Start in full screen mode immediately
        fullscreen: true 
    });

    // 🌟 CRITICAL LINE: Load the client/index.html file
    // __dirname is the root directory where electron.js lives.
    mainWindow.loadFile(path.join(__dirname, 'client', 'index.html'));

    // Optional: Open DevTools for debugging (useful during development)
    // mainWindow.webContents.openDevTools();
}

// Electron lifecycle: Create the window when the app is ready.
app.whenReady().then(() => {
    createWindow();

    // macOS specific logic: Re-create the window when the dock icon is clicked
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit the app when all windows are closed (standard for non-macOS apps)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});