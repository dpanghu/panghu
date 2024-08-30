import React, { useRef, useState, useEffect } from 'react';  
import Recorder from 'js-audio-recorder';
import { Button } from 'antd';  
  
const AudioRecorderComponent = () => {  
  const [isRecording, setIsRecording] = useState(false);  
  const recorder: any = useRef(null);  
  
  useEffect(() => {  
    // 初始化Recorder实例  
    recorder.current = new Recorder({  
      sampleBits: 16,                 // 采样位数，默认是16  
      sampleRate: 44100,              // 采样率，默认是44100  
      numChannels: 1,                 // 声道，默认是1  
      // 编码格式  
      encodeType: 'mp3',              // 默认是'mp3'，如果想要wav格式，可以设为'wav'  
      mimeType: 'audio/mpeg',  
    });  
  
    // 监听录音完成  
    recorder.current.onfinish = () => {  
      // 录音完成后获取音频文件  
      const audioUrl = recorder.current.getBlobURL();  
      console.log('Audio recorded:', audioUrl);  
      // 这里可以播放、下载或发送到服务器  
    };  
  
    // 清理  
    return () => {  
      recorder.current.stop();  
      recorder.current.dispose();  
      recorder.current = null;  
    };  
  }, []);  
  
  const handleStartRecording = () => {  
    navigator.mediaDevices.getUserMedia({ audio: true })  
      .then(stream => {  
        recorder.current.record(stream);  
        setIsRecording(true);  
      })  
      .catch(err => {  
        
        console.error('Error accessing media devices.', err);  
      });  
  };  
  
  const handleStopRecording = () => {  
    recorder.current.stop();  
    setIsRecording(false);  
  };  
  
  return (  
    <div>  
      {isRecording ? (  
        <Button onClick={handleStopRecording}>停止录音</Button>  
      ) : (  
        <Button onClick={handleStartRecording}>开始录音</Button>  
      )}  
    </div>  
  );  
};  
  
export default AudioRecorderComponent;