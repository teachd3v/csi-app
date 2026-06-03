const API_URL = import.meta.env.VITE_API_URL || "https://script.google.com/macros/s/AKfycbzNjNE41vUKBZQjAAUakOcEaO5dQ-ofmCIQNs9UK71W4Y7zDupmEj9Nks_W3KGf3jbKuA/exec";

/**
 * Helper to handle fetch with timeout/error handling
 */
async function request(options) {
  try {
    const response = await fetch(API_URL, {
      method: options.method || "GET",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    return { status: "error", message: error.message };
  }
}

export const api = {
  login: async (id, password) => {
    return request({
      method: "POST",
      body: JSON.stringify({ action: "login", id, password }),
    });
  },

  getInstruments: async (program) => {
    const url = `${API_URL}?action=getInstruments&program=${encodeURIComponent(program)}`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Fetch Instruments Error:", error);
      return { status: "error", message: error.message };
    }
  },

  getDashboardSummary: async () => {
    const url = `${API_URL}?action=getDashboardSummary`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Fetch Summary Error:", error);
      return { status: "error", message: error.message };
    }
  },

  getFullDashboardData: async (filters = {}) => {
    const query = Object.keys(filters)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(filters[k])}`)
      .join('&');
    const url = `${API_URL}?action=getFullDashboardData&${query}`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Fetch Full Dashboard Error:", error);
      return { status: "error", message: error.message };
    }
  },

  submitSurvey: async (payload) => {
    return request({
      method: "POST",
      body: JSON.stringify({ 
        action: "submitSurvey", 
        ...payload 
      }),
    });
  },
};
