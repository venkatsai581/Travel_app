import { useEffect, useMemo, useState } from "react";

import {
  Plane,
  CheckCircle2,
  Clock3,
  CircleCheckBig,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  CalendarDays,
  Users,
  IndianRupee,
  MapPin,
  X
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
  name: "",
  destination: "",
  startDate: "",
  endDate: "",
  price: "",
  seats: "",
  status: "Upcoming"
};

function Trips() {
  const {
    trips,
    destinations,
    addTrip,
    updateTrip,
    deleteTrip
  } = useTravel();

  const [search, setSearch] = useState("");
  const [destinationFilter, setDestinationFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDateFilter, setStartDateFilter] =
    useState("");

  const [sortBy, setSortBy] =
    useState("date-asc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [formOpen, setFormOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editingTrip, setEditingTrip] =
    useState(null);

  const [viewingTrip, setViewingTrip] =
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

  const totalTrips = trips.length;

  const activeTrips = trips.filter(
    (trip) => trip.status === "Active"
  ).length;

  const upcomingTrips = trips.filter(
    (trip) => trip.status === "Upcoming"
  ).length;

  const completedTrips = trips.filter(
    (trip) => trip.status === "Completed"
  ).length;

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((trip) => {
        return (
          trip.name
            .toLowerCase()
            .includes(searchValue) ||
          trip.destination
            .toLowerCase()
            .includes(searchValue)
        );
      });
    }

    if (destinationFilter !== "All") {
      result = result.filter(
        (trip) =>
          trip.destination ===
          destinationFilter
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (trip) =>
          trip.status === statusFilter
      );
    }

    if (minPrice !== "") {
      result = result.filter(
        (trip) =>
          Number(trip.price) >=
          Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (trip) =>
          Number(trip.price) <=
          Number(maxPrice)
      );
    }

    if (startDateFilter) {
      result = result.filter(
        (trip) =>
          trip.startDate ===
          startDateFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === "price-low") {
        return (
          Number(a.price) -
          Number(b.price)
        );
      }

      if (sortBy === "price-high") {
        return (
          Number(b.price) -
          Number(a.price)
        );
      }

      if (sortBy === "date-asc") {
        return a.startDate.localeCompare(
          b.startDate
        );
      }

      if (sortBy === "date-desc") {
        return b.startDate.localeCompare(
          a.startDate
        );
      }

      return 0;
    });

    return result;
  }, [
    trips,
    search,
    destinationFilter,
    statusFilter,
    minPrice,
    maxPrice,
    startDateFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTrips.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedTrips =
    filteredTrips.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    destinationFilter,
    statusFilter,
    minPrice,
    maxPrice,
    startDateFilter,
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
    setEditingTrip(null);
    setFormData(emptyForm);
    setErrors({});
    setFormOpen(true);
  };

  const openEditModal = (trip) => {
    setEditingTrip(trip);

    setFormData({
      name: trip.name || "",
      destination:
        trip.destination || "",
      startDate:
        trip.startDate || "",
      endDate:
        trip.endDate || "",
      price:
        trip.price !== undefined
          ? String(trip.price)
          : "",
      seats:
        trip.seats !== undefined
          ? String(trip.seats)
          : "",
      status:
        trip.status || "Upcoming"
    });

    setErrors({});
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingTrip(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const openViewModal = (trip) => {
    setViewingTrip(trip);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setViewingTrip(null);
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Trip name is required.";
    } else if (
      formData.name.trim().length < 3
    ) {
      newErrors.name =
        "Trip name must contain at least 3 characters.";
    }

    if (!formData.destination) {
      newErrors.destination =
        "Destination is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate =
        "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate =
        "End date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate <
        formData.startDate
    ) {
      newErrors.endDate =
        "End date cannot be before start date.";
    }

    if (formData.price === "") {
      newErrors.price =
        "Price is required.";
    } else if (
      Number(formData.price) <= 0
    ) {
      newErrors.price =
        "Price must be greater than 0.";
    }

    if (formData.seats === "") {
      newErrors.seats =
        "Number of seats is required.";
    } else if (
      Number(formData.seats) <= 0
    ) {
      newErrors.seats =
        "Seats must be greater than 0.";
    } else if (
      !Number.isInteger(
        Number(formData.seats)
      )
    ) {
      newErrors.seats =
        "Seats must be a whole number.";
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

    const cleanData = {
      name: formData.name.trim(),
      destination:
        formData.destination,
      startDate:
        formData.startDate,
      endDate:
        formData.endDate,
      price: Number(formData.price),
      seats: Number(formData.seats),
      status: formData.status
    };

    if (editingTrip) {
      updateTrip(
        editingTrip.id,
        cleanData
      );

      showToast(
        "Trip updated successfully."
      );
    } else {
      addTrip(cleanData);

      showToast(
        "Trip added successfully."
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

    deleteTrip(deleteTargetId);

    setDeleteTargetId(null);

    showToast(
      "Trip deleted successfully."
    );
  };

  const resetFilters = () => {
    setSearch("");
    setDestinationFilter("All");
    setStatusFilter("All");
    setMinPrice("");
    setMaxPrice("");
    setStartDateFilter("");
    setSortBy("date-asc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    destinationFilter !== "All" ||
    statusFilter !== "All" ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(startDateFilter) ||
    sortBy !== "date-asc";

  return (
    <div className="page trips-page">
      <div className="page-header">
        <div>
          <h2>Trips</h2>
          <p>
            Create and manage your travel
            packages and scheduled journeys.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={17} />}
          onClick={openAddModal}
        >
          Add Trip
        </Button>
      </div>

      <section className="trip-stats">
        <StatCard
          title="Total Trips"
          value={totalTrips}
          description="All travel packages"
          icon={<Plane size={21} />}
        />

        <StatCard
          title="Active"
          value={activeTrips}
          description="Currently running"
          icon={<CheckCircle2 size={21} />}
        />

        <StatCard
          title="Upcoming"
          value={upcomingTrips}
          description="Scheduled journeys"
          icon={<Clock3 size={21} />}
        />

        <StatCard
          title="Completed"
          value={completedTrips}
          description="Finished journeys"
          icon={<CircleCheckBig size={21} />}
        />
      </section>

      <section className="trip-card">
        <FilterBar
          showReset={hasActiveFilters}
          onReset={resetFilters}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search trips..."
          />

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
                  key={destination.id}
                  value={destination.name}
                >
                  {destination.name}
                </option>
              )
            )}
          </select>

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
              All Status
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Upcoming">
              Upcoming
            </option>
            <option value="Completed">
              Completed
            </option>
          </select>
        </FilterBar>

        <div className="trip-advanced-filters">
          <div className="advanced-filter-group">
            <label>Min Price</label>

            <div className="price-input">
              <IndianRupee size={14} />

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(
                    event.target.value
                  )
                }
                placeholder="Min"
              />
            </div>
          </div>

          <div className="advanced-filter-group">
            <label>Max Price</label>

            <div className="price-input">
              <IndianRupee size={14} />

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    event.target.value
                  )
                }
                placeholder="Max"
              />
            </div>
          </div>

          <div className="advanced-filter-group">
            <label>Start Date</label>

            <div className="date-input">
              <CalendarDays size={14} />

              <input
                type="date"
                value={startDateFilter}
                onChange={(event) =>
                  setStartDateFilter(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="advanced-filter-group sort-group">
            <label>Sort</label>

            <div className="sort-control">
              <ArrowUpDown size={15} />

              <select
                className="filter-select sort-select"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >
                <option value="date-asc">
                  Start Date: Earliest
                </option>
                <option value="date-desc">
                  Start Date: Latest
                </option>
                <option value="name-asc">
                  Name A-Z
                </option>
                <option value="name-desc">
                  Name Z-A
                </option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="trip-result-info">
          <span>
            Showing{" "}
            <strong>
              {filteredTrips.length}
            </strong>{" "}
            trip
            {filteredTrips.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {paginatedTrips.length > 0 ? (
          <>
            <div className="trip-table-wrapper">
              <table className="trip-table">
                <thead>
                  <tr>
                    <th>Trip</th>
                    <th>Destination</th>
                    <th>Travel Dates</th>
                    <th>Price</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTrips.map(
                    (trip) => (
                      <tr key={trip.id}>
                        <td>
                          <div className="trip-name-cell">
                            <div className="trip-icon">
                              <Plane size={18} />
                            </div>

                            <div>
                              <strong>
                                {trip.name}
                              </strong>

                              <span>
                                Trip #{trip.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="destination-cell">
                            <MapPin size={14} />
                            {trip.destination}
                          </div>
                        </td>

                        <td>
                          <div className="trip-date-cell">
                            <strong>
                              {formatDate(
                                trip.startDate
                              )}
                            </strong>

                            <span>
                              to{" "}
                              {formatDate(
                                trip.endDate
                              )}
                            </span>
                          </div>
                        </td>

                        <td>
                          <strong className="trip-price">
                            {formatCurrency(
                              trip.price
                            )}
                          </strong>
                        </td>

                        <td>
                          <div className="seats-cell">
                            <Users size={14} />
                            {trip.seats}
                          </div>
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              trip.status
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
                                  trip
                                )
                              }
                              title="View"
                              aria-label={`View ${trip.name}`}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="icon-action edit"
                              onClick={() =>
                                openEditModal(
                                  trip
                                )
                              }
                              title="Edit"
                              aria-label={`Edit ${trip.name}`}
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="icon-action delete"
                              onClick={() =>
                                handleDeleteClick(
                                  trip.id
                                )
                              }
                              title="Delete"
                              aria-label={`Delete ${trip.name}`}
                            >
                              <Trash2 size={16} />
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
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState
            title={
              hasActiveFilters
                ? "No trips found"
                : "No trips yet"
            }
            message={
              hasActiveFilters
                ? "Try changing your search or filters."
                : "Add your first trip to get started."
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
                  Add Trip
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
          editingTrip
            ? "Edit Trip"
            : "Add Trip"
        }
        size="large"
      >
        <form
          className="trip-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label htmlFor="trip-name">
                Trip Name
                <span>*</span>
              </label>

              <input
                id="trip-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g. Tokyo Cultural Experience"
                className={
                  errors.name
                    ? "input-error"
                    : ""
                }
              />

              {errors.name && (
                <small className="form-error">
                  {errors.name}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="trip-destination">
                Destination
                <span>*</span>
              </label>

              <select
                id="trip-destination"
                name="destination"
                value={formData.destination}
                onChange={handleFormChange}
                className={
                  errors.destination
                    ? "input-error"
                    : ""
                }
              >
                <option value="">
                  Select destination
                </option>

                {destinations.map(
                  (destination) => (
                    <option
                      key={destination.id}
                      value={destination.name}
                    >
                      {destination.name}
                    </option>
                  )
                )}
              </select>

              {errors.destination && (
                <small className="form-error">
                  {errors.destination}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="trip-status">
                Status
              </label>

              <select
                id="trip-status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="Upcoming">
                  Upcoming
                </option>
                <option value="Active">
                  Active
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="trip-start-date">
                Start Date
                <span>*</span>
              </label>

              <input
                id="trip-start-date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleFormChange}
                className={
                  errors.startDate
                    ? "input-error"
                    : ""
                }
              />

              {errors.startDate && (
                <small className="form-error">
                  {errors.startDate}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="trip-end-date">
                End Date
                <span>*</span>
              </label>

              <input
                id="trip-end-date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleFormChange}
                className={
                  errors.endDate
                    ? "input-error"
                    : ""
                }
              />

              {errors.endDate && (
                <small className="form-error">
                  {errors.endDate}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="trip-price">
                Price
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <IndianRupee size={15} />

                <input
                  id="trip-price"
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="75000"
                  className={
                    errors.price
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.price && (
                <small className="form-error">
                  {errors.price}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="trip-seats">
                Available Seats
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <Users size={15} />

                <input
                  id="trip-seats"
                  name="seats"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.seats}
                  onChange={handleFormChange}
                  placeholder="20"
                  className={
                    errors.seats
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.seats && (
                <small className="form-error">
                  {errors.seats}
                </small>
              )}
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
                editingTrip ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={16} />
                )
              }
            >
              {editingTrip
                ? "Update Trip"
                : "Add Trip"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={viewOpen}
        onClose={closeViewModal}
        title="Trip Details"
        size="medium"
      >
        {viewingTrip && (
          <div className="trip-view">
            <div className="trip-view-hero">
              <div className="trip-view-icon">
                <Plane size={30} />
              </div>

              <div>
                <span>TRAVEL PACKAGE</span>
                <h3>
                  {viewingTrip.name}
                </h3>
                <p>
                  <MapPin size={13} />
                  {viewingTrip.destination}
                </p>
              </div>

              <StatusBadge
                status={viewingTrip.status}
              />
            </div>

            <div className="trip-view-grid">
              <div className="trip-view-item">
                <CalendarDays size={17} />

                <div>
                  <span>Start Date</span>
                  <strong>
                    {formatDate(
                      viewingTrip.startDate
                    )}
                  </strong>
                </div>
              </div>

              <div className="trip-view-item">
                <CalendarDays size={17} />

                <div>
                  <span>End Date</span>
                  <strong>
                    {formatDate(
                      viewingTrip.endDate
                    )}
                  </strong>
                </div>
              </div>

              <div className="trip-view-item">
                <IndianRupee size={17} />

                <div>
                  <span>Package Price</span>
                  <strong>
                    {formatCurrency(
                      viewingTrip.price
                    )}
                  </strong>
                </div>
              </div>

              <div className="trip-view-item">
                <Users size={17} />

                <div>
                  <span>Available Seats</span>
                  <strong>
                    {viewingTrip.seats}
                  </strong>
                </div>
              </div>
            </div>

            <div className="trip-view-summary">
              <span>Trip ID</span>
              <strong>
                #{viewingTrip.id}
              </strong>
            </div>

            <div className="view-modal-actions">
              <Button
                variant="secondary"
                icon={<X size={16} />}
                onClick={closeViewModal}
              >
                Close
              </Button>

              <Button
                variant="primary"
                icon={<Pencil size={16} />}
                onClick={() => {
                  closeViewModal();
                  openEditModal(
                    viewingTrip
                  );
                }}
              >
                Edit Trip
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={
          deleteTargetId !== null
        }
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone."
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

export default Trips;