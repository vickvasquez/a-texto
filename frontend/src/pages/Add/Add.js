import React, { Component } from 'react';

import api from '~api';

import { Microphone } from '~components';

import './style.scss';

const initialState = {
  hasError: false,
  isBlocked: false,
  file: null,
  icon: 'microphone',
  timingElapse: 0,
  audioUrl: '',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      nextAction: this.initRecording,
    };

    this.audioChunks = [];
    this.mediaRecorder = null;
    this.idTime
  }

  onDataAvailable = ({ data }) => {
    this.audioChunks.push(data);
  }

  onDiscard = () => {
    this.setState({
      ...initialState,
      nextAction: this.initRecording,
    });
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
    const { hasError, icon, timingElapse, nextAction, file } = this.state;

    return (
      <div styleName="container-add">
        <>{hasError && <p>Denegaste el servicio de grabacion</p>}</>
        <h1 styleName="header">Click sobre el microfono para grabar</h1>
        <Microphone
          onClick={nextAction}
          icon={icon}
        />
        <h2 styleName="time-elapse"> {timingElapse} </h2>
        {file && (
          <div styleName="footer">
            <button type="button" styleName="button unstyled" onClick={this.onDiscard}> Descartar </button>
            <button type="button" styleName="button primary"> Guardar </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
