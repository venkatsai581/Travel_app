import { useEffect, useMemo, useState } from "react";

import {
  Map,
  Globe2,
  CheckCircle2,
  CircleOff,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
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
  country: "",
  description: "",
  image: "",
  status: "Active"
};

function Destinations() {
  const {
    destinations,
    addDestination,
    updateDestination,
    deleteDestination
  } = useTravel();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [editingDestination, setEditingDestination] =
    useState(null);

  const [viewingDestination, setViewingDestination] =
    useState(null);

  const [deleteTargetId, setDeleteTargetId] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [errors, setErrors] = useState({});

  const [toast, setToast] = useState({
    message: "",
    type: "success"
  });

  const totalDestinations = destinations.length;

  const activeDestinations = destinations.filter(
    (destination) =>
      destination.status === "Active"
  ).length;

  const inactiveDestinations = destinations.filter(
    (destination) =>
      destination.status === "Inactive"
  ).length;

  const countryCount = new Set(
    destinations.map(
      (destination) => destination.country
    )
  ).size;

  const filteredDestinations = useMemo(() => {
    let result = [...destinations];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((destination) => {
        return (
          destination.name
            .toLowerCase()
            .includes(searchValue) ||
          destination.country
            .toLowerCase()
            .includes(searchValue) ||
          destination.description
            .toLowerCase()
            .includes(searchValue)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (destination) =>
          destination.status === statusFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === "country-asc") {
        return a.country.localeCompare(b.country);
      }

      if (sortBy === "country-desc") {
        return b.country.localeCompare(a.country);
      }

      return 0;
    });

    return result;
  }, [
    destinations,
    search,
    statusFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredDestinations.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedDestinations =
    filteredDestinations.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
    setEditingDestination(null);
    setFormData(emptyForm);
    setErrors({});
    setFormOpen(true);
  };

  const openEditModal = (destination) => {
    setEditingDestination(destination);

    setFormData({
      name: destination.name || "",
      country: destination.country || "",
      description:
        destination.description || "",
      image: destination.image || "",
      status: destination.status || "Active"
    });

    setErrors({});
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingDestination(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const openViewModal = (destination) => {
    setViewingDestination(destination);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setViewingDestination(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

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
        "Destination name is required.";
    } else if (
      formData.name.trim().length < 2
    ) {
      newErrors.name =
        "Destination name must contain at least 2 characters.";
    }

    if (!formData.country.trim()) {
      newErrors.country =
        "Country is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required.";
    } else if (
      formData.description.trim().length < 10
    ) {
      newErrors.description =
        "Description must contain at least 10 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    const cleanData = {
      name: formData.name.trim(),
      country: formData.country.trim(),
      description:
        formData.description.trim(),
      image: formData.image.trim(),
      status: formData.status
    };

    if (editingDestination) {
      updateDestination(
        editingDestination.id,
        cleanData
      );

      showToast(
        "Destination updated successfully."
      );
    } else {
      addDestination(cleanData);

      showToast(
        "Destination added successfully."
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

    deleteDestination(deleteTargetId);

    setDeleteTargetId(null);

    showToast(
      "Destination deleted successfully."
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSortBy("name-asc");
    setCurrentPage(1);
  };

  return (
    <div className="page destinations-page">
      <div className="page-header">
        <div>
          <h2>Destinations</h2>
          <p>
            Manage the destinations available
            for your travel packages.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={17} />}
          onClick={openAddModal}
        >
          Add Destination
        </Button>
      </div>

      <section className="destination-stats">
        <StatCard
          title="Total Destinations"
          value={totalDestinations}
          description="All available destinations"
          icon={<Map size={21} />}
        />

        <StatCard
          title="Active"
          value={activeDestinations}
          description="Currently available"
          icon={<CheckCircle2 size={21} />}
        />

        <StatCard
          title="Inactive"
          value={inactiveDestinations}
          description="Currently disabled"
          icon={<CircleOff size={21} />}
        />

        <StatCard
          title="Countries"
          value={countryCount}
          description="Unique countries"
          icon={<Globe2 size={21} />}
        />
      </section>

      <section className="destination-card">
        <FilterBar
          showReset={
            Boolean(search) ||
            statusFilter !== "All" ||
            sortBy !== "name-asc"
          }
          onReset={resetFilters}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search destinations..."
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
              All Status
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>

          <div className="sort-control">
            <ArrowUpDown size={15} />

            <select
              className="filter-select sort-select"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="name-asc">
                Name A-Z
              </option>
              <option value="name-desc">
                Name Z-A
              </option>
              <option value="country-asc">
                Country A-Z
              </option>
              <option value="country-desc">
                Country Z-A
              </option>
            </select>
          </div>
        </FilterBar>

        <div className="destination-result-info">
          <span>
            Showing{" "}
            <strong>
              {filteredDestinations.length}
            </strong>{" "}
            destination
            {filteredDestinations.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {paginatedDestinations.length > 0 ? (
          <>
            <div className="destination-table-wrapper">
              <table className="destination-table">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>Country</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedDestinations.map(
                    (destination) => (
                      <tr key={destination.id}>
                        <td>
                          <div className="destination-name-cell">
                            <div className="destination-thumbnail">
                              {destination.image ? (
                                <img
                                  src={
                                    destination.image
                                  }
                                  alt={
                                    destination.name
                                  }
                                />
                              ) : (
                                <Map size={19} />
                              )}
                            </div>

                            <div>
                              <strong>
                                {destination.name}
                              </strong>
                              <span>
                                Destination #
                                {destination.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {destination.country}
                        </td>

                        <td>
                          <span className="destination-description">
                            {destination.description}
                          </span>
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              destination.status
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
                                  destination
                                )
                              }
                              title="View"
                              aria-label={`View ${destination.name}`}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="icon-action edit"
                              onClick={() =>
                                openEditModal(
                                  destination
                                )
                              }
                              title="Edit"
                              aria-label={`Edit ${destination.name}`}
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="icon-action delete"
                              onClick={() =>
                                handleDeleteClick(
                                  destination.id
                                )
                              }
                              title="Delete"
                              aria-label={`Delete ${destination.name}`}
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
              search ||
              statusFilter !== "All"
                ? "No destinations found"
                : "No destinations yet"
            }
            message={
              search ||
              statusFilter !== "All"
                ? "Try changing your search or filters."
                : "Add your first destination to get started."
            }
            action={
              search ||
              statusFilter !== "All" ? (
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
                  Add Destination
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
          editingDestination
            ? "Edit Destination"
            : "Add Destination"
        }
        size="medium"
      >
        <form
          className="destination-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="destination-name">
                Destination Name
                <span>*</span>
              </label>

              <input
                id="destination-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g. Tokyo"
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
              <label htmlFor="destination-country">
                Country
                <span>*</span>
              </label>

              <input
                id="destination-country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleFormChange}
                placeholder="e.g. Japan"
                className={
                  errors.country
                    ? "input-error"
                    : ""
                }
              />

              {errors.country && (
                <small className="form-error">
                  {errors.country}
                </small>
              )}
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="destination-description">
                Description
                <span>*</span>
              </label>

              <textarea
                id="destination-description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe the destination..."
                rows="4"
                className={
                  errors.description
                    ? "input-error"
                    : ""
                }
              />

              {errors.description && (
                <small className="form-error">
                  {errors.description}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="destination-image">
                Image URL
              </label>

              <input
                id="destination-image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />

              <small className="form-help">
                Optional. Paste an image URL.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="destination-status">
                Status
              </label>

              <select
                id="destination-status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
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
                editingDestination ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={16} />
                )
              }
            >
              {editingDestination
                ? "Update Destination"
                : "Add Destination"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={viewOpen}
        onClose={closeViewModal}
        title="Destination Details"
        size="medium"
      >
        {viewingDestination && (
          <div className="destination-view">
            <div className="destination-view-image">
              {viewingDestination.image ? (
                <img
                  src={viewingDestination.image}
                  alt={viewingDestination.name}
                />
              ) : (
                <Map size={42} />
              )}
            </div>

            <div className="destination-view-header">
              <div>
                <span className="destination-view-label">
                  DESTINATION
                </span>

                <h3>
                  {viewingDestination.name}
                </h3>

                <p>
                  {viewingDestination.country}
                </p>
              </div>

              <StatusBadge
                status={
                  viewingDestination.status
                }
              />
            </div>

            <div className="destination-view-section">
              <span>Description</span>
              <p>
                {viewingDestination.description}
              </p>
            </div>

            <div className="destination-view-meta">
              <div>
                <span>Destination ID</span>
                <strong>
                  #{viewingDestination.id}
                </strong>
              </div>

              <div>
                <span>Country</span>
                <strong>
                  {viewingDestination.country}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {viewingDestination.status}
                </strong>
              </div>
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
                    viewingDestination
                  );
                }}
              >
                Edit Destination
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Destination"
        message="Are you sure you want to delete this destination? This action cannot be undone."
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

export default Destinations;