import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '~components';

import api from '~api';

import './style.scss';

class Recordings extends Component {
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.string).isRequired,
  }

  onDelete = async (id) => {
    await api.remove(id);
  }

  onEdit = (id) => {
    console.log(id)
  }

  getColumns = () => [
    {
      label: 'Nombre',
      prop: 'name',
    },
    {
      label: 'Archivo',
      prop: 'file',
    },
    {
      label: 'Fecha de grabación',
      prop: 'created_at',
    },
    {
      label: 'Editar',
      template: ({ _id }) => (<button styleName="button-action" onClick={() => { this.onEdit(_id); }} type="button"><Icon type="edit" /></button>),
    },
    {
      label: 'Eliminar',
      template: ({ _id }) => (<button styleName="button-action" onClick={() => { this.onDelete(_id); }} type="button"><Icon type="trash" /></button>),
    },
  ];

  render() {
    const { data } = this.props;
    const columns = this.getColumns();
    return (
      <div styleName="container-table">
        <table>
          <tr>
            {columns.map(column => (
              <th>{column.label}</th>
            ))}
          </tr>
          {data.map(row => (
            <tr>
              {columns.map(column => (
                <td>{column.template && typeof column.template === 'function' ? column.template(row) : row[column.prop]}</td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    );
  }
}

export default Recordings;
