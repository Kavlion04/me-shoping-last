
import { toast } from "../hooks/use-toast";
const API_URL = "https://nt-shopping-list.onrender.com/api";
// const handleResponse = async (response) => {
//   const contentType = response.headers.get('content-type');
//   if (contentType && contentType.includes('text/html')) {
//     console.error("Received HTML response instead of JSON");
//     const error = 'Server returned HTML instead of JSON';
//     toast.error(error);
//     throw new Error(error);
//   }

//   if (!response.ok) {
//     try {
//       const data = await response.json();
//       const error = data.message || response.statusText;
//       toast.error(error);
//       throw new Error(error);
//     } catch (jsonError) {
//       const error = response.statusText || 'API request failed';
//       toast.error(error);
//       throw new Error(error);
//     }
//   }
  
//   try {
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("JSON parse error:", error);
//     toast.error("Error parsing server response");
//     throw new Error("Failed to parse server response");
//   }
// };

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    console.error("Received HTML response instead of JSON");
    toast.error("Server returned HTML instead of JSON"); // 🛠 To'g'ri ishlashi uchun tekshirish kerak
    throw new Error("Server returned HTML instead of JSON");
  }

  if (!response.ok) {
    try {
      const data = await response.json();
      const error = data.message || response.statusText;
      toast.error(error); // 🛠 Bu yerda toast ishlashini tekshiring
      throw new Error(error);
    } catch (jsonError) {
      const error = response.statusText || "API request failed";
      toast.error(error); // 🛠 Shu joyda ham toast to'g'ri ishlayotganini tekshiring
      throw new Error(error);
    }
  }

  try {
    return await response.json();
  } catch (error) {
    console.error("JSON parse error:", error);
    toast.error("Error parsing server response"); // 🛠 Toast to'g'ri ishlashini tekshiring
    throw new Error("Failed to parse server response");
  }
};

export const api = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  register: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },
  
  getMe: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  },
  
  // Group endpoints
  getMyGroups: async (token) => {
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Get groups error:", error);
      throw error;
    }
  },
  
  createGroup: async (token, name, password = "") => {
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ name, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Create group error:", error);
      throw error;
    }
  },
  
  getGroup: async (token, groupId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error("Received HTML response instead of JSON for group details");
        toast.error("Failed to load group details");
        throw new Error("Server returned HTML instead of JSON");
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to load group";
        
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use the text directly
          if (errorText && !errorText.includes("<!DOCTYPE html>")) {
            errorMessage = errorText;
          }
        }
        
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error) {
      console.error("Get group error:", error);
      throw error;
    }
  },
  
  deleteGroup: async (token, groupId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Delete group error:", error);
      throw error;
    }
  },
  
  // Group members
  addMember: async (token, groupId, memberId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ memberId }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Add member error:", error);
      throw error;
    }
  },
  
  removeMember: async (token, groupId, memberId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Remove member error:", error);
      throw error;
    }
  },
  
  joinGroup: async (token, groupId, password = "") => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Join group error:", error);
      throw error;
    }
  },
  
  leaveGroup: async (token, groupId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Leave group error:", error);
      throw error;
    }
  },
  
  // Items
  getGroupItems: async (token, groupId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Get items error:", error);
      throw error;
    }
  },
  
  createItem: async (token, groupId, title) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ title }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Create item error:", error);
      throw error;
    }
  },
  
  deleteItem: async (token, groupId, itemId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Delete item error:", error);
      throw error;
    }
  },
  
  // Search
  searchUsers: async (token, query) => {
    try {
      const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Search users error:", error);
      throw error;
    }
  },
  
  searchGroups: async (token, query) => {
    try {
      const response = await fetch(`${API_URL}/groups/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Search groups error:", error);
      throw error;
    }
  }
};

export default api;
