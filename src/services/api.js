import { API_BASE_URL } from "../config";

const getAuthHeaders = () => {
  const userStr = localStorage.getItem("admin_user");
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };
  }
  return { "Content-Type": "application/json" };
};

// Users API
export const getUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/clients`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch users");
  return data.data || [];
};

export const updateLoyaltyPoints = async (clientId, points) => {
  const res = await fetch(`${API_BASE_URL}/clients/${clientId}/loyalty`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ points: parseInt(points) || 0 }),
  });
  if (!res.ok) throw new Error("Failed to update points");
  return res.json();
};

export const getLoyaltySettings = async () => {
  const res = await fetch(`${API_BASE_URL}/loyalty-settings`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to fetch loyalty settings");
  return data.data;
};

export const updateLoyaltySettings = async (settings) => {
  const res = await fetch(`${API_BASE_URL}/loyalty-settings`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to update loyalty settings");
  return data.data;
};

// Bookings API
export const getBookings = async () => {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");
  return data.data || [];
};

export const updateBookingStatus = async (bookingId, status) => {
  const res = await fetch(`${API_BASE_URL}/appointments/${bookingId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update status");
  return data.data;
};

export const rescheduleAppointment = async (bookingId, date, time) => {
  const res = await fetch(
    `${API_BASE_URL}/appointments/${bookingId}/reschedule`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, time }),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reschedule");
  return data.data;
};

// Services API
export const getServices = async () => {
  const res = await fetch(`${API_BASE_URL}/services`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch services");
  return data.data || [];
};

export const addService = async (service) => {
  const res = await fetch(`${API_BASE_URL}/services`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(service),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add service");
  // Return structure as new service for frontend hooks to immediately push state
  return { id: data.data.id, ...service };
};

export const updateService = async (id, updatedData) => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update service");
  return data.data;
};

export const deleteService = async (id) => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete service");
  return id;
};

// Offers API
export const getOffers = async () => {
  const res = await fetch(`${API_BASE_URL}/offers`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch offers");
  return data.data || [];
};

export const addOffer = async (offer) => {
  const res = await fetch(`${API_BASE_URL}/offers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(offer),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add offer");
  return { id: data.data.id, ...offer };
};

export const deleteOffer = async (id) => {
  const res = await fetch(`${API_BASE_URL}/offers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete offer");
  return id;
};

// Dashboard Stats
export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE_URL}/stats`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
  return data.data;
};

// Reviews API
export const getReviews = async () => {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch reviews");
  return data.data || [];
};

export const approveReview = async (id, isApproved) => {
  const res = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ isApproved }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to update review status");
  return data.success;
};

export const deleteReview = async (id) => {
  const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete review");
  return id;
};
