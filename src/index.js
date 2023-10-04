const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { uIOhook, UiohookKey } = require('uiohook-napi');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let hookStarted = false;


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Listen for the front-end request coming in to configure the event sending to the endpoint
    ipcMain.on('keyAPIConfiguration', (event, message) => {
        // if the configuration sent over is wrong the rest of this will break but somehow we have to test        
        // the connection at this point
        if(!message.url) {
            console.error('Error getting the URL');
            return event.returnValue = void 1;
        }
        
        // Start UIOhook for key sending
        if(!hookStarted) {
            uIOhook.start();
            hookStarted = true;
        }

        // Register event listener for all keydown strokes
        hookStarted ? uIOhook.on('keydown', (keyStrokeData) => {
            try {
                void handleKeySend(message.url, keyStrokeData);
            } catch (error) {
                console.log(error)
            }
        }) : void 1;

        // prevent electron from crashing
        event.returnValue = void 1;

        //I dont think this is gonna loop but yeah should be ok now
    });
};

// Keydown event send to URL
function handleKeySend(url, keyData) {
    console.log(url, keyData)
    const h = new Headers();
    h.append('Content-Type', 'application/json');
    const r = JSON.stringify(keyData);
    const o = {
        method: 'POST',
        headers: h,
        body: r,
        redirect: 'follow' // Follow redirects
    };

    // Send web request to URL
    fetch(url, o)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
}

// Start the app when ready
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Create windows when app ready?
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
