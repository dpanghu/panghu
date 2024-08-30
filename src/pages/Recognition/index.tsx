import React, { useState, useEffect } from 'react';  
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';  
import { Button } from 'SeenPc';
  
const SpeechInputComponent = () => {  
  const [transcript, setTranscript] = useState('');  
  const {  
    transcript: text,  
    resetTranscript,  
    listening,  
    browserSupportsSpeechRecognition,  
    startListening,  
    stopListening,  
  } = useSpeechRecognition();  
  
  // 更新识别的文本  
  useEffect(() => {  
    if (text !== transcript) {  
      setTranscript(text);  
    }  
  }, [text, transcript]);  
  
  return (  
    <div>  
      <h2>语音录入组件</h2>  
      {browserSupportsSpeechRecognition ? (  
        <>  
          <Button onClick={startListening}>开始录音</Button>  
          <Button onClick={stopListening} disabled={!listening}>停止录音</Button>  
          <p>识别到的文本: {transcript || '等待识别...'}</p>  
          <Button onClick={resetTranscript}>清除文本</Button>  
        </>  
      ) : (  
        <p>您的浏览器不支持语音识别。</p>  
      )}  
    </div>  
  );  
};  
  
export default SpeechInputComponent;