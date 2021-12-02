export const isAdmin = (userInfo) => {
  if (userInfo && userInfo.role === 'admin') {
    return true;
  } else {
    return false;
  }
}

export const validateEmail = (user) => {
  const email = user.email;
  const re = /\S+@\S+\.\S+/;
  if (!email || (email && re.test(email))) {
    return true;
  } else {
    return false;
  }
}

export const isValidateName = (value) => {
  const re = /^[a-zA-Zа-яА-Я]+$/;
  if (!value || (value && re.test(value))) {
    return true;
  }
  return false
}

export const isValidNumber = (value) => {
  const re = /^[0-9]+$/;
  if (!value || (value && re.test(value))) {
    return true;
  }
  return false
}
