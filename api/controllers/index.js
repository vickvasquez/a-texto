import Records from '../models';

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
        message: error.message || 'Sorry, an error has occurred.'
      };
    }
  }
}

export default new RecordsController();