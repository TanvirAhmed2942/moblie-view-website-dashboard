export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("MobileViewAdmin", token);
    document.cookie = `MobileViewAdmin=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("MobileViewAdmin");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("MobileViewAdmin");
    document.cookie = "MobileViewAdmin=; path=/; max-age=0";
  }
};
