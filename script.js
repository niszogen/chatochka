// helper functions
function randomID() {
    return Math.random().toString(16).substring(2, 8);
}

function formatLog(key, value) {
    const element = document.getElementById(`messages-log-${key}`);

    if (element) {
        element.innerText = value;
    }
}

function createMessage(text, type = "message") {
    const element = document.createElement("span");

    element.className = `messages-log-${type}`;
    element.innerText = text;

    log.appendChild(element);
}

// variables
const log = document.getElementById("messages-log");
const button = document.getElementById("messages-log-connect");
const input = document.getElementById("messages-input");

const id = randomID();
const name = prompt("Enter your name:") || "Guest";

const peer = new Peer(`chatichka-${id}`);

let connection = null;
let connectionID = "";

// set the ID and name in the log
formatLog("id", id);
formatLog("name", name);

// connection event handlers
function onConnectionData(data) {
    createMessage(`<${data.name}> ${data.text}`);
}

function onConnectionClose() {
    createMessage(`A peer (ID: ${connectionID}) disconnected from the chat`, "system");
}

// other event handlers
peer.on("connection", (incoming) => {
    if (!incoming.peer.startsWith("chatichka-")) {
        return;
    }

    if (connection) {
        return;
    }

    connection = incoming;
    connectionID = connection.peer.slice(10);

    connection.on("data", onConnectionData);
    connection.on("close", onConnectionClose);

    createMessage(`A peer (ID: ${connectionID}) connected to the chat`, "system");    
});

button.addEventListener("click", () => {
    connectionID = prompt("Enter the peer's ID:");

    if (connection) {
        connection.close();
    }

    connection = peer.connect(`chatichka-${connectionID}`);

    connection.on("data", onConnectionData);
    connection.on("close", onConnectionClose);

    createMessage(`Connected to a peer (ID: ${connectionID})`, "system");
});

input.addEventListener("change", () => {
    const text = input.value;

    if (!text) {
        return;
    }

    input.value = "";

    if (connection) {
        connection.send({ name, text });
    }

    createMessage(`<${name}> ${text}`);
});