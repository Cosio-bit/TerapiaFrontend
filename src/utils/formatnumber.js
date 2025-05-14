// src/utils/formatnumber.js
export const formatnumber = (number) => {
    return new Intl.NumberFormat('es-CL').format(number);
  };
  