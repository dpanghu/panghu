import { CheckCard } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react'; 
import { Button } from 'SeenPc'; 
  
const Recorder = () => {  
  const audioRef = useRef(null);  
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState<any>([]);
  const [blobUrl, setBlobUrl] = useState(null);  
  
  const startRecording = async () => {  
    try {  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });  
      const audioContext = new AudioContext();  
      const mediaRecorder = new MediaRecorder(stream);  ;  
  
      mediaRecorder.ondataavailable = (e: any) => {  
        console.log('触发中');
        chunks.push(e.data);
        setChunks(chunks);
      };  
  
      mediaRecorder.onstop = () => {  
        console.log('11111111111111111111111111111');
        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });  
        setBlobUrl(URL.createObjectURL(blob));  
      };  
  
      setIsRecording(true);  
      mediaRecorder.start();  
      console.log('222222222222222');
      // 清理  
      return () => {  
        mediaRecorder.stop();  
        stream.getTracks().forEach(track => track.stop());  
        audioContext.close();  
        setIsRecording(false);  
      };  
    } catch (err) {  
      console.error('Error accessing media devices.', err);  
    }  
  };  
  
  const stopRecording = () => {  
    console.log('123213232');
    console.log('结果',JSON.stringify(chunks));
    const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });  
    setBlobUrl(URL.createObjectURL(blob));  
    // 这里通常只需要调用停止的清理函数，但在本例中我们简化处理  
    // 实际应用中，你需要根据`startRecording`返回的清理函数来处理  
    setIsRecording(false);  
  };  
  
  return (  
    <div>  
      {isRecording ? (  
        <Button onClick={stopRecording}>停止录音</Button>  
      ) : (  
        <Button onClick={startRecording}>开始录音</Button>  
      )}  
      {blobUrl && <a href={blobUrl} download="recording.ogg">下载录音</a>}  
    </div>  
  );  
};  
  
export default Recorder;