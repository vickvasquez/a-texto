import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import api from '~api';
import diff from '../../lib/util';

import { Microphone, Animation, Modal, ModalHeader, ModalBody, ModalFooter } from '~components';

import './style.scss';

const initialState = {
  hasError: false,
  isBlocked: false,
  file: null,
  icon: 'microphone',
  timingElapse: '00:00',
  audioUrl: '',
  showModal: false,
  filename: '',
  loading: false,
  timeInit: '',
  isPlaying: false,
};

class App extends Component {
  static propTypes = {
    refetch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      nextAction: this.initRecording,
    };

    this.audioChunks = [];
    this.mediaRecorder = null;
    this.idTime = 0;
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

  onSave = () => {
    this.setState({ showModal: true });
  }

  onCloseModal = () => {
    this.setState({ showModal: false });
  }

  onSubmit = async (evt) => {
    evt.preventDefault();
    const { file, filename, timingElapse } = this.state;
    const { refetch } = this.props;
    try {
      this.setState({ loading: true });
      await api.add({ file, name: filename, duration: timingElapse });
      await refetch();
      this.onDiscard();
      this.setState({ loading: false, showModal: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  }

  onStopRecording = () => {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/ogg; codecs=opus' });
    const audioUrl = URL.createObjectURL(audioBlob);
    this.setState({ file: audioBlob, audioUrl });
  }

  onPlay = () => {
    const { audioUrl, isPlaying } = this.state;
    const audio = new Audio(audioUrl);
    if (!isPlaying) {
      this.setState({ isPlaying: true });
      audio.play();
    } else {
      this.setState({ isPlaying: false });
      audio.pause();
    }
  }

  onChangeName = ({ currentTarget: { value } }) => {
    this.setState({ filename: value });
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
        this.setState({ isRecording: true, icon: 'stop', nextAction: this.stopRecording, timeInit: moment() });

        this.tick();
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
    const { timeInit } = this.state;
    this.idTime = setInterval(() => {
      this.setState(() => ({ timingElapse: diff(timeInit) }));
    }, 1000);
  }

  render() {
    const { hasError, icon, timingElapse, nextAction, file, showModal, filename, loading } = this.state;
    return (
      <div styleName="container-add">
        <>{hasError && <p>Denegaste el servicio de grabacion</p>}</>
        <h1 styleName="header">Click sobre el microfono para grabar</h1>
        <Microphone
          onClick={nextAction}
          icon={icon}
        />
        <h2 styleName="time-elapse">
          {timingElapse}
        </h2>
        {file && (
          <div styleName="footer">
            <button type="button" className="button unstyled" onClick={this.onDiscard}> Descartar </button>
            <button type="button" className="button primary" onClick={this.onSave}> Guardar </button>
          </div>
        )}
        <Animation>
          {showModal && (
            <Modal loading={loading}>
              <ModalHeader onClose={this.onCloseModal}>
                <h4 styleName="title-modal ">Guardar grabación</h4>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={this.onSubmit}>
                  <p className="label">Nombre del audio.</p>
                  <input disabled={loading} type="text" name="filename" required="required" onChange={this.onChangeName} />
                </form>
              </ModalBody>
              <ModalFooter>
                <div className="footer-modal">
                  <input type="button" className="button unstyled" value="Cancelar" onClick={this.onCloseModal} />
                  <input type="button" className="button primary" value="Confirmar" disabled={!filename.length || loading} onClick={this.onSubmit} />
                </div>
              </ModalFooter>
            </Modal>
          )}
        </Animation>
      </div>
    );
  }
}

export default App;
