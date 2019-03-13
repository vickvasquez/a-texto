import fs from 'fs-extra';
import path from 'path';
import uid from 'uid';

// import { formatError, allowedExtensions } from '../lib/utils';

export const files = async (ctx, next) => {
  const { method, url } = ctx.request;

  if (method !== 'POST' && url !== '/api/recordings') {
    return await next();
  }

  if (!ctx.request.files) {
    return await next();
  }

  const tmpdir = path.join(__dirname, '../assets');
  
  if (!fs.existsSync(tmpdir)) {
    await fs.mkdir(tmpdir);
  }

  const file = ctx.request.files.file || {};
  const ext = file.name && path.extname(file.name);
  /*if (file.name && allowedExtensions.includes(ext)) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      errors: formatError({ errors: { id:{ path: 'file', message: 'Formato de archivo incorrecto' } } }),
      message: 'Sucedió un error desconocido',
    };
    return
  }
*/
  const filePath = path.join(tmpdir, `${uid(50)}${ext}`);
  const reader = await fs.createReadStream(file.path);
  const writer = await fs.createWriteStream(filePath);
  await reader.pipe(writer);

  ctx.request.body.file = filePath;
  await next();
}