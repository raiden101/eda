
const isObjectEmpty = (obj) => {
  if(Object.keys(obj).length) 
    return false;
  return true;
}

module.exports = {
  isObjectEmpty
}
