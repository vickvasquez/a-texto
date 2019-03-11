import React, { Component } from 'react';

import api from '~api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      hasError: false,
      isBlocked: false,
      file: null,
    };

    this.audioChunks = [];
    this.mediaRecorder = null;
  }

  onDataAvailable = ({ data }) => {
    this.audioChunks.push(data);
  }

  onSubmit = async () => {
    const { file } = this.state;
    try {
      const body= await api.add({ file, name: 'Testing' });
    } catch (err) {}
  }

  onStopRecording = () => {
    const audioBlob = new Blob(this.audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    this.setState({ file: audioBlob });
    audio.play();
  }

  hasGetUserMedia = () => !!(
    navigator.mediaDevices.getUserMedia
    || navigator.mediaDevices.webkitGetUserMedia
    || navigator.mediaDevices.mozGetUserMedia
    || navigator.mediaDevices.msGetUserMedia
  );

  initRecording = async () => {
    if (this.hasGetUserMedia()) {
      this.audioChunks = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();

        this.mediaRecorder.addEventListener('stop', this.onStopRecording);
        this.mediaRecorder.addEventListener('dataavailable', this.onDataAvailable);

        this.setState({ recording: true });
      } catch (err) {
        if (err === 'DOMException: Permission denied') {
          this.setState({ hasError: true });
        }
      }
    } else {
      this.setState({ isBlocked: true });
    }
  }

  stopRecording = () => {
    const { recording } = this.state;
    if (this.mediaRecorder && recording) {
      this.mediaRecorder.stop();
      this.setState({ recording: false });
    }
  }

  render() {
    const { recording, hasError } = this.state;

    return (
      <div className="container">
        <>{recording && <p>grabando....</p>}</>
        <>{!recording && <p>Grabación detenida....</p>}</>
        <>{hasError && <p>Denegaste el servicio de grabacion</p>}</>
        <button disabled={recording} type="button" onClick={this.initRecording}>Iniciar grabación</button>
        <button disabled={!recording} type="button" onClick={this.stopRecording}>parar grabación</button>
        <button type="button" onClick={this.onSubmit}>Guardar</button>
      </div>
    );
  }
}

export default App;
