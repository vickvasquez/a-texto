import Records from '../models';

import formatError from '../lib/formatErrors';
class RecordsController {
  async add(ctx) {
    try {
      const record = await Records.add(ctx.request.body);

      ctx.body = {
        status: 'success',
        message: 'Se guardó correctamente',
        data: record
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        errors: formatError(error),
        message: 'Sorry, an error has occurred.'
      };
    }
  }

  async update(ctx) {
    try {
      const { id = '' } = ctx.params || {};
      if (!id.match(/^[0-9a-fA-F]{24}$/))  { 
        throw { errors: { id:{ path: 'id', message: 'Parametro inválido' } } };
      }
      
      const record = await Records.findById( { _id: id });
      
      if(record) {
        record.set(ctx.request.body);
        const data = await record.save();
        ctx.body = {
          status: 'success',
          message: 'Se actualizó correctamente',
          data
        };

        return;
      }

      throw {errors: { id:{ path: 'id', message: 'Grabación no existente' } } };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        errors: formatError(error),
        message: 'Sorry, an error has occurred.'
      };
    }
  }
}

export default new RecordsController();