import io from "socket.io-client";
import { ref } from "vue";
import ls from "localstorage-slim";
const wa_gateway = process.env.WA_GATEWAY;

export const socket = io(wa_gateway);
const sessionName = ref(ls.get("waSession")) || "default";
export const addSession = async (number) => {
  sessionName.value = number;
  ls.set("waSession", number);
  socket.emit("requestQRCode", { sessionName: number });
  socket.on(`qrRequest_${sessionName}`, (data) => {
    console.log(data.status);
  });
  socket.on(`authenticated_${sessionName}`, (data) => {
    console.log(data);
  });
};

// export constsocket
// export const

export const sendMessage = async (number, message, sender) => {
  socket.emit("sendMessageRequest", {
    sessionName: "default",
    message: "Love",
    contact: "6285711525459",
  });
};

export const sendPicture = async (image, contact, caption) => {
  const data = {
    image,
    contact,
    caption,
  };
  socket.emit("sendPicture", data);
};

export const listen = async (event) => {
  console.log(sessionName.value);
  return socket.on(`${event}_${sessionName.value}`, (data) => {
    return data;
  });
};
