const incstr = require('incstr');

const createUniqueIdGenerator = () => {
  const index = {};
  const generateNextId = incstr.idGenerator({
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789',
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = generateNextId();

    return index[name];
  };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath.split('/').slice(-5, -1).join('_');

  // avoid obfuscate css files specially for react-dates
  if (resourcePath.indexOf('.css') >= 0) return localName;

  if(process.env.NODE_ENV === 'development') {
    return `${componentName}_${localName}`
  }

  return `${uniqueIdGenerator(componentName)}_${uniqueIdGenerator(localName)}`;
};

module.exports = generateScopedName;
