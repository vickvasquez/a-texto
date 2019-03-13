import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Icon, Animation, Modal, ModalBody, ModalFooter } from '~components';
import api from '~api';

import './style.scss';

class Recordings extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    refetch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: [],
  }

  state = {
    showModalDelete: false,
    showEditModal: false,
    id: '',
    loading: false,
    prevName: '',
    name: '',
    isValid: false,
  }

  onCloseModal = () => {
    this.setState({ showModalDelete: false, showEditModal: false });
  }

  onDelete = (id) => {
    this.setState({ id, showModalDelete: true });
  }

  onEdit = (id, name) => {
    this.setState({ id, showEditModal: true, prevName: name, name });
  }

  onChangeName = ({ target: { value } }) => {
    const { prevName } = this.state;
    const isValid = value !== prevName && value !== '';
    this.setState({ name: value, isValid });
  }

  edit = async (evt) => {
    evt.preventDefault();
    const { refetch } = this.props;
    const { id, name } = this.state;
    try {
      await api.update(id, { name });
      await refetch();
      this.onCloseModal();
    } catch (error) {
      console.log(error);
    }
  }

  delete = async () => {
    const { refetch } = this.props;
    const { id } = this.state;
    try {
      await api.remove(id);
      await refetch();
      this.onCloseModal();
    } catch (error) {
      console.log(error);
    }
  }

  getColumns = () => [
    {
      label: 'Nombre',
      prop: 'name',
    },
    /*{
      label: 'Archivo',
      prop: 'file',
    },*/
    {
      label: 'Fecha de grabación',
      prop: 'created_at',
      template: ({ created_at }) => <div styleName="date">{moment(created_at).format('YYYY-MM-DD HH:MM:SS')}</div>
    },
    {
      label: 'Editar',
      template: ({ _id, name }) => (
        <div styleName="container-icon">
          <button styleName="button-action" onClick={() => { this.onEdit(_id, name); }} type="button"><Icon type="edit" /></button>
        </div>
      ),
    },
    {
      label: 'Eliminar',
      template: ({ _id }) => (
        <div styleName="container-icon">
          <button styleName="button-action" onClick={() => { this.onDelete(_id); }} type="button"><Icon type="trash" /></button>
        </div>
      ),
    },
  ];

  render() {
    const { data } = this.props;
    const { showModalDelete, showEditModal, loading, isValid, name } = this.state;
    const columns = this.getColumns();
    return (
      <div styleName="container-table">
        <h2 styleName="title">Tus grabaciones</h2>
        <table>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column._id}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row._id}>
                {columns.map(column => (
                  <td key={column._id}>{column.template && typeof column.template === 'function' ? column.template(row) : row[column.prop]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Animation>
          {showModalDelete && (
            <Modal>
              <ModalBody>
                <h4 className="title-modal">¿Seguro de eliminar este audio?</h4>
                <div styleName="button-actions">
                  <input type="button" className="button unstyled" value="Cancelar" onClick={this.onCloseModal} />
                  <input type="button" className="button primary" value="Confirmar" onClick={this.delete} />
                </div>
              </ModalBody>
            </Modal>
          )}
          {showEditModal && (
            <Modal>
              <ModalBody>
                <h4 className="title-modal ">Editar nombre</h4>
                <form onSubmit={this.edit}>
                  <p className="label">Nuevo nombre del audio.</p>
                  <input disabled={loading} type="text" value={name} name="filename" required="required" onChange={this.onChangeName} />
                </form>
              </ModalBody>
              <ModalFooter>
                <div className="footer-modal">
                  <input type="button" className="button unstyled" value="Cancelar" onClick={this.onCloseModal} />
                  <input type="button" className="button primary" value="Confirmar" disabled={!isValid || loading} onClick={this.edit} />
                </div>
              </ModalFooter>
            </Modal>
          )}
        </Animation>
      </div>
    );
  }
}

export default Recordings;
