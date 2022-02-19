export const isAdmin = (userInfo) => {
  return !!(userInfo && userInfo.role === 'admin');
};

export const validateEmail = (value) => {
  const re = /\S+@\S+\.\S+/;
  if (!value) return true;
  return !!(value && re.test(value));
};

export const isValidateName = (value) => {
  const re = /^[a-zA-Zа-яА-Я]+$/;
  if (!value) return true;
  return !!(value && re.test(value));
};

export const isValidNumber = (value) => {
  const re = /^[0-9]+$/;
  if (!value) return true;
  return !!(value && re.test(value));
};

export const passwordMatch = (value, valueTwo) => {
  if (!valueTwo) return true;
  return !!(value && value.length > 5 && value === valueTwo);
};
