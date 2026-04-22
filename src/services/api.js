// Mock API using localStorage for persistence

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getInitialData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultData;
};

// Mock Users
const INITIAL_USERS = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "123-456-7890",
    loyaltyPoints: 120,
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "987-654-3210",
    loyaltyPoints: 45,
  },
];

// Mock Bookings
const INITIAL_BOOKINGS = [
  {
    id: "101",
    userId: "1",
    userName: "Alice Smith",
    service: "Haircut",
    date: new Date().toISOString(),
    status: "Pending",
  },
  {
    id: "102",
    userId: "2",
    userName: "Bob Johnson",
    service: "Facial",
    date: new Date(Date.now() + 86400000).toISOString(),
    status: "Confirmed",
  },
];

// Mock Services
const INITIAL_SERVICES = [
  {
    id: "s1",
    name: "Bridal Makeup",
    duration: "120 mins",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "s2",
    name: "Hair Styling",
    duration: "60 mins",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop",
  },
];

// Mock Offers
const INITIAL_OFFERS = [
  {
    id: "o1",
    title: "Summer Special",
    description: "20% off on all facials",
    validTill: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
];

export const mockDb = {
  users: getInitialData("mock_users", INITIAL_USERS),
  bookings: getInitialData("mock_bookings", INITIAL_BOOKINGS),
  services: getInitialData("mock_services", INITIAL_SERVICES),
  offers: getInitialData("mock_offers", INITIAL_OFFERS),
};

const saveDb = () => {
  localStorage.setItem("mock_users", JSON.stringify(mockDb.users));
  localStorage.setItem("mock_bookings", JSON.stringify(mockDb.bookings));
  localStorage.setItem("mock_services", JSON.stringify(mockDb.services));
  localStorage.setItem("mock_offers", JSON.stringify(mockDb.offers));
};

// Users API
export const getUsers = async () => {
  await delay(400);
  return mockDb.users;
};

export const updateLoyaltyPoints = async (userId, points) => {
  await delay(300);
  const user = mockDb.users.find((u) => u.id === userId);
  if (user) {
    user.loyaltyPoints = points;
    saveDb();
    return user;
  }
  throw new Error("User not found");
};

// Bookings API
export const getBookings = async () => {
  await delay(400);
  return mockDb.bookings;
};

export const updateBookingStatus = async (bookingId, status) => {
  await delay(300);
  const booking = mockDb.bookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = status;
    saveDb();
    return booking;
  }
  throw new Error("Booking not found");
};

// Services API
export const getServices = async () => {
  await delay(300);
  return mockDb.services;
};

export const addService = async (service) => {
  await delay(300);
  const newService = { ...service, id: `s${Date.now()}` };
  mockDb.services.push(newService);
  saveDb();
  return newService;
};

export const updateService = async (id, updatedData) => {
  await delay(300);
  const index = mockDb.services.findIndex((s) => s.id === id);
  if (index !== -1) {
    mockDb.services[index] = { ...mockDb.services[index], ...updatedData };
    saveDb();
    return mockDb.services[index];
  }
  throw new Error("Service not found");
};

export const deleteService = async (id) => {
  await delay(300);
  mockDb.services = mockDb.services.filter((s) => s.id !== id);
  saveDb();
  return id;
};

// Offers API
export const getOffers = async () => {
  await delay(300);
  return mockDb.offers;
};

export const addOffer = async (offer) => {
  await delay(300);
  const newOffer = { ...offer, id: `o${Date.now()}` };
  mockDb.offers.push(newOffer);
  saveDb();
  return newOffer;
};

export const deleteOffer = async (id) => {
  await delay(300);
  mockDb.offers = mockDb.offers.filter((o) => o.id !== id);
  saveDb();
  return id;
};

// Dashboard Stats
export const getDashboardStats = async () => {
  await delay(400);
  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = mockDb.bookings.filter((b) =>
    b.date.startsWith(today),
  );

  return {
    totalUsers: mockDb.users.length,
    totalBookings: mockDb.bookings.length,
    todaysAppointmentsCount: todaysAppointments.length,
    avgLoyaltyPoints:
      Math.round(
        mockDb.users.reduce((acc, u) => acc + (u.loyaltyPoints || 0), 0) /
          mockDb.users.length,
      ) || 0,
  };
};
