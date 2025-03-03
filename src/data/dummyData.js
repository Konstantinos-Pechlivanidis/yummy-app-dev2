export const users = [
  {
    id: "user001",
    name: "Γιάννης Παπαδόπουλος",
    email: "giannis@example.com",
    password: "hashedpassword",
    role: "customer",
    phone: "6987654321",
    loyaltyPoints: 120,
    favoriteRestaurants: ["resto001", "resto002"],
    preferredMenus: ["menu001"],
    profileImage: "/images/mobile1.jpg",
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-02-01T12:00:00Z",
  },
  {
    id: "owner001",
    name: "Νίκος Καραγιάννης",
    email: "nikos@example.com",
    password: "hashedpassword",
    role: "owner",
    phone: "6971234567",
    profileImage: "/images/mobile1.jpg",
    createdAt: "2023-12-15T12:00:00Z",
    updatedAt: "2024-02-01T12:00:00Z",
  },
];

export const restaurants = [
  {
    id: "resto001",
    ownerId: "owner001",
    name: "La Pasteria",
    location: "Αθήνα, Ελλάδα",
    address: {
      street: "Ερμού 22",
      number: 10,
      postalCode: "10563",
      area: "Σύνταγμα",
    },
    coordinates: { lat: 37.9838, lng: 23.7275 },
    cuisine: "Ιταλικό",
    rating: 4.7,
    openingHours: { open: "10:00", close: "23:00" },
    totalTables: 20,
    tables: ["table001", "table002", "table003", "table004"],
    menu: ["item001", "item002", "item003"],
    specialMenus: ["menu001"],
    photos: ["/images/mobile1.jpg"],
    happyHours: [],
    coupons: ["coupon001"],
    contact: {
      phone: "+30 210 1234567",
      email: "contact@lapasteria.gr",
      socialMedia: {
        facebook: "https://facebook.com/lapasteria",
        instagram: "https://instagram.com/lapasteria",
      },
    },
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2024-02-01T12:00:00Z",
  },
  {
    id: "resto002",
    ownerId: "owner002",
    name: "Sushi Bar",
    location: "Θεσσαλονίκη, Ελλάδα",
    address: {
      street: "Τσιμισκή 45",
      number: 45,
      postalCode: "54624",
      area: "Θεσσαλονίκη Κέντρο",
    },
    coordinates: { lat: 40.6401, lng: 22.9444 },
    cuisine: "Ιαπωνικό",
    rating: 4.5,
    openingHours: { open: "12:00", close: "22:00" },
    totalTables: 15,
    tables: ["table005", "table006", "table007"],
    menu: ["item004", "item005", "item006"],
    specialMenus: ["menu002"],
    photos: ["/images/mobile2.jpg"],
    happyHours: [{ startTime: "17:00", endTime: "19:00", discountPercentage: 20 }],
    coupons: ["coupon002"],
    contact: {
      phone: "+30 2310 654321",
      email: "info@sushibar.gr",
      socialMedia: {
        facebook: "https://facebook.com/sushibar",
        instagram: "https://instagram.com/sushibar",
      },
    },
    createdAt: "2023-11-15T12:00:00Z",
    updatedAt: "2024-02-10T12:00:00Z",
  },
  {
    id: "resto003",
    ownerId: "owner003",
    name: "Steakhouse Grill",
    location: "Πάτρα, Ελλάδα",
    address: {
      street: "Ρήγα Φεραίου 88",
      number: 88,
      postalCode: "26221",
      area: "Κέντρο Πάτρας",
    },
    coordinates: { lat: 38.2466, lng: 21.7346 },
    cuisine: "Αμερικάνικο BBQ",
    rating: 4.8,
    openingHours: { open: "13:00", close: "01:00" },
    totalTables: 25,
    tables: ["table008", "table009", "table010"],
    menu: ["item007", "item008", "item009"],
    specialMenus: ["menu002"],
    photos: ["/images/mobile2.jpg"],
    happyHours: [{ startTime: "18:00", endTime: "20:00", discountPercentage: 30 }],
    coupons: ["coupon002"],
    contact: {
      phone: "+30 2610 987654",
      email: "info@steakhouse.gr",
      socialMedia: {
        facebook: "https://facebook.com/steakhousegrill",
        instagram: "https://instagram.com/steakhousegrill",
      },
    },
    createdAt: "2023-08-05T12:00:00Z",
    updatedAt: "2024-02-15T12:00:00Z",
  },
];



export const menuItems = [
  { id: "item001", restaurantId: "resto001", name: "Bruschetta", price: 5.0, category: "Ορεκτικά", discount: 0, photoUrl: "/images/mobile1.jpg" },
  { id: "item002", restaurantId: "resto001", name: "Pasta Carbonara", price: 9.5, category: "Κυρίως", discount: 10, photoUrl: "/images/mobile1.jpg" },
  { id: "item003", restaurantId: "resto001", name: "Tiramisu", price: 6.0, category: "Επιδόρπια", discount: 0, photoUrl: "/images/mobile1.jpg" },
  { id: "item004", restaurantId: "resto002", name: "Salmon Sushi", price: 12.0, category: "Κυρίως", discount: 5, photoUrl: "/images/mobile1.jpg" },
  { id: "item005", restaurantId: "resto002", name: "Miso Soup", price: 4.0, category: "Ορεκτικά", discount: 0, photoUrl: "/images/mobile1.jpg" },
];

export const reservations = [
  {
    id: "reservation001",
    userId: "user001",
    restaurantId: "resto001",
    date: "2024-03-01",
    time: "14:30",
    guestCount: 2,
    status: "approved", // Επιβεβαιωμένη κράτηση
    specialMenuId: "menu001",
    couponId: null,
  },
  {
    id: "reservation002",
    userId: "user001",
    restaurantId: "resto002",
    date: "2024-03-02",
    time: "19:00",
    guestCount: 4,
    status: "pending", // Αναμονή για επιβεβαίωση
    specialMenuId: null,
    couponId: "coupon001",
  },
  {
    id: "reservation003",
    userId: "user001",
    restaurantId: "resto003",
    date: "2024-02-28",
    time: "20:00",
    guestCount: 3,
    status: "completed", // Ολοκληρωμένη κράτηση
    specialMenuId: null,
    couponId: null,
  },
  {
    id: "reservation004",
    userId: "user001",
    restaurantId: "resto004",
    date: "2024-02-25",
    time: "18:00",
    guestCount: 2,
    status: "cancelled", // Ακυρωμένη κράτηση
    specialMenuId: "menu002",
    couponId: null,
  },
];

export const payments = [
  {
    id: "payment001",
    userId: "user001",
    reservationId: "reservation001",
    amount: 30,
    paymentMethod: "card",
    status: "completed",
  },
  {
    id: "payment002",
    userId: "user002",
    reservationId: "reservation002",
    amount: 48,
    paymentMethod: "paypal",
    status: "pending",
  },
];

export const specialMenus = [
  {
    id: "menu001",
    restaurantId: "resto001",
    name: "Πλήρες Γεύμα - Ιταλικό",
    description: "Ορεκτικό, κυρίως πιάτο και επιδόρπιο",
    originalPrice: 40,
    discountedPrice: 30,
    discountPercentage: 25,
    photoUrl: "/images/mobile3.jpg",
    selectedItems: ["item001", "item002", "item003"],
    availableItems: menuItems.filter(item => item.restaurantId === "resto001"), // Όλα τα διαθέσιμα πιάτα του resto001
    timeRange: { start: "12:00", end: "16:00" },
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "menu002",
    restaurantId: "resto002",
    name: "Sushi Combo",
    description: "10 κομμάτια sushi + σούπα miso",
    originalPrice: 25,
    discountedPrice: 20,
    discountPercentage: 20,
    photoUrl: "/images/mobile3.jpg",
    selectedItems: ["item004", "item005"],
    availableItems: menuItems.filter(item => item.restaurantId === "resto002"), // Όλα τα διαθέσιμα πιάτα του resto002
    timeRange: { start: "18:00", end: "22:00" },
    createdAt: "2024-03-01T00:00:00Z",
  }
];


export const coupons = [
  {
    id: "coupon001",
    restaurantId: "resto001",
    description: "Έκπτωση 10% στο σύνολο του λογαριασμού",
    discountPercentage: 10,
  },
  {
    id: "coupon002",
    restaurantId: "resto002",
    description: "Δωρεάν ορεκτικό με κάθε κράτηση",
    discountPercentage: 100,
  }
];

