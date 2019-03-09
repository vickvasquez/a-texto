export default ({ errors }) => {
  if (!errors) return {}
  let arrError = [];
  Object.keys(errors).forEach(error => {
    arrError = [...arrError, { path: errors[error].path, message: errors[error].message }];
  })
  return arrError;
}