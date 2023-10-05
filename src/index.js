const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { uIOhook, UiohookKey } = require('uiohook-napi');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let hookStarted = false;
let hookURL = '';


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
    // mainWindow.webContents.openDevTools();

    // Listen for the front-end request coming in to configure the event sending to the endpoint
    ipcMain.on('start-native-hooks', (event, url, enabled) => {
        // if the configuration sent over is wrong the rest of this will break but somehow we have to test        
        // the connection at this point
        if(!url) {
            console.error('Error getting the URL');
            return event.returnValue = void 0;
        }
        
        // Start UIOhook for key sending
        if(!hookStarted) {
            uIOhook.start();
            hookStarted = true;
            hookURL = url;
            uIOhook.on('keydown', (key) => handleKeySend(hookURL, key));
            return (event.returnValue = void 0);
        }

        if(url && hookStarted) { 
            hookURL = url;
            return (event.returnValue = void 0);
        }
        // if everything is already started dont do anything
        return (event.returnValue = void 0);
    });

    ipcMain.on('stop-native-hooks', (event, state) => {
        if(state && hookStarted) {
            uIOhook.stop();
            return (event.returnValue = void 0);
        }
        return (event.returnValue = void 0);
    });


};

// let lastkeyPressed = 0;
let headers = new Headers();
headers.append('Content-Type', 'application/json');

// Keydown event send to URL
function handleKeySend({ url }, keyData) {
    console.log(url, keyData)
    // let samekeyPushed = lastkeyPressed === keyData.keycode;
    // if (samekeyPushed) return void 0;
    // lastkeyPressed = keyData.keycode;

    // implement a better system then below this line, because no security etc

    const o = {
        method: 'POST',
        headers,
        body: JSON.stringify(keyData),
        redirect: 'follow', // Follow redirects
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
