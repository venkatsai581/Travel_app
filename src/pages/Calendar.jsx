import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plane,
  Ticket,
  Users,
  MapPin,
  Clock3,
  X
} from "lucide-react";

import { useTravel } from "../context/TravelContext.jsx";

import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";

function Calendar() {
  const { trips, bookings } = useTravel();

  const today = new Date();

  const [currentDate, setCurrentDate] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthName =
    currentDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const daysInPreviousMonth =
      new Date(
        year,
        month,
        0
      ).getDate();

    const totalCells =
      Math.ceil(
        (firstDay + daysInMonth) / 7
      ) * 7;

    const days = [];

    for (
      let index = 0;
      index < totalCells;
      index += 1
    ) {
      const dayNumber =
        index - firstDay + 1;

      let date;
      let isCurrentMonth = true;

      if (dayNumber < 1) {
        date = new Date(
          year,
          month - 1,
          daysInPreviousMonth +
            dayNumber
        );

        isCurrentMonth = false;
      } else if (
        dayNumber > daysInMonth
      ) {
        date = new Date(
          year,
          month,
          dayNumber
        );

        isCurrentMonth = false;
      } else {
        date = new Date(
          year,
          month,
          dayNumber
        );
      }

      days.push({
        date,
        isCurrentMonth
      });
    }

    return days;
  }, [month, year]);

  const calendarEvents = useMemo(() => {
    const events = [];

    trips.forEach((trip) => {
      if (trip.startDate) {
        events.push({
          id: `trip-start-${trip.id}`,
          type: "trip",
          title: trip.name,
          date: trip.startDate,
          status: trip.status,
          destination:
            trip.destination,
          startDate:
            trip.startDate,
          endDate:
            trip.endDate,
          price: trip.price,
          seats: trip.seats,
          icon: "trip",
          description:
            "Trip departure date"
        });
      }

      if (
        trip.endDate &&
        trip.endDate !== trip.startDate
      ) {
        events.push({
          id: `trip-end-${trip.id}`,
          type: "trip-end",
          title: trip.name,
          date: trip.endDate,
          status: trip.status,
          destination:
            trip.destination,
          startDate:
            trip.startDate,
          endDate:
            trip.endDate,
          price: trip.price,
          seats: trip.seats,
          icon: "trip",
          description:
            "Trip return date"
        });
      }
    });

    bookings.forEach((booking) => {
      if (booking.travelDate) {
        events.push({
          id: `booking-${booking.id}`,
          type: "booking",
          title:
            booking.customer,
          date: booking.travelDate,
          status:
            booking.bookingStatus,
          bookingId:
            booking.bookingId,
          customer:
            booking.customer,
          trip: booking.trip,
          destination:
            booking.destination,
          travelers:
            booking.travelers,
          amount:
            booking.amount,
          paymentStatus:
            booking.paymentStatus,
          icon: "booking",
          description:
            "Customer travel date"
        });
      }
    });

    return events;
  }, [trips, bookings]);

  const eventsByDate = useMemo(() => {
    const grouped = {};

    calendarEvents.forEach((event) => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }

      grouped[event.date].push(event);
    });

    return grouped;
  }, [calendarEvents]);

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const goToToday = () => {
    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  const openEvent = (event) => {
    setSelectedEvent(event);
    setViewOpen(true);
  };

  const closeEvent = () => {
    setSelectedEvent(null);
    setViewOpen(false);
  };

  const isToday = (date) => {
    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  };

  const formatDateKey = (date) => {
    const dateYear =
      date.getFullYear();

    const dateMonth = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const dateDay = String(
      date.getDate()
    ).padStart(2, "0");

    return `${dateYear}-${dateMonth}-${dateDay}`;
  };

  return (
    <div className="page calendar-page">
      <div className="page-header">
        <div>
          <h2>Calendar</h2>

          <p>
            View trips and customer
            bookings by travel date.
          </p>
        </div>
      </div>

      <section className="calendar-card">
        <div className="calendar-toolbar">
          <div className="calendar-title">
            <CalendarDays size={21} />

            <div>
              <h3>{monthName}</h3>

              <span>
                {calendarEvents.length}{" "}
                scheduled event
                {calendarEvents.length !==
                1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>

          <div className="calendar-controls">
            <Button
              variant="secondary"
              onClick={goToToday}
            >
              Today
            </Button>

            <button
              type="button"
              className="calendar-nav-button"
              onClick={previousMonth}
              aria-label="Previous month"
              title="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              className="calendar-nav-button"
              onClick={nextMonth}
              aria-label="Next month"
              title="Next month"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="calendar-legend">
          <div className="calendar-legend-item">
            <span className="legend-dot trip-dot" />
            Trips
          </div>

          <div className="calendar-legend-item">
            <span className="legend-dot booking-dot" />
            Bookings
          </div>

          <div className="calendar-legend-item">
            <span className="legend-dot today-dot" />
            Today
          </div>
        </div>

        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-grid">
          {calendarDays.map(
            ({
              date,
              isCurrentMonth
            }) => {
              const dateKey =
                formatDateKey(date);

              const dayEvents =
                eventsByDate[
                  dateKey
                ] || [];

              return (
                <div
                  key={dateKey}
                  className={`calendar-day ${
                    isCurrentMonth
                      ? ""
                      : "outside-month"
                  } ${
                    isToday(date)
                      ? "today"
                      : ""
                  }`}
                >
                  <div className="calendar-day-header">
                    <span
                      className={
                        isToday(date)
                          ? "today-number"
                          : ""
                      }
                    >
                      {date.getDate()}
                    </span>

                    {dayEvents.length >
                      0 && (
                      <small>
                        {
                          dayEvents.length
                        }
                      </small>
                    )}
                  </div>

                  <div className="calendar-events">
                    {dayEvents
                      .slice(0, 3)
                      .map(
                        (event) => (
                          <button
                            key={
                              event.id
                            }
                            type="button"
                            className={`calendar-event ${
                              event.type ===
                              "booking"
                                ? "booking-event"
                                : "trip-event"
                            }`}
                            onClick={() =>
                              openEvent(
                                event
                              )
                            }
                            title={`View ${event.title}`}
                          >
                            {event.type ===
                            "booking" ? (
                              <Ticket
                                size={12}
                              />
                            ) : (
                              <Plane
                                size={12}
                              />
                            )}

                            <span>
                              {
                                event.title
                              }
                            </span>
                          </button>
                        )
                      )}

                    {dayEvents.length >
                      3 && (
                      <button
                        type="button"
                        className="calendar-more"
                        onClick={() =>
                          openEvent(
                            dayEvents[3]
                          )
                        }
                      >
                        +
                        {dayEvents.length -
                          3}{" "}
                        more
                      </button>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      <section className="calendar-summary-grid">
        <div className="calendar-summary-card">
          <div className="calendar-summary-icon trip-summary-icon">
            <Plane size={20} />
          </div>

          <div>
            <span>Trips</span>

            <strong>
              {
                calendarEvents.filter(
                  (event) =>
                    event.type ===
                    "trip"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="calendar-summary-card">
          <div className="calendar-summary-icon booking-summary-icon">
            <Ticket size={20} />
          </div>

          <div>
            <span>Bookings</span>

            <strong>
              {
                calendarEvents.filter(
                  (event) =>
                    event.type ===
                    "booking"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="calendar-summary-card">
          <div className="calendar-summary-icon customer-summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Travelers</span>

            <strong>
              {bookings.reduce(
                (
                  total,
                  booking
                ) =>
                  total +
                  Number(
                    booking.travelers ||
                      0
                  ),
                0
              )}
            </strong>
          </div>
        </div>

        <div className="calendar-summary-card">
          <div className="calendar-summary-icon date-summary-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Current Month</span>

            <strong>
              {monthName.split(
                " "
              )[0]}
            </strong>
          </div>
        </div>
      </section>

      <Modal
        isOpen={viewOpen}
        onClose={closeEvent}
        title="Calendar Event"
        size="medium"
      >
        {selectedEvent && (
          <div className="calendar-event-details">
            <div className="calendar-event-detail-header">
              <div
                className={`calendar-event-detail-icon ${
                  selectedEvent.type ===
                  "booking"
                    ? "booking-detail-icon"
                    : "trip-detail-icon"
                }`}
              >
                {selectedEvent.type ===
                "booking" ? (
                  <Ticket size={26} />
                ) : (
                  <Plane size={26} />
                )}
              </div>

              <div>
                <span>
                  {selectedEvent.type ===
                  "booking"
                    ? "BOOKING EVENT"
                    : selectedEvent.type ===
                      "trip-end"
                    ? "TRIP RETURN"
                    : "TRIP DEPARTURE"}
                </span>

                <h3>
                  {selectedEvent.title}
                </h3>
              </div>

              <StatusBadge
                status={
                  selectedEvent.status
                }
              />
            </div>

            <div className="calendar-detail-grid">
              <div className="calendar-detail-item">
                <CalendarDays
                  size={17}
                />

                <div>
                  <span>Date</span>

                  <strong>
                    {formatDisplayDate(
                      selectedEvent.date
                    )}
                  </strong>
                </div>
              </div>

              {selectedEvent.destination && (
                <div className="calendar-detail-item">
                  <MapPin size={17} />

                  <div>
                    <span>
                      Destination
                    </span>

                    <strong>
                      {
                        selectedEvent.destination
                      }
                    </strong>
                  </div>
                </div>
              )}

              {selectedEvent.type ===
                "booking" && (
                <>
                  <div className="calendar-detail-item">
                    <Ticket size={17} />

                    <div>
                      <span>
                        Booking ID
                      </span>

                      <strong>
                        {
                          selectedEvent.bookingId
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="calendar-detail-item">
                    <Users size={17} />

                    <div>
                      <span>
                        Travelers
                      </span>

                      <strong>
                        {
                          selectedEvent.travelers
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="calendar-detail-item">
                    <Plane size={17} />

                    <div>
                      <span>
                        Trip
                      </span>

                      <strong>
                        {
                          selectedEvent.trip
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="calendar-detail-item">
                    <Clock3 size={17} />

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {
                          selectedEvent.paymentStatus
                        }
                      </strong>
                    </div>
                  </div>
                </>
              )}

              {selectedEvent.type !==
                "booking" && (
                <>
                  <div className="calendar-detail-item">
                    <CalendarDays
                      size={17}
                    />

                    <div>
                      <span>
                        Start Date
                      </span>

                      <strong>
                        {formatDisplayDate(
                          selectedEvent.startDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="calendar-detail-item">
                    <CalendarDays
                      size={17}
                    />

                    <div>
                      <span>
                        End Date
                      </span>

                      <strong>
                        {formatDisplayDate(
                          selectedEvent.endDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="calendar-detail-item">
                    <Users size={17} />

                    <div>
                      <span>
                        Available Seats
                      </span>

                      <strong>
                        {
                          selectedEvent.seats
                        }
                      </strong>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="calendar-event-description">
              {selectedEvent.description}
            </div>

            <div className="view-modal-actions">
              <Button
                variant="secondary"
                icon={<X size={16} />}
                onClick={closeEvent}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function formatDisplayDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}

export default Calendar;