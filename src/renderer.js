function submitForm() {
    // Get IP/PORT details from text boxes
    const fullURL = document.getElementById('url').value;

    // Make sure they actually entered an IP/PORT
    // if (!ip) return alert('Please enter an IP.');
    // if (!port) return alert('Please enter a PORT.');

    // Send API call to backend to forward keystrokes to service listener
    window.keyAPI.sendKeystroke(fullURL);

    // Console log random stuff
    console.log(`IP Address: ${fullURL}`);
}

function check() {
    let url = document.getElementById('url')?.value;
    // check if its a valid URL
    let checkURL;
    try {
        checkURL = new URL(url) ? true : false;
    } catch (error) {
        checkURL = false;
    }
    const button = document.querySelector('input[type="button"]');

    // ip = (ip && ip.match(/(\d{1,3}\.){3}\d{1,3}/)?.[0]) ? true : false;
    // port = port && ("" + parseInt(port)).length === port.length;
    button.classList[!url || !checkURL ? 'add' : 'remove']('disabled');
}
