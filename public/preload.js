const { contextBridge, ipcRenderer } = require("electron");

let validSendChannels = ["restart_app"];
let validRecieveChannels = ["update_downloaded"];

contextBridge.exposeInMainWorld("api", {
  send(channel, ...args) {
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel);
    }
  },
  recieve(channel, func) {
    if (validRecieveChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => {
        func(args);
      });
    }
  },
});
