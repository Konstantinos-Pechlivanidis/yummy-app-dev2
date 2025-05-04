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
  {
    "id": "resto004",
    "ownerId": "owner004",
    "name": "Κινέζικο Delights 4",
    "location": "Μαρούσι, Ελλάδα",
    "address": {
      "street": "Οδός E",
      "number": 95,
      "postalCode": "23101",
      "area": "Μαρούσι"
    },
    "coordinates": {
      "lat": 39.38394,
      "lng": 21.538466
    },
    "cuisine": "Κινέζικο",
    "rating": 4.8,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 20,
    "tables": [
      "table013",
      "table014",
      "table015"
    ],
    "menu": [
      "item013",
      "item014",
      "item015"
    ],
    "specialMenus": [
      "menu002"
    ],
    "photos": [
      "/images/mobile2.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 20
      }
    ],
    "coupons": [
      "coupon003"
    ],
    "contact": {
      "phone": "+30 210 6386777",
      "email": "info4@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/κινέζικοdelights4",
        "instagram": "https://instagram.com/κινέζικοdelights4"
      }
    },
    "createdAt": "2023-08-10T12:00:00Z",
    "updatedAt": "2023-10-09T12:00:00Z"
  },
  {
    "id": "resto005",
    "ownerId": "owner005",
    "name": "Γαλλικό Delights 5",
    "location": "Λάρισα Κέντρο, Ελλάδα",
    "address": {
      "street": "Οδός F",
      "number": 13,
      "postalCode": "21481",
      "area": "Λάρισα Κέντρο"
    },
    "coordinates": {
      "lat": 40.25205,
      "lng": 23.618029
    },
    "cuisine": "Γαλλικό",
    "rating": 4.8,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 29,
    "tables": [
      "table016",
      "table017",
      "table018"
    ],
    "menu": [
      "item016",
      "item017",
      "item018"
    ],
    "specialMenus": [
      "menu002"
    ],
    "photos": [
      "/images/mobile2.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 20
      }
    ],
    "coupons": [
      "coupon002"
    ],
    "contact": {
      "phone": "+30 210 7132948",
      "email": "info5@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/γαλλικόdelights5",
        "instagram": "https://instagram.com/γαλλικόdelights5"
      }
    },
    "createdAt": "2023-08-20T12:00:00Z",
    "updatedAt": "2023-10-19T12:00:00Z"
  },
  {
    "id": "resto006",
    "ownerId": "owner006",
    "name": "Ελληνικό Delights 6",
    "location": "Χανιά, Ελλάδα",
    "address": {
      "street": "Οδός G",
      "number": 82,
      "postalCode": "95247",
      "area": "Χανιά"
    },
    "coordinates": {
      "lat": 36.740625,
      "lng": 21.201931
    },
    "cuisine": "Ελληνικό",
    "rating": 4.4,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 27,
    "tables": [
      "table019",
      "table020",
      "table021"
    ],
    "menu": [
      "item019",
      "item020",
      "item021"
    ],
    "specialMenus": [
      "menu002"
    ],
    "photos": [
      "/images/mobile3.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 25
      }
    ],
    "coupons": [
      "coupon002"
    ],
    "contact": {
      "phone": "+30 210 9712851",
      "email": "info6@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/ελληνικόdelights6",
        "instagram": "https://instagram.com/ελληνικόdelights6"
      }
    },
    "createdAt": "2023-08-30T12:00:00Z",
    "updatedAt": "2023-10-29T12:00:00Z"
  },
  {
    "id": "resto007",
    "ownerId": "owner007",
    "name": "Ινδικό Delights 7",
    "location": "Ηράκλειο, Ελλάδα",
    "address": {
      "street": "Οδός H",
      "number": 33,
      "postalCode": "36177",
      "area": "Ηράκλειο"
    },
    "coordinates": {
      "lat": 39.919279,
      "lng": 23.99999
    },
    "cuisine": "Ινδικό",
    "rating": 4.2,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 28,
    "tables": [
      "table022",
      "table023",
      "table024"
    ],
    "menu": [
      "item022",
      "item023",
      "item024"
    ],
    "specialMenus": [
      "menu001"
    ],
    "photos": [
      "/images/mobile1.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 20
      }
    ],
    "coupons": [
      "coupon002"
    ],
    "contact": {
      "phone": "+30 210 4415804",
      "email": "info7@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/ινδικόdelights7",
        "instagram": "https://instagram.com/ινδικόdelights7"
      }
    },
    "createdAt": "2023-09-09T12:00:00Z",
    "updatedAt": "2023-11-08T12:00:00Z"
  },
  {
    "id": "resto008",
    "ownerId": "owner008",
    "name": "Θαλασσινά Delights 8",
    "location": "Ρόδος, Ελλάδα",
    "address": {
      "street": "Οδός I",
      "number": 19,
      "postalCode": "74960",
      "area": "Ρόδος"
    },
    "coordinates": {
      "lat": 37.852958,
      "lng": 25.005693
    },
    "cuisine": "Θαλασσινά",
    "rating": 4.5,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 30,
    "tables": [
      "table025",
      "table026",
      "table027"
    ],
    "menu": [
      "item025",
      "item026",
      "item027"
    ],
    "specialMenus": [
      "menu002"
    ],
    "photos": [
      "/images/mobile1.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 10
      }
    ],
    "coupons": [
      "coupon003"
    ],
    "contact": {
      "phone": "+30 210 8687298",
      "email": "info8@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/θαλασσινάdelights8",
        "instagram": "https://instagram.com/θαλασσινάdelights8"
      }
    },
    "createdAt": "2023-09-19T12:00:00Z",
    "updatedAt": "2023-11-18T12:00:00Z"
  },
  {
    "id": "resto009",
    "ownerId": "owner009",
    "name": "Ασιατικό Delights 9",
    "location": "Βόλος, Ελλάδα",
    "address": {
      "street": "Οδός J",
      "number": 8,
      "postalCode": "90376",
      "area": "Βόλος"
    },
    "coordinates": {
      "lat": 40.313008,
      "lng": 21.973344
    },
    "cuisine": "Ασιατικό",
    "rating": 4.6,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 30,
    "tables": [
      "table028",
      "table029",
      "table030"
    ],
    "menu": [
      "item028",
      "item029",
      "item030"
    ],
    "specialMenus": [
      "menu003"
    ],
    "photos": [
      "/images/mobile2.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 15
      }
    ],
    "coupons": [
      "coupon002"
    ],
    "contact": {
      "phone": "+30 210 6212994",
      "email": "info9@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/ασιατικόdelights9",
        "instagram": "https://instagram.com/ασιατικόdelights9"
      }
    },
    "createdAt": "2023-09-29T12:00:00Z",
    "updatedAt": "2023-11-28T12:00:00Z"
  },
  {
    "id": "resto010",
    "ownerId": "owner010",
    "name": "Μεσογειακό Delights 10",
    "location": "Γκάζι, Ελλάδα",
    "address": {
      "street": "Οδός K",
      "number": 83,
      "postalCode": "47103",
      "area": "Γκάζι"
    },
    "coordinates": {
      "lat": 38.360736,
      "lng": 22.633645
    },
    "cuisine": "Μεσογειακό",
    "rating": 4.5,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 30,
    "tables": [
      "table031",
      "table032",
      "table033"
    ],
    "menu": [
      "item031",
      "item032",
      "item033"
    ],
    "specialMenus": [
      "menu001"
    ],
    "photos": [
      "/images/mobile2.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 15
      }
    ],
    "coupons": [
      "coupon002"
    ],
    "contact": {
      "phone": "+30 210 6508631",
      "email": "info10@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/μεσογειακόdelights10",
        "instagram": "https://instagram.com/μεσογειακόdelights10"
      }
    },
    "createdAt": "2023-10-09T12:00:00Z",
    "updatedAt": "2023-12-08T12:00:00Z"
  },
  {
    "id": "resto011",
    "ownerId": "owner011",
    "name": "Μεξικάνικο Delights 11",
    "location": "Κολωνάκι, Ελλάδα",
    "address": {
      "street": "Οδός L",
      "number": 15,
      "postalCode": "98387",
      "area": "Κολωνάκι"
    },
    "coordinates": {
      "lat": 37.008022,
      "lng": 21.80542
    },
    "cuisine": "Μεξικάνικο",
    "rating": 4.5,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 29,
    "tables": [
      "table034",
      "table035",
      "table036"
    ],
    "menu": [
      "item034",
      "item035",
      "item036"
    ],
    "specialMenus": [
      "menu002"
    ],
    "photos": [
      "/images/mobile1.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 25
      }
    ],
    "coupons": [
      "coupon002"
    ],
    "contact": {
      "phone": "+30 210 3648695",
      "email": "info11@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/μεξικάνικοdelights11",
        "instagram": "https://instagram.com/μεξικάνικοdelights11"
      }
    },
    "createdAt": "2023-10-19T12:00:00Z",
    "updatedAt": "2023-12-18T12:00:00Z"
  },
  {
    "id": "resto012",
    "ownerId": "owner012",
    "name": "Vegan Delights 12",
    "location": "Ψυρρή, Ελλάδα",
    "address": {
      "street": "Οδός M",
      "number": 60,
      "postalCode": "95963",
      "area": "Ψυρρή"
    },
    "coordinates": {
      "lat": 35.858215,
      "lng": 23.8068
    },
    "cuisine": "Vegan",
    "rating": 4.8,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 14,
    "tables": [
      "table037",
      "table038",
      "table039"
    ],
    "menu": [
      "item037",
      "item038",
      "item039"
    ],
    "specialMenus": [
      "menu001"
    ],
    "photos": [
      "/images/mobile2.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 20
      }
    ],
    "coupons": [
      "coupon001"
    ],
    "contact": {
      "phone": "+30 210 4696711",
      "email": "info12@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/vegandelights12",
        "instagram": "https://instagram.com/vegandelights12"
      }
    },
    "createdAt": "2023-10-29T12:00:00Z",
    "updatedAt": "2023-12-28T12:00:00Z"
  },
  {
    "id": "resto013",
    "ownerId": "owner013",
    "name": "Καφέ & Γλυκά Delights 13",
    "location": "Νέα Σμύρνη, Ελλάδα",
    "address": {
      "street": "Οδός N",
      "number": 10,
      "postalCode": "61530",
      "area": "Νέα Σμύρνη"
    },
    "coordinates": {
      "lat": 39.910576,
      "lng": 22.108464
    },
    "cuisine": "Καφέ & Γλυκά",
    "rating": 4.5,
    "openingHours": {
      "open": "12:00",
      "close": "23:00"
    },
    "totalTables": 10,
    "tables": [
      "table040",
      "table041",
      "table042"
    ],
    "menu": [
      "item040",
      "item041",
      "item042"
    ],
    "specialMenus": [
      "menu001"
    ],
    "photos": [
      "/images/mobile2.jpg"
    ],
    "happyHours": [
      {
        "startTime": "16:00",
        "endTime": "18:00",
        "discountPercentage": 15
      }
    ],
    "coupons": [
      "coupon002"
    ],
    "contact": {
      "phone": "+30 210 6193452",
      "email": "info13@restaurant.gr",
      "socialMedia": {
        "facebook": "https://facebook.com/καφέ&γλυκάdelights13",
        "instagram": "https://instagram.com/καφέ&γλυκάdelights13"
      }
    },
    "createdAt": "2023-11-08T12:00:00Z",
    "updatedAt": "2024-01-07T12:00:00Z"
  }
];

export const testimonials = [
  {
    "id": "review001",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 7!"
  },
  {
    "id": "review002",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 4!"
  },
  {
    "id": "review003",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 15!"
  },
  {
    "id": "review004",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 11!"
  },
  {
    "id": "review005",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 7!"
  },
  {
    "id": "review006",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 7!"
  },
  {
    "id": "review007",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 14!"
  },
  {
    "id": "review008",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 4!"
  },
  {
    "id": "review009",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 13!"
  },
  {
    "id": "review010",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 15!"
  },
  {
    "id": "review011",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 8!"
  },
  {
    "id": "review012",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 13!"
  },
  {
    "id": "review013",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 13!"
  },
  {
    "id": "review014",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 12!"
  },
  {
    "id": "review015",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 8!"
  },
  {
    "id": "review016",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 4!"
  },
  {
    "id": "review017",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 14!"
  },
  {
    "id": "review018",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 13!"
  },
  {
    "id": "review019",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 8!"
  },
  {
    "id": "review020",
    "message": "Εξαιρετική εμπειρία στο εστιατόριο Restaurant 6!"
  }
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
    originalPrice: 30,
    discountedPrice: 15,
    discountPercentage: 50,
    photoUrl: "/images/mobile3.jpg",
    selectedItems: ["item001", "item002", "item003"],
    availableItems: menuItems.filter(item => item.restaurantId === "resto001"), // Όλα τα διαθέσιμα πιάτα του resto001
    selectedDate: "2025-03-31",
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
    selectedDate: "2025-03-31",
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

