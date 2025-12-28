export const saveToken = (token) => {
  localStorage.setItem("MobileViewAdmin", token);
};

export const getToken = () => {
  return localStorage.getItem("MobileViewAdmin");
};

export const removeToken = () => {
  localStorage.removeItem("MobileViewAdmin");
};
