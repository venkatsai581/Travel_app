import {
  createContext,
  useContext,
  useState
} from "react";

const TravelContext =
  createContext(null);

const initialDestinations = [
  {
    id: 1,
    name: "Dubai",
    country: "United Arab Emirates",
    description:
      "Luxury shopping, desert adventures and modern attractions.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
    status: "Active"
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    description:
      "Beautiful beaches, temples and relaxing island experiences.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    status: "Active"
  },
  {
    id: 3,
    name: "Paris",
    country: "France",
    description:
      "Iconic landmarks, art, culture and fine dining.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
    status: "Active"
  },
  {
    id: 4,
    name: "Maldives",
    country: "Maldives",
    description:
      "Tropical beaches, luxury resorts and island experiences.",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
    status: "Active"
  },
  {
    id: 5,
    name: "Singapore",
    country: "Singapore",
    description:
      "Modern attractions, shopping and family experiences.",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85",
    status: "Active"
  },
  {
    id: 6,
    name: "Switzerland",
    country: "Switzerland",
    description:
      "Mountain scenery, lakes and scenic train journeys.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    status: "Active"
  }
];

const initialTrips = [
  {
    id: 1,
    name: "Dubai Luxury Escape",
    destination: "Dubai",
    startDate: "2026-10-15",
    endDate: "2026-10-20",
    price: 75000,
    seats: 20,
    status: "Active"
  },
  {
    id: 2,
    name: "Bali Adventure",
    destination: "Bali",
    startDate: "2026-10-22",
    endDate: "2026-10-28",
    price: 62000,
    seats: 18,
    status: "Active"
  },
  {
    id: 3,
    name: "Paris Explorer",
    destination: "Paris",
    startDate: "2026-09-10",
    endDate: "2026-09-18",
    price: 92000,
    seats: 15,
    status: "Completed"
  },
  {
    id: 4,
    name: "Maldives Beach Holiday",
    destination: "Maldives",
    startDate: "2026-11-05",
    endDate: "2026-11-10",
    price: 85000,
    seats: 12,
    status: "Upcoming"
  },
  {
    id: 5,
    name: "Singapore City Tour",
    destination: "Singapore",
    startDate: "2026-11-15",
    endDate: "2026-11-20",
    price: 68000,
    seats: 20,
    status: "Upcoming"
  },
  {
    id: 6,
    name: "Swiss Alps Experience",
    destination: "Switzerland",
    startDate: "2026-12-02",
    endDate: "2026-12-08",
    price: 110000,
    seats: 10,
    status: "Upcoming"
  }
];

const initialCustomers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    city: "Hyderabad",
    status: "Active"
  },
  {
    id: 2,
    name: "Priya Reddy",
    email: "priya@example.com",
    phone: "+91 9876543211",
    city: "Bengaluru",
    status: "Active"
  },
  {
    id: 3,
    name: "Arjun Kumar",
    email: "arjun@example.com",
    phone: "+91 9876543212",
    city: "Chennai",
    status: "Active"
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@example.com",
    phone: "+91 9876543213",
    city: "Mumbai",
    status: "Active"
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 9876543214",
    city: "Delhi",
    status: "Active"
  },
  {
    id: 6,
    name: "Ananya Rao",
    email: "ananya@example.com",
    phone: "+91 9876543215",
    city: "Hyderabad",
    status: "Active"
  }
];

const initialBookings = [
  {
    id: 1,
    bookingId: "BK-1001",
    customer: "Rahul Sharma",
    trip: "Dubai Luxury Escape",
    destination: "Dubai",
    bookingDate: "2026-10-02",
    travelDate: "2026-10-15",
    travelers: 2,
    amount: 150000,
    bookingStatus: "Confirmed",
    paymentStatus: "Paid"
  },
  {
    id: 2,
    bookingId: "BK-1002",
    customer: "Priya Reddy",
    trip: "Bali Adventure",
    destination: "Bali",
    bookingDate: "2026-10-03",
    travelDate: "2026-10-22",
    travelers: 3,
    amount: 186000,
    bookingStatus: "Confirmed",
    paymentStatus: "Paid"
  },
  {
    id: 3,
    bookingId: "BK-1003",
    customer: "Arjun Kumar",
    trip: "Paris Explorer",
    destination: "Paris",
    bookingDate: "2026-09-01",
    travelDate: "2026-09-10",
    travelers: 2,
    amount: 184000,
    bookingStatus: "Completed",
    paymentStatus: "Paid"
  },
  {
    id: 4,
    bookingId: "BK-1004",
    customer: "Sneha Patel",
    trip: "Maldives Beach Holiday",
    destination: "Maldives",
    bookingDate: "2026-10-05",
    travelDate: "2026-11-05",
    travelers: 2,
    amount: 170000,
    bookingStatus: "Pending",
    paymentStatus: "Pending"
  },
  {
    id: 5,
    bookingId: "BK-1005",
    customer: "Vikram Singh",
    trip: "Singapore City Tour",
    destination: "Singapore",
    bookingDate: "2026-10-01",
    travelDate: "2026-11-15",
    travelers: 4,
    amount: 272000,
    bookingStatus: "Confirmed",
    paymentStatus: "Partial"
  }
];

const initialPayments = [
  {
    id: 1,
    transactionId: "TXN-5001",
    bookingId: "BK-1001",
    customer: "Rahul Sharma",
    trip: "Dubai Luxury Escape",
    paymentDate: "2026-10-02",
    amount: 150000,
    method: "Credit Card",
    status: "Paid",
    reference: "CC-458921"
  },
  {
    id: 2,
    transactionId: "TXN-5002",
    bookingId: "BK-1002",
    customer: "Priya Reddy",
    trip: "Bali Adventure",
    paymentDate: "2026-10-03",
    amount: 186000,
    method: "UPI",
    status: "Paid",
    reference: "UPI-785421"
  },
  {
    id: 3,
    transactionId: "TXN-5003",
    bookingId: "BK-1003",
    customer: "Arjun Kumar",
    trip: "Paris Explorer",
    paymentDate: "2026-09-05",
    amount: 184000,
    method: "Net Banking",
    status: "Paid",
    reference: "NB-632145"
  },
  {
    id: 4,
    transactionId: "TXN-5004",
    bookingId: "BK-1004",
    customer: "Sneha Patel",
    trip: "Maldives Beach Holiday",
    paymentDate: "2026-10-05",
    amount: 85000,
    method: "Debit Card",
    status: "Pending",
    reference: "DC-125874"
  }
];

export function TravelProvider({
  children
}) {
  const [
    destinations,
    setDestinations
  ] = useState(initialDestinations);

  const [
    trips,
    setTrips
  ] = useState(initialTrips);

  const [
    customers,
    setCustomers
  ] = useState(initialCustomers);

  const [
    bookings,
    setBookings
  ] = useState(initialBookings);

  const [
    payments,
    setPayments
  ] = useState(initialPayments);

  const addDestination = (data) => {
    setDestinations((current) => [
      ...current,
      {
        ...data,
        id: Date.now()
      }
    ]);
  };

  const updateDestination = (
    id,
    data
  ) => {
    setDestinations((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data
            }
          : item
      )
    );
  };

  const deleteDestination = (id) => {
    setDestinations((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  const addTrip = (data) => {
    setTrips((current) => [
      ...current,
      {
        ...data,
        id: Date.now()
      }
    ]);
  };

  const updateTrip = (
    id,
    data
  ) => {
    setTrips((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data
            }
          : item
      )
    );
  };

  const deleteTrip = (id) => {
    setTrips((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  const addCustomer = (data) => {
    setCustomers((current) => [
      ...current,
      {
        ...data,
        id: Date.now()
      }
    ]);
  };

  const updateCustomer = (
    id,
    data
  ) => {
    setCustomers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data
            }
          : item
      )
    );
  };

  const deleteCustomer = (id) => {
    setCustomers((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  const addBooking = (data) => {
    setBookings((current) => [
      ...current,
      {
        ...data,
        id: Date.now(),
        bookingId: `BK-${
          Date.now()
            .toString()
            .slice(-6)
        }`
      }
    ]);
  };

  const updateBooking = (
    id,
    data
  ) => {
    setBookings((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data
            }
          : item
      )
    );
  };

  const deleteBooking = (id) => {
    setBookings((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  const addPayment = (data) => {
    setPayments((current) => [
      ...current,
      {
        ...data,
        id: Date.now(),
        transactionId: `TXN-${
          Date.now()
            .toString()
            .slice(-6)
        }`
      }
    ]);
  };

  const updatePayment = (
    id,
    data
  ) => {
    setPayments((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data
            }
          : item
      )
    );
  };

  const deletePayment = (id) => {
    setPayments((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <TravelContext.Provider
      value={{
        destinations,
        trips,
        customers,
        bookings,
        payments,

        addDestination,
        updateDestination,
        deleteDestination,

        addTrip,
        updateTrip,
        deleteTrip,

        addCustomer,
        updateCustomer,
        deleteCustomer,

        addBooking,
        updateBooking,
        deleteBooking,

        addPayment,
        updatePayment,
        deletePayment
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const context =
    useContext(TravelContext);

  if (!context) {
    throw new Error(
      "useTravel must be used inside TravelProvider"
    );
  }

  return context;
}