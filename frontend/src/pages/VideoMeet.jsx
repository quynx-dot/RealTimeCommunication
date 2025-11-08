import React, { useRef, useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import "../styles/VideoComponent.css";

const server_url = "http://localhost:5000";
var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoRef = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState();
  const [audio, setAudio] = useState();
  const [screen, setScreen] = useState();
  const [showModal, setModal] = useState();
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState(false);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const videoRef = useRef([]);
  const [videos, setVideos] = useState([]);

  // ✅ Ask for permissions on load
  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoAvailable(!!videoPermission);

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioAvailable(!!audioPermission);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  // ✅ Capture new video/audio state
  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.log(err));
    } else {
      try {
        let tracks = localVideoRef.current?.srcObject?.getTracks();
        tracks?.forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
    }
  };

  // ✅ When user toggles audio/video
  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  // ✅ Button handler
  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    // connectToSocketServer(); // you can enable this later
  };

  return (
    <div>
      {askForUsername ? (
        <div>
          <h2>Enter into lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" onClick={getMedia}>
            Connect
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted playsInline></video>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </div>
  );
}
