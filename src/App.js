import { useRef } from 'react';
import useMediaRecorder from './hooks/useMediaRecorder';

function App() {
  const audioRef = useRef();
  const { startRecording, stopRecording, status } = useMediaRecorder({
    onStop: (ev, { mediaBlob }) => {
      audioRef.current.src = URL.createObjectURL(mediaBlob);
      console.log(audioRef.current.src);
    },
  });

  return (
    <div className="App">
      <button onClick={status === 'recording' ? stopRecording : startRecording}>
        {status === 'recording' ? 'Stop' : 'Record'}
      </button>

      <audio ref={audioRef} className="w-full" controls>
        Your browser does not support the audio element.
      </audio>
      <a href={audioRef?.current?.src || '#'} download>
        Download
      </a>
    </div>
  );
}

export default App;
