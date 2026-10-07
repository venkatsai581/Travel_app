import { useMemo } from "react";

import {
  TrendingUp,
  IndianRupee,
  Ticket,
  Users,
  Plane,
  CreditCard,
  MapPin,
  CalendarDays
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { useTravel } from "../context/TravelContext.jsx";

import StatCard from "../components/common/StatCard.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";

function Analytics() {
  const {
    destinations,
    trips,
    customers,
    bookings,
    payments
  } = useTravel();

  const totalRevenue = bookings.reduce(
    (total, booking) =>
      total + Number(booking.amount || 0),
    0
  );

  const paidRevenue = payments
    .filter(
      (payment) =>
        payment.status === "Paid"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const totalTravelers = bookings.reduce(
    (total, booking) =>
      total +
      Number(booking.travelers || 0),
    0
  );

  const averageBookingValue =
    bookings.length > 0
      ? totalRevenue / bookings.length
      : 0;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "Confirmed"
    ).length;

  const confirmationRate =
    bookings.length > 0
      ? (
          (confirmedBookings /
            bookings.length) *
          100
        ).toFixed(1)
      : 0;

  const revenueByDestination = useMemo(() => {
    return destinations
      .map((destination) => {
        const destinationBookings =
          bookings.filter(
            (booking) =>
              booking.destination ===
              destination.name
          );

        const revenue =
          destinationBookings.reduce(
            (total, booking) =>
              total +
              Number(
                booking.amount || 0
              ),
            0
          );

        return {
          name: destination.name,
          revenue,
          bookings:
            destinationBookings.length
        };
      })
      .filter(
        (item) =>
          item.revenue > 0 ||
          item.bookings > 0
      )
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      );
  }, [destinations, bookings]);

  const bookingStatusData = useMemo(() => {
    const statuses = [
      "Confirmed",
      "Pending",
      "Completed",
      "Cancelled"
    ];

    return statuses
      .map((status) => ({
        name: status,
        value: bookings.filter(
          (booking) =>
            booking.bookingStatus ===
            status
        ).length
      }))
      .filter(
        (item) => item.value > 0
      );
  }, [bookings]);

  const paymentStatusData = useMemo(() => {
    const statuses = [
      "Paid",
      "Partial",
      "Pending",
      "Failed"
    ];

    return statuses
      .map((status) => ({
        name: status,
        value: payments.filter(
          (payment) =>
            payment.status === status
        ).length
      }))
      .filter(
        (item) => item.value > 0
      );
  }, [payments]);

  const tripStatusData = useMemo(() => {
    const statuses = [
      "Upcoming",
      "Active",
      "Completed"
    ];

    return statuses.map(
      (status) => ({
        name: status,
        value: trips.filter(
          (trip) =>
            trip.status === status
        ).length
      })
    );
  }, [trips]);

  const bookingTrendData = useMemo(() => {
    const monthlyData = {};

    bookings.forEach((booking) => {
      if (!booking.bookingDate) {
        return;
      }

      const date = new Date(
        `${booking.bookingDate}T00:00:00`
      );

      const monthKey =
        `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

      const monthName =
        date.toLocaleDateString(
          "en-US",
          {
            month: "short"
          }
        );

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          bookings: 0,
          revenue: 0
        };
      }

      monthlyData[monthKey].bookings += 1;

      monthlyData[monthKey].revenue +=
        Number(booking.amount || 0);
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(([, value]) => value);
  }, [bookings]);

  const topDestinations =
    revenueByDestination.slice(0, 5);

  return (
    <div className="page analytics-page">
      <div className="page-header">
        <div>
          <h2>Analytics</h2>

          <p>
            Analyze bookings, revenue,
            customers and travel
            performance.
          </p>
        </div>
      </div>

      <section className="analytics-stats">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            totalRevenue
          )}
          description="From all bookings"
          icon={
            <IndianRupee size={21} />
          }
        />

        <StatCard
          title="Paid Revenue"
          value={formatCurrency(
            paidRevenue
          )}
          description="Successfully collected"
          icon={
            <TrendingUp size={21} />
          }
        />

        <StatCard
          title="Total Bookings"
          value={bookings.length}
          description={`${confirmationRate}% confirmed`}
          icon={<Ticket size={21} />}
        />

        <StatCard
          title="Travelers"
          value={totalTravelers}
          description="Across all bookings"
          icon={<Users size={21} />}
        />
      </section>

      <section className="analytics-secondary-stats">
        <div className="analytics-mini-card">
          <div className="analytics-mini-icon">
            <IndianRupee size={18} />
          </div>

          <div>
            <span>
              Average Booking Value
            </span>

            <strong>
              {formatCurrency(
                averageBookingValue
              )}
            </strong>
          </div>
        </div>

        <div className="analytics-mini-card">
          <div className="analytics-mini-icon">
            <Plane size={18} />
          </div>

          <div>
            <span>Total Trips</span>

            <strong>
              {trips.length}
            </strong>
          </div>
        </div>

        <div className="analytics-mini-card">
          <div className="analytics-mini-icon">
            <Users size={18} />
          </div>

          <div>
            <span>Total Customers</span>

            <strong>
              {customers.length}
            </strong>
          </div>
        </div>

        <div className="analytics-mini-card">
          <div className="analytics-mini-icon">
            <MapPin size={18} />
          </div>

          <div>
            <span>Destinations</span>

            <strong>
              {destinations.length}
            </strong>
          </div>
        </div>
      </section>

      <section className="analytics-chart-grid">
        <div className="analytics-chart-card analytics-chart-wide">
          <div className="analytics-chart-header">
            <div>
              <h3>Booking & Revenue Trend</h3>

              <p>
                Booking volume and revenue
                over time.
              </p>
            </div>

            <TrendingUp size={20} />
          </div>

          {bookingTrendData.length > 0 ? (
            <div className="analytics-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={
                    bookingTrendData
                  }
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
                        offset="5%"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="95%"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCompactCurrency}
                  />

                  <Tooltip
                    formatter={(
                      value,
                      name
                    ) => {
                      if (
                        name ===
                        "revenue"
                      ) {
                        return [
                          formatCurrency(
                            value
                          ),
                          "Revenue"
                        ];
                      }

                      return [
                        value,
                        "Bookings"
                      ];
                    }}
                  />

                  <Legend />

                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="bookings"
                    strokeWidth={2}
                    fillOpacity={0}
                    name="Bookings"
                  />

                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <AnalyticsEmpty />
          )}
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div>
              <h3>Booking Status</h3>

              <p>
                Current booking distribution.
              </p>
            </div>

            <Ticket size={20} />
          </div>

          {bookingStatusData.length > 0 ? (
            <div className="analytics-pie-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
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
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {bookingStatusData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                                PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <AnalyticsEmpty />
          )}
        </div>
      </section>

      <section className="analytics-chart-grid">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div>
              <h3>
                Revenue by Destination
              </h3>

              <p>
                Revenue generated by
                destination.
              </p>
            </div>

            <MapPin size={20} />
          </div>

          {revenueByDestination.length >
          0 ? (
            <div className="analytics-chart analytics-bar-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    revenueByDestination
                  }
                  layout="vertical"
                  margin={{
                    left: 5,
                    right: 20
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={
                      formatCompactCurrency
                    }
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(
                        value
                      ),
                      "Revenue"
                    ]}
                  />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    radius={[
                      0,
                      6,
                      6,
                      0
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <AnalyticsEmpty />
          )}
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div>
              <h3>Payment Status</h3>

              <p>
                Payment transaction
                distribution.
              </p>
            </div>

            <CreditCard size={20} />
          </div>

          {paymentStatusData.length >
          0 ? (
            <div className="analytics-pie-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={
                      paymentStatusData
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {paymentStatusData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={
                            PIE_COLORS[
                              (index + 2) %
                                PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <AnalyticsEmpty />
          )}
        </div>
      </section>

      <section className="analytics-bottom-grid">
        <div className="analytics-list-card">
          <div className="analytics-list-header">
            <div>
              <h3>
                Top Destinations
              </h3>

              <p>
                Best performing travel
                destinations.
              </p>
            </div>

            <MapPin size={20} />
          </div>

          <div className="analytics-destination-list">
            {topDestinations.length >
            0 ? (
              topDestinations.map(
                (
                  destination,
                  index
                ) => (
                  <div
                    className="analytics-destination-row"
                    key={
                      destination.name
                    }
                  >
                    <div className="destination-rank">
                      {index + 1}
                    </div>

                    <div className="destination-info">
                      <strong>
                        {
                          destination.name
                        }
                      </strong>

                      <span>
                        {
                          destination.bookings
                        }{" "}
                        booking
                        {destination.bookings !==
                        1
                          ? "s"
                          : ""}
                      </span>
                    </div>

                    <strong className="destination-revenue">
                      {formatCurrency(
                        destination.revenue
                      )}
                    </strong>
                  </div>
                )
              )
            ) : (
              <AnalyticsEmpty />
            )}
          </div>
        </div>

        <div className="analytics-list-card">
          <div className="analytics-list-header">
            <div>
              <h3>
                Trip Performance
              </h3>

              <p>
                Current trip status
                overview.
              </p>
            </div>

            <CalendarDays size={20} />
          </div>

          <div className="trip-performance-list">
            {tripStatusData.map(
              (item) => (
                <div
                  className="trip-performance-row"
                  key={item.name}
                >
                  <div>
                    <StatusBadge
                      status={item.name}
                    />

                    <span>
                      {item.value}{" "}
                      trip
                      {item.value !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  <div className="performance-bar">
                    <div
                      style={{
                        width: `${
                          trips.length
                            ? (item.value /
                                trips.length) *
                              100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsEmpty() {
  return (
    <div className="analytics-empty">
      <TrendingUp size={28} />

      <span>
        No analytics data available.
      </span>
    </div>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(Number(amount || 0));
}

function formatCompactCurrency(
  amount
) {
  const value = Number(amount || 0);

  if (value >= 10000000) {
    return `${(
      value / 10000000
    ).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `${(
      value / 100000
    ).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(0)}K`;
  }

  return value;
}

const PIE_COLORS = [
  "#4263eb",
  "#16a085",
  "#f59e0b",
  "#ef4444",
  "#7c3aed"
];

export default Analytics;