import { useRef } from "react";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

/*
There are 3 important apis here: mediaDevices.getUserMedia(), MediaRecorder, and Blob
mediaDevices will give a stream to MediaRecorder. 
Analogy: It's like MediaDevices will say, "I'll direct you to where the stream is located so you recorder can catch any media it gives you."
It's like nagashisoumen - the employee is the MediaDevice, I am the MediaRecorded and the soumen is the Blob
*/

function App() {
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioStream, setAudioStream] = useState(null);
  const [duration, setDuration] = useState(0);

  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef();
  const mimeType = "audio/mp4";

  useEffect(() => {
    if (recordingStatus === "inactive") {
      return;
    }

    const interval = setInterval(() => {
      setDuration((curr) => curr + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  async function startRecording() {
    let tempStream;
    console.log("Start recording");

    try {
      // mediaDevices is a singleton object that gives access to user's media input devices like mic or camera as well as screen sharing
      // on of it's properties is getUserMedia which prompts the user to approve access to the requested input device like mic
      // getUserMedia will then return a promise that resolves a MediaStream instance when the user grants access and error with a message of permission denied if not granted
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      tempStream = streamData;
    } catch (err) {
      console.log(err.message);
      return;
    }
    setRecordingStatus("recording");

    // create new Media recorder instance using the stream
    const media = new MediaRecorder(tempStream, { type: mimeType }); // inherits from EventTarget interface
    mediaRecorder.current = media;

    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      //event here is a BlobEvent which also inherit Event
      console.log("event", event);
      if (typeof event.data === "undefined") {
        return;
      }
      if (event.data.size === 0) {
        return;
      }
      console.log("dataavialable", event.data);
      localAudioChunks.push(event.data);
    };
    console.log("setAudioChunks", localAudioChunks);
    setAudioChunks(localAudioChunks);
  }

  async function stopRecording() {
    setRecordingStatus("inactive");
    console.log("Stop recording");

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      console.log(audioChunks);
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(audioBlob);
      setAudioChunks([]);
      setDuration(0);
      const url = URL.createObjectURL(audioBlob);
      console.log(url);
      audioRef.current.src = url;
    };
  }

  return (
    <div className="App">
      <label>{mediaRecorder?.current?.state}</label>
      <button
        onClick={
          recordingStatus === "recording" ? stopRecording : startRecording
        }
      >
        {recordingStatus === "recording" ? "Stop" : "Record"}
      </button>

      <audio ref={audioRef} className="w-full" controls>
        Your browser does not support the audio element.
      </audio>
      <a href={audioRef?.current?.src || "#"} download>
        Download
      </a>
    </div>
  );
}

export default App;
