import React, { Component } from 'react';

import api from '~api';

import Recording from '~components/Recording';

import './style.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      isBlocked: false,
      file: null,
      icon: 'microphone',
      timingElapse: 0,
      nextAction: this.initRecording,
      audioUrl: '',
    };

    this.audioChunks = [];
    this.mediaRecorder = null;
    this.idTime
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
    this.setState({ file: audioBlob, audioUrl });
  }

  onPlay = () => {
    const { audioUrl, isRecording } = this.state;
    const audio = new Audio(audioUrl);
    if (audio && !isRecording) {
      this.setState({ isPlaying: true });
      audio.play();
    }
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

        this.tick();
        this.setState({ isRecording: true, icon: 'stop', nextAction: this.stopRecording });
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
    const { isRecording } = this.state;
    if (this.mediaRecorder && isRecording) {
      this.mediaRecorder.stop();
      this.setState({ isRecording: false, icon: 'play', nextAction: this.onPlay });
      clearInterval(this.idTime);
    }
  }

  tick = () => {
    this.idTime = setInterval(() => {
      this.setState(({ timingElapse }) => ({ timingElapse: timingElapse + 1 }));
    }, 1000)
  }

  render() {
    const { hasError, icon, timingElapse, nextAction } = this.state;

    return (
      <div styleName="container">
        {/*<div styleName="container-app">
          <button disabled={!recording} type="button" onClick={this.stopRecording}>parar grabación</button>
          <button type="button" onClick={this.onSubmit}>Guardar</button>
        </div>*/}
        <div styleName="container-microphone">
          <>{hasError && <p>Denegaste el servicio de grabacion</p>}</>
          <h2> {timingElapse} </h2>
          <p>Click sobre el microfono para iniciar grabación</p>
          <Recording
            onClick={nextAction}
            icon={icon}
          />
        </div>
      </div>
    );
  }
}

export default App;
