import { useRef, useEffect } from "react";
import io from "socket.io-client";
import kurentoUtils from "kurento-utils";
import { useRoom } from "../hooks/roomHooks";

export const useWebrtc = ({ videoRef, url = "http://localhost:5000" }) => {
  const webRtcPeer = useRef(null);
  const socket = useRef(null);

  const [, setRoom] = useRoom();

  useEffect(() => {
    socket.current = io(`${url}`);
    socket.current.on("message", (message) => {
      console.log(`Receive message: ${message.id}`);

      switch (message.id) {
        case "createRoomResponse":
          createRoomResponse(message);
          break;

        case "releaseRoomResponse":
          releaseRoomResponse(message);
          break;

        case "joinRoomResponse":
          joinRoomResponse(message);
          break;

        case "leaveRoomResponse":
          leaveRoomResponse(message);
          break;

        case "stopCommunication":
          dispose();
          break;

        case "iceCandidate":
          webRtcPeer.current.addIceCandidate(message.candidate);
          break;

        default:
          console.error(`Unrecognized message: ${message.id}`);
      }
    });
  }, []);

  const createRoomResponse = (message) => {
    if (message.response !== "success") {
      const error = message.error ? message.error : "Unknow error";
      console.info(`Create room failed for the following reason: ${error}`);
    } else {
      setRoom(message.room);
    }
  };

  const releaseRoomResponse = (message) => {
    if (message.response !== "success") {
      const error = message.error ? message.error : "Unknow error";
      console.info(`Release room failed for the following reason: ${error}`);
    } else {
      setRoom({ id: "", tokens: {} });
    }
  };

  const joinRoomResponse = (message) => {
    if (message.response !== "success") {
      const error = message.error ? message.error : "Unknow error";
      console.info(`Join room failed for the following reason: ${error}`);
      dispose();
    } else {
      webRtcPeer.current.processAnswer(message.sdpAnswer);
    }
  };

  const leaveRoomResponse = (message) => {
    if (message.response !== "success") {
      const error = message.error ? message.error : "Unknow error";
      console.info(`Leave room failed for the following reason: ${error}`);
    } else {
      console.info(`Leave room`);
    }
    dispose();
  };

  const dispose = () => {
    if (webRtcPeer.current) {
      webRtcPeer.current.dispose();
      webRtcPeer.current = null;
    }
  };

  const joinRoom = ({ token, name }) => {
    if (!token) return;

    if (!webRtcPeer.current) {
      const options = {
        remoteVideo: videoRef.current,
        onIceCandidate: (candidate) =>
          sendMessage({ id: "onIceCandidate", candidate }),
      };

      webRtcPeer.current = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
        options,
        function (error) {
          if (error) return console.error(error);
          this.generateOffer((error, sdpOffer) => {
            if (error) return console.error(error);

            console.info("Invoking SDP offer callback function ");
            sendMessage({ id: "joinRoom", token, name, sdpOffer });
          });
        }
      );
    }
  };

  const leaveRoom = (roomId) => {
    sendMessage({ id: "leaveRoom", roomId });
    dispose();
  };

  const sendMessage = (message) => {
    socket.current.send(message);
  };

  const createRoom = () => {
    sendMessage({ id: "createRoom" });
  };

  const releaseRoom = (roomId) => {
    sendMessage({ id: "releaseRoom", roomId });
  };

  return [joinRoom, leaveRoom, createRoom, releaseRoom];
};
