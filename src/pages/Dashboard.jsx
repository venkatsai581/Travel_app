import {
  useMemo
} from "react";

import {
  CalendarCheck,
  Users,
  Map,
  IndianRupee,
  Plane,
  ArrowUpRight
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  useTravel
} from "../context/TravelContext.jsx";

import StatCard from "../components/common/StatCard.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

function Dashboard() {
  const {
    destinations,
    trips,
    customers,
    bookings
  } = useTravel();

  /* =====================================
     DASHBOARD STATISTICS
  ===================================== */

  const statistics = useMemo(() => {
    const totalRevenue =
      bookings.reduce(
        (total, booking) =>
          total + Number(booking.amount || 0),
        0
      );

    const confirmedBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "Confirmed"
      ).length;

    const pendingBookings =
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "Pending"
      ).length;

    return {
      totalBookings:
        bookings.length,

      totalRevenue,

      totalCustomers:
        customers.length,

      totalDestinations:
        destinations.length,

      confirmedBookings,

      pendingBookings
    };
  }, [
    bookings,
    customers,
    destinations
  ]);

  /* =====================================
     REVENUE CHART DATA
  ===================================== */

  const revenueData = useMemo(() => {
    const groupedData = {};

    bookings.forEach(
      (booking) => {
        const date =
          booking.bookingDate || "";

        const month =
          date.slice(0, 7);

        if (!month) {
          return;
        }

        if (!groupedData[month]) {
          groupedData[month] = 0;
        }

        groupedData[month] +=
          Number(
            booking.amount || 0
          );
      }
    );

    return Object.entries(
      groupedData
    )
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(
        ([month, revenue]) => ({
          month: formatMonth(month),
          revenue
        })
      );
  }, [bookings]);

  /* =====================================
     BOOKING STATUS DATA
  ===================================== */

  const bookingStatusData =
    useMemo(() => {
      const statuses = [
        "Confirmed",
        "Pending",
        "Completed",
        "Cancelled"
      ];

      return statuses
        .map((status) => ({
          name: status,

          value:
            bookings.filter(
              (booking) =>
                booking.bookingStatus ===
                status
            ).length
        }))
        .filter(
          (item) =>
            item.value > 0
        );
    }, [bookings]);

  /* =====================================
     UPCOMING TRIPS
  ===================================== */

  const upcomingTrips =
    useMemo(() => {
      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      return [...trips]
        .filter(
          (trip) =>
            trip.startDate >=
            today &&
            trip.status !==
              "Completed"
        )
        .sort(
          (a, b) =>
            a.startDate.localeCompare(
              b.startDate
            )
        )
        .slice(0, 5);
    }, [trips]);

  /* =====================================
     RECENT BOOKINGS
  ===================================== */

  const recentBookings =
    useMemo(() => {
      return [...bookings]
        .sort(
          (a, b) =>
            b.bookingDate.localeCompare(
              a.bookingDate
            )
        )
        .slice(0, 5);
    }, [bookings]);

  return (
    <div className="page dashboard-page">
      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="page-header dashboard-header">
        <div>
          <h2>
            Welcome back, Travel Admin
          </h2>

          <p>
            Here's what's happening
            with your travel business.
          </p>
        </div>

        <div className="dashboard-date">
          {formatFullDate(
            new Date()
          )}
        </div>
      </div>

      {/* =================================
          STATISTICS
      ================================= */}

      <section className="dashboard-stats">
        <StatCard
          title="Total Bookings"
          value={
            statistics.totalBookings
          }
          description={`${statistics.confirmedBookings} confirmed bookings`}
          trend="+12.5%"
          trendType="positive"
          icon={
            <CalendarCheck
              size={21}
            />
          }
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            statistics.totalRevenue
          )}
          description="Across all bookings"
          trend="+18.2%"
          trendType="positive"
          icon={
            <IndianRupee
              size={21}
            />
          }
        />

        <StatCard
          title="Customers"
          value={
            statistics.totalCustomers
          }
          description="Registered travelers"
          trend="+8.4%"
          trendType="positive"
          icon={
            <Users size={21} />
          }
        />

        <StatCard
          title="Destinations"
          value={
            statistics.totalDestinations
          }
          description="Available destinations"
          trend="+5.1%"
          trendType="positive"
          icon={
            <Map size={21} />
          }
        />
      </section>

      {/* =================================
          CHARTS
      ================================= */}

      <section className="dashboard-charts">
        <div className="dashboard-card revenue-card">
          <div className="dashboard-card-header">
            <div>
              <h3>
                Revenue Overview
              </h3>

              <p>
                Revenue generated from
                bookings.
              </p>
            </div>

            <div className="chart-icon">
              <ArrowUpRight
                size={18}
              />
            </div>
          </div>

          <div className="chart-container">
            {revenueData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={revenueData}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={
                          0.25
                        }
                      />

                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity={
                          0
                        }
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#edf0f4"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#8993a3"
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#8993a3"
                    }}
                    tickFormatter={(value) =>
                      formatShortCurrency(
                        value
                      )
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(
                        value
                      )
                    }
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No revenue data"
                message="Revenue information will appear here once bookings are available."
              />
            )}
          </div>
        </div>

        <div className="dashboard-card status-card">
          <div className="dashboard-card-header">
            <div>
              <h3>
                Booking Status
              </h3>

              <p>
                Current booking distribution.
              </p>
            </div>
          </div>

          <div className="status-chart-container">
            {bookingStatusData.length >
            0 ? (
              <>
                <ResponsiveContainer
                  width="100%"
                  height={210}
                >
                  <PieChart>
                    <Pie
                      data={
                        bookingStatusData
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={4}
                    >
                      {bookingStatusData.map(
                        (entry, index) => (
                          <Cell
                            key={`${entry.name}-${index}`}
                            fill={
                              getStatusColor(
                                entry.name
                              )
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="chart-legend">
                  {bookingStatusData.map(
                    (item) => (
                      <div
                        className="legend-item"
                        key={item.name}
                      >
                        <span
                          className="legend-dot"
                          style={{
                            background:
                              getStatusColor(
                                item.name
                              )
                          }}
                        />

                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.value}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </>
            ) : (
              <EmptyState
                title="No bookings"
                message="Booking status information will appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* =================================
          UPCOMING TRIPS
      ================================= */}

      <section className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h3>
              Upcoming Trips
            </h3>

            <p>
              Your next scheduled travel
              packages.
            </p>
          </div>

          <Plane
            size={20}
            className="section-icon"
          />
        </div>

        {upcomingTrips.length > 0 ? (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Destination</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {upcomingTrips.map(
                  (trip) => (
                    <tr key={trip.id}>
                      <td>
                        <strong>
                          {trip.name}
                        </strong>
                      </td>

                      <td>
                        {trip.destination}
                      </td>

                      <td>
                        {formatDate(
                          trip.startDate
                        )}
                      </td>

                      <td>
                        {formatDate(
                          trip.endDate
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          trip.price
                        )}
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            trip.status
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No upcoming trips"
            message="There are currently no upcoming trips."
          />
        )}
      </section>

      {/* =================================
          RECENT BOOKINGS
      ================================= */}

      <section className="dashboard-card recent-bookings-card">
        <div className="dashboard-card-header">
          <div>
            <h3>
              Recent Bookings
            </h3>

            <p>
              Latest customer reservations.
            </p>
          </div>

          <CalendarCheck
            size={20}
            className="section-icon"
          />
        </div>

        {recentBookings.length > 0 ? (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Trip</th>
                  <th>Travel Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map(
                  (booking) => (
                    <tr
                      key={booking.id}
                    >
                      <td>
                        <strong>
                          {
                            booking.bookingId
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          booking.customer
                        }
                      </td>

                      <td>
                        {booking.trip}
                      </td>

                      <td>
                        {formatDate(
                          booking.travelDate
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          booking.amount
                        )}
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            booking.bookingStatus
                          }
                        />
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            booking.paymentStatus
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No recent bookings"
            message="New bookings will appear here."
          />
        )}
      </section>
    </div>
  );
}

/* =========================================
   HELPERS
========================================= */

function formatCurrency(
  amount
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(Number(amount || 0));
}

function formatShortCurrency(
  amount
) {
  const value = Number(
    amount || 0
  );

  if (value >= 10000000) {
    return `₹${(
      value / 10000000
    ).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(
      value / 100000
    ).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(
      value / 1000
    ).toFixed(0)}K`;
  }

  return `₹${value}`;
}

function formatDate(
  date
) {
  if (!date) {
    return "-";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}

function formatFullDate(
  date
) {
  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );
}

function formatMonth(
  value
) {
  const date =
    new Date(`${value}-01T00:00:00`);

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "short",
      year: "numeric"
    }
  );
}

function getStatusColor(
  status
) {
  const colors = {
    Confirmed: "#16a34a",
    Pending: "#f59e0b",
    Completed: "#2563eb",
    Cancelled: "#dc2626"
  };

  return (
    colors[status] ||
    "#64748b"
  );
}

export default Dashboard;