export const formatError = ({ errors }) => {
  if (!errors) return {}
  let arrError = [];
  Object.keys(errors).forEach(error => {
    arrError = [...arrError, { path: errors[error].path, message: errors[error].message }];
  })
  return arrError;
}

export const allowedExtensions = ['.mp3', '.avi', '.json'];