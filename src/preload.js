// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('keyAPI', {
    // Send out a keystroke to the IPC listener on the backend
    // when the render process finds the submitForm () call
    sendKeystroke: (url) => ipcRenderer.sendSync('keyAPIConfiguration', { url }),
});
