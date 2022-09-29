import mask from './mask';

const filter = () => {
  /**
   * Vue filter definition
   * @param {string} value
   * @param {string} inputMask
   */
  return (value, inputMask) => {
    return mask(value, inputMask)
  };
}

export default filter();