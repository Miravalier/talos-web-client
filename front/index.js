import { Terminal } from '@xterm/xterm';
import { AttachAddon } from '@xterm/addon-attach';
import { FitAddon } from '@xterm/addon-fit';


window.addEventListener("load", async () => {
  console.log("Creating Terminal");

  const terminal = new Terminal();
  terminal.options.fontSize = 22;

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(document.getElementById('terminal'));
  fitAddon.fit();

  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  console.log("Opening WebSocket ...");
  const webSocket = new WebSocket(`ws://${window.location.host}/ssh?id=${sessionId}`);

  const sendWindowSize = () => {
    const textEncoder = new TextEncoder("utf-8");
    webSocket.send(textEncoder.encode(JSON.stringify({height: terminal.rows, width: terminal.cols})));
  }

  webSocket.onopen = async () => {
    console.log("WebSocket Open");

    sendWindowSize();

    const attachAddon = new AttachAddon(webSocket);
    terminal.loadAddon(attachAddon);

    window.addEventListener('resize', () => {
      fitAddon.fit();
      sendWindowSize();
    });

    webSocket.onclose = async (ev) => {
      terminal.reset();
    }
  }
});
