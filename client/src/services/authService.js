const API_URL = "http://localhost:3000/api/auth";

export const login = async (userData) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);

    // ✅ SAVE USER ID
    if (data.user) {
      localStorage.setItem("userId", data.user._id);
    }
  }

  return data;
};

export const register = async (userData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
};