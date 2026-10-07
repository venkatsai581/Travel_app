import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  IndianRupee,
  MapPin,
  CreditCard,
  UserRound,
  Plane,
  X,
  ArrowUpDown
} from "lucide-react";

import { useTravel } from "../context/TravelContext.jsx";

import Button from "../components/common/Button.jsx";
import StatCard from "../components/common/StatCard.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import FilterBar from "../components/common/FilterBar.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmationModal from "../components/common/ConfirmationModal.jsx";
import Toast from "../components/common/Toast.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

const ITEMS_PER_PAGE = 5;

const emptyForm = {
  customer: "",
  trip: "",
  bookingDate: "",
  travelDate: "",
  travelers: "1",
  bookingStatus: "Pending",
  paymentStatus: "Pending"
};

function Bookings() {
  const {
    bookings,
    customers,
    trips,
    addBooking,
    updateBooking,
    deleteBooking
  } = useTravel();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [paymentFilter, setPaymentFilter] =
    useState("All");

  const [destinationFilter, setDestinationFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("date-desc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [formOpen, setFormOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editingBooking, setEditingBooking] =
    useState(null);

  const [viewingBooking, setViewingBooking] =
    useState(null);

  const [deleteTargetId, setDeleteTargetId] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [errors, setErrors] =
    useState({});

  const [toast, setToast] = useState({
    message: "",
    type: "success"
  });

  const totalBookings = bookings.length;

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

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "Completed"
    ).length;

  const destinations = useMemo(() => {
    return [
      ...new Set(
        bookings
          .map(
            (booking) =>
              booking.destination
          )
          .filter(Boolean)
      )
    ].sort();
  }, [bookings]);

  const selectedTrip = trips.find(
    (trip) =>
      trip.name === formData.trip
  );

  const calculatedAmount =
    selectedTrip
      ? Number(selectedTrip.price || 0) *
        Number(formData.travelers || 1)
      : 0;

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (booking) =>
          booking.bookingId
            .toLowerCase()
            .includes(searchValue) ||
          booking.customer
            .toLowerCase()
            .includes(searchValue) ||
          booking.trip
            .toLowerCase()
            .includes(searchValue) ||
          booking.destination
            .toLowerCase()
            .includes(searchValue)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (booking) =>
          booking.bookingStatus ===
          statusFilter
      );
    }

    if (paymentFilter !== "All") {
      result = result.filter(
        (booking) =>
          booking.paymentStatus ===
          paymentFilter
      );
    }

    if (destinationFilter !== "All") {
      result = result.filter(
        (booking) =>
          booking.destination ===
          destinationFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date-asc") {
        return a.bookingDate.localeCompare(
          b.bookingDate
        );
      }

      if (sortBy === "date-desc") {
        return b.bookingDate.localeCompare(
          a.bookingDate
        );
      }

      if (sortBy === "travel-asc") {
        return a.travelDate.localeCompare(
          b.travelDate
        );
      }

      if (sortBy === "travel-desc") {
        return b.travelDate.localeCompare(
          a.travelDate
        );
      }

      if (sortBy === "amount-high") {
        return (
          Number(b.amount) -
          Number(a.amount)
        );
      }

      if (sortBy === "amount-low") {
        return (
          Number(a.amount) -
          Number(b.amount)
        );
      }

      return 0;
    });

    return result;
  }, [
    bookings,
    search,
    statusFilter,
    paymentFilter,
    destinationFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBookings.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedBookings =
    filteredBookings.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    paymentFilter,
    destinationFilter,
    sortBy
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages
  ]);

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast({
        message: "",
        type: "success"
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.message]);

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type
    });
  };

  const openAddModal = () => {
    setEditingBooking(null);

    setFormData({
      ...emptyForm,
      bookingDate:
        new Date()
          .toISOString()
          .split("T")[0]
    });

    setErrors({});
    setFormOpen(true);
  };

  const openEditModal = (booking) => {
    setEditingBooking(booking);

    setFormData({
      customer: booking.customer || "",
      trip: booking.trip || "",
      bookingDate:
        booking.bookingDate || "",
      travelDate:
        booking.travelDate || "",
      travelers:
        booking.travelers
          ? String(booking.travelers)
          : "1",
      bookingStatus:
        booking.bookingStatus ||
        "Pending",
      paymentStatus:
        booking.paymentStatus ||
        "Pending"
    });

    setErrors({});
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingBooking(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const openViewModal = (booking) => {
    setViewingBooking(booking);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setViewingBooking(null);
  };

  const handleFormChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: ""
      }));
    }

    if (name === "trip") {
      setErrors((current) => ({
        ...current,
        travelDate: ""
      }));

      const trip = trips.find(
        (item) =>
          item.name === value
      );

      if (trip) {
        setFormData((current) => ({
          ...current,
          trip: value,
          travelDate:
            current.travelDate ||
            trip.startDate
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer) {
      newErrors.customer =
        "Customer is required.";
    }

    if (!formData.trip) {
      newErrors.trip =
        "Trip is required.";
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate =
        "Booking date is required.";
    }

    if (!formData.travelDate) {
      newErrors.travelDate =
        "Travel date is required.";
    }

    if (
      formData.bookingDate &&
      formData.travelDate &&
      formData.travelDate <
        formData.bookingDate
    ) {
      newErrors.travelDate =
        "Travel date cannot be before booking date.";
    }

    if (
      !formData.travelers ||
      Number(formData.travelers) <= 0
    ) {
      newErrors.travelers =
        "Travelers must be greater than 0.";
    } else if (
      !Number.isInteger(
        Number(formData.travelers)
      )
    ) {
      newErrors.travelers =
        "Travelers must be a whole number.";
    }

    if (
      selectedTrip &&
      Number(formData.travelers) >
        Number(selectedTrip.seats)
    ) {
      newErrors.travelers =
        `Only ${selectedTrip.seats} seats are available for this trip.`;
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    const trip = trips.find(
      (item) =>
        item.name === formData.trip
    );

    const customer = customers.find(
      (item) =>
        item.name ===
        formData.customer
    );

    const cleanData = {
      customer:
        customer?.name ||
        formData.customer,

      trip:
        trip?.name ||
        formData.trip,

      destination:
        trip?.destination || "",

      bookingDate:
        formData.bookingDate,

      travelDate:
        formData.travelDate,

      travelers:
        Number(formData.travelers),

      amount:
        Number(trip?.price || 0) *
        Number(formData.travelers),

      bookingStatus:
        formData.bookingStatus,

      paymentStatus:
        formData.paymentStatus
    };

    if (editingBooking) {
      updateBooking(
        editingBooking.id,
        cleanData
      );

      showToast(
        "Booking updated successfully."
      );
    } else {
      addBooking(cleanData);

      showToast(
        "Booking created successfully."
      );
    }

    closeFormModal();
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
  };

  const confirmDelete = () => {
    if (deleteTargetId === null) {
      return;
    }

    deleteBooking(deleteTargetId);

    setDeleteTargetId(null);

    showToast(
      "Booking deleted successfully."
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setDestinationFilter("All");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "All" ||
    paymentFilter !== "All" ||
    destinationFilter !== "All" ||
    sortBy !== "date-desc";

  return (
    <div className="page bookings-page">
      <div className="page-header">
        <div>
          <h2>Bookings</h2>

          <p>
            Manage customer reservations,
            travel dates and booking payments.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={17} />}
          onClick={openAddModal}
        >
          Add Booking
        </Button>
      </div>

      <section className="booking-stats">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          description="All reservations"
          icon={
            <ClipboardCheck
              size={21}
            />
          }
        />

        <StatCard
          title="Confirmed"
          value={confirmedBookings}
          description="Confirmed reservations"
          icon={
            <CheckCircle2
              size={21}
            />
          }
        />

        <StatCard
          title="Pending"
          value={pendingBookings}
          description="Awaiting confirmation"
          icon={<Clock3 size={21} />}
        />

        <StatCard
          title="Completed"
          value={completedBookings}
          description="Completed journeys"
          icon={
            <CalendarDays
              size={21}
            />
          }
        />
      </section>

      <section className="booking-card">
        <FilterBar
          showReset={hasActiveFilters}
          onReset={resetFilters}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search bookings..."
          />

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Booking Status
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          <select
            className="filter-select"
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Payment Status
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Partial">
              Partial
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>
          </select>

          <select
            className="filter-select"
            value={destinationFilter}
            onChange={(event) =>
              setDestinationFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Destinations
            </option>

            {destinations.map(
              (destination) => (
                <option
                  key={destination}
                  value={destination}
                >
                  {destination}
                </option>
              )
            )}
          </select>
        </FilterBar>

        <div className="booking-sort-row">
          <div className="booking-result-info">
            Showing{" "}
            <strong>
              {filteredBookings.length}
            </strong>{" "}
            booking
            {filteredBookings.length !== 1
              ? "s"
              : ""}
          </div>

          <div className="booking-sort">
            <ArrowUpDown size={15} />

            <select
              className="filter-select"
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
              }
            >
              <option value="date-desc">
                Booking Date: Latest
              </option>

              <option value="date-asc">
                Booking Date: Earliest
              </option>

              <option value="travel-asc">
                Travel Date: Earliest
              </option>

              <option value="travel-desc">
                Travel Date: Latest
              </option>

              <option value="amount-high">
                Amount: High to Low
              </option>

              <option value="amount-low">
                Amount: Low to High
              </option>
            </select>
          </div>
        </div>

        {paginatedBookings.length > 0 ? (
          <>
            <div className="booking-table-wrapper">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Customer</th>
                    <th>Trip</th>
                    <th>Travel Date</th>
                    <th>Travelers</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBookings.map(
                    (booking) => (
                      <tr
                        key={booking.id}
                      >
                        <td>
                          <div className="booking-id-cell">
                            <div className="booking-icon">
                              <ClipboardCheck
                                size={17}
                              />
                            </div>

                            <div>
                              <strong>
                                {
                                  booking.bookingId
                                }
                              </strong>

                              <span>
                                Booked{" "}
                                {formatDate(
                                  booking.bookingDate
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="booking-customer-cell">
                            <UserRound
                              size={14}
                            />

                            {
                              booking.customer
                            }
                          </div>
                        </td>

                        <td>
                          <div className="booking-trip-cell">
                            <strong>
                              {
                                booking.trip
                              }
                            </strong>

                            <span>
                              <MapPin
                                size={12}
                              />
                              {
                                booking.destination
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="booking-date-cell">
                            <CalendarDays
                              size={14}
                            />

                            <strong>
                              {formatDate(
                                booking.travelDate
                              )}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <div className="booking-travelers-cell">
                            <Users
                              size={14}
                            />

                            {
                              booking.travelers
                            }
                          </div>
                        </td>

                        <td>
                          <strong className="booking-amount">
                            {formatCurrency(
                              booking.amount
                            )}
                          </strong>
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

                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="icon-action view"
                              onClick={() =>
                                openViewModal(
                                  booking
                                )
                              }
                              title="View"
                              aria-label={`View ${booking.bookingId}`}
                            >
                              <Eye
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              className="icon-action edit"
                              onClick={() =>
                                openEditModal(
                                  booking
                                )
                              }
                              title="Edit"
                              aria-label={`Edit ${booking.bookingId}`}
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              className="icon-action delete"
                              onClick={() =>
                                handleDeleteClick(
                                  booking.id
                                )
                              }
                              title="Delete"
                              aria-label={`Delete ${booking.bookingId}`}
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={
                setCurrentPage
              }
            />
          </>
        ) : (
          <EmptyState
            title={
              hasActiveFilters
                ? "No bookings found"
                : "No bookings yet"
            }
            message={
              hasActiveFilters
                ? "Try changing your search or filters."
                : "Create your first booking to get started."
            }
            action={
              hasActiveFilters ? (
                <Button
                  variant="secondary"
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  icon={<Plus size={17} />}
                  onClick={openAddModal}
                >
                  Add Booking
                </Button>
              )
            }
          />
        )}
      </section>

      <Modal
        isOpen={formOpen}
        onClose={closeFormModal}
        title={
          editingBooking
            ? "Edit Booking"
            : "Add Booking"
        }
        size="large"
      >
        <form
          className="booking-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="booking-customer">
                Customer
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <UserRound size={15} />

                <select
                  id="booking-customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleFormChange}
                  className={
                    errors.customer
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={customer.id}
                        value={
                          customer.name
                        }
                      >
                        {customer.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.customer && (
                <small className="form-error">
                  {errors.customer}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="booking-trip">
                Trip
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <Plane size={15} />

                <select
                  id="booking-trip"
                  name="trip"
                  value={formData.trip}
                  onChange={handleFormChange}
                  className={
                    errors.trip
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="">
                    Select trip
                  </option>

                  {trips.map((trip) => (
                    <option
                      key={trip.id}
                      value={trip.name}
                    >
                      {trip.name}
                    </option>
                  ))}
                </select>
              </div>

              {errors.trip && (
                <small className="form-error">
                  {errors.trip}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="booking-date">
                Booking Date
                <span>*</span>
              </label>

              <input
                id="booking-date"
                name="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={handleFormChange}
                className={
                  errors.bookingDate
                    ? "input-error"
                    : ""
                }
              />

              {errors.bookingDate && (
                <small className="form-error">
                  {errors.bookingDate}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="booking-travel-date">
                Travel Date
                <span>*</span>
              </label>

              <input
                id="booking-travel-date"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleFormChange}
                min={
                  selectedTrip?.startDate ||
                  undefined
                }
                className={
                  errors.travelDate
                    ? "input-error"
                    : ""
                }
              />

              {errors.travelDate && (
                <small className="form-error">
                  {errors.travelDate}
                </small>
              )}

              {selectedTrip && (
                <small className="form-hint">
                  Trip starts on{" "}
                  {formatDate(
                    selectedTrip.startDate
                  )}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="booking-travelers">
                Travelers
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <Users size={15} />

                <input
                  id="booking-travelers"
                  name="travelers"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.travelers}
                  onChange={handleFormChange}
                  className={
                    errors.travelers
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.travelers && (
                <small className="form-error">
                  {errors.travelers}
                </small>
              )}

              {selectedTrip && (
                <small className="form-hint">
                  Available seats:{" "}
                  {selectedTrip.seats}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="booking-status">
                Booking Status
              </label>

              <select
                id="booking-status"
                name="bookingStatus"
                value={
                  formData.bookingStatus
                }
                onChange={handleFormChange}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="booking-payment">
                Payment Status
              </label>

              <div className="form-input-with-icon">
                <CreditCard size={15} />

                <select
                  id="booking-payment"
                  name="paymentStatus"
                  value={
                    formData.paymentStatus
                  }
                  onChange={handleFormChange}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partial">
                    Partial
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Failed">
                    Failed
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="booking-price-preview">
            <div>
              <span>Trip Price</span>

              <strong>
                {selectedTrip
                  ? formatCurrency(
                      selectedTrip.price
                    )
                  : "—"}
              </strong>
            </div>

            <div>
              <span>Travelers</span>

              <strong>
                {formData.travelers ||
                  "0"}
              </strong>
            </div>

            <div className="booking-total-preview">
              <span>Total Amount</span>

              <strong>
                {formatCurrency(
                  calculatedAmount
                )}
              </strong>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={closeFormModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              icon={
                editingBooking ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={16} />
                )
              }
            >
              {editingBooking
                ? "Update Booking"
                : "Create Booking"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={viewOpen}
        onClose={closeViewModal}
        title="Booking Details"
        size="medium"
      >
        {viewingBooking && (
          <BookingDetails
            booking={viewingBooking}
            onClose={closeViewModal}
            onEdit={() => {
              closeViewModal();

              openEditModal(
                viewingBooking
              );
            }}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={
          deleteTargetId !== null
        }
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success"
          })
        }
      />
    </div>
  );
}

function BookingDetails({
  booking,
  onClose,
  onEdit
}) {
  return (
    <div className="booking-view">
      <div className="booking-view-header">
        <div className="booking-view-icon">
          <ClipboardCheck size={28} />
        </div>

        <div className="booking-view-title">
          <span>BOOKING</span>

          <h3>{booking.bookingId}</h3>

          <p>
            <UserRound size={13} />

            {booking.customer}
          </p>
        </div>

        <StatusBadge
          status={booking.bookingStatus}
        />
      </div>

      <div className="booking-view-trip">
        <div>
          <span>TRIP</span>

          <strong>
            {booking.trip}
          </strong>
        </div>

        <div>
          <span>DESTINATION</span>

          <strong>
            <MapPin size={13} />

            {booking.destination}
          </strong>
        </div>
      </div>

      <div className="booking-view-grid">
        <div className="booking-view-item">
          <CalendarDays size={17} />

          <div>
            <span>Booking Date</span>

            <strong>
              {formatDate(
                booking.bookingDate
              )}
            </strong>
          </div>
        </div>

        <div className="booking-view-item">
          <CalendarDays size={17} />

          <div>
            <span>Travel Date</span>

            <strong>
              {formatDate(
                booking.travelDate
              )}
            </strong>
          </div>
        </div>

        <div className="booking-view-item">
          <Users size={17} />

          <div>
            <span>Travelers</span>

            <strong>
              {booking.travelers}
            </strong>
          </div>
        </div>

        <div className="booking-view-item">
          <IndianRupee size={17} />

          <div>
            <span>Total Amount</span>

            <strong>
              {formatCurrency(
                booking.amount
              )}
            </strong>
          </div>
        </div>
      </div>

      <div className="booking-payment-summary">
        <div>
          <CreditCard size={16} />

          <span>Payment Status</span>

          <StatusBadge
            status={
              booking.paymentStatus
            }
          />
        </div>
      </div>

      <div className="booking-view-summary">
        <span>Booking ID</span>

        <strong>
          {booking.bookingId}
        </strong>
      </div>

      <div className="view-modal-actions">
        <Button
          variant="secondary"
          icon={<X size={16} />}
          onClick={onClose}
        >
          Close
        </Button>

        <Button
          variant="primary"
          icon={<Pencil size={16} />}
          onClick={onEdit}
        >
          Edit Booking
        </Button>
      </div>
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

function formatDate(date) {
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

export default Bookings;