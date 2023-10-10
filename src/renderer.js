function enableNativeHooks() {
    // Get IP/PORT details from text boxes
    const fullURL = document.getElementById('url').value;

    // Send API call to backend to forward keystrokes to service listener
    window.keyAPI.startHooks(fullURL);

    // Console log random stuff
    console.log(`IP Address: ${fullURL}`);
}

function disableNativeHooks() {
    // Stop all listeners
    window.keyAPI.stopHooks();
}

// check if URL and show the submit button
function check() {
    let url = document.getElementById('url')?.value;
    // check if its a valid URL
    // let checkURL;
    // try {
    //     checkURL = url ? (url.match(/localhost/gim) ? true : false) : false;
    //     // checkURL = new URL(url) ? true : false;
    // } catch (error) {
    //     checkURL = false;
    // }
    const button = document.querySelector('input[type="button"]');
    console.log(!url ? 'remove' : 'add');
    button.classList[!url ? 'add' : 'remove']('disabled');
}
