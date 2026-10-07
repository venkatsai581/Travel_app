import { useMemo, useState } from "react";

import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Globe2,
  Image as ImageIcon
} from "lucide-react";

import { useTravel } from "../context/TravelContext.jsx";

import Button from "../components/common/Button.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmationModal from "../components/common/ConfirmationModal.jsx";
import Toast from "../components/common/Toast.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

function Destinations() {
  const {
    destinations,
    addDestination,
    updateDestination,
    deleteDestination
  } = useTravel();

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isViewOpen, setIsViewOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [viewingDestination, setViewingDestination] =
    useState(null);

  const [deleteTargetId, setDeleteTargetId] =
    useState(null);

  const [toast, setToast] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      country: "",
      description: "",
      image: "",
      status: "Active"
    });

  const [errors, setErrors] =
    useState({});

  const filteredDestinations =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return destinations;
      }

      return destinations.filter(
        (destination) =>
          destination.name
            .toLowerCase()
            .includes(value) ||
          destination.country
            .toLowerCase()
            .includes(value) ||
          destination.description
            .toLowerCase()
            .includes(value)
      );
    }, [destinations, search]);

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      name: "",
      country: "",
      description: "",
      image: "",
      status: "Active"
    });

    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (
    destination
  ) => {
    setEditingId(destination.id);

    setFormData({
      name: destination.name || "",
      country: destination.country || "",
      description:
        destination.description || "",
      image: destination.image || "",
      status:
        destination.status || "Active"
    });

    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setErrors({});
  };

  const openViewModal = (
    destination
  ) => {
    setViewingDestination(
      destination
    );

    setIsViewOpen(true);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name =
        "Destination name is required.";
    }

    if (!formData.country.trim()) {
      nextErrors.country =
        "Country is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description =
        "Description is required.";
    }

    if (
      formData.image.trim() &&
      !isValidUrl(formData.image.trim())
    ) {
      nextErrors.image =
        "Enter a valid image URL.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      ...formData,
      image:
        formData.image.trim() ||
        getDefaultDestinationImage(
          formData.name
        )
    };

    if (editingId !== null) {
      updateDestination(
        editingId,
        data
      );

      showToast(
        "Destination updated successfully.",
        "success"
      );
    } else {
      addDestination(data);

      showToast(
        "Destination added successfully.",
        "success"
      );
    }

    closeModal();
  };

  const confirmDelete = () => {
    if (deleteTargetId === null) {
      return;
    }

    deleteDestination(
      deleteTargetId
    );

    setDeleteTargetId(null);

    showToast(
      "Destination deleted successfully.",
      "success"
    );
  };

  const showToast = (
    message,
    type
  ) => {
    setToast({
      id: Date.now(),
      message,
      type
    });
  };

  return (
    <div className="page destinations-page">
      <div className="page-header destination-page-header">
        <div>
          <div className="destination-title-row">
            <div className="destination-title-icon">
              <Globe2 size={22} />
            </div>

            <div>
              <h2>
                Destinations
              </h2>

              <p>
                Explore and manage your
                travel destinations.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={17} />}
          onClick={openAddModal}
        >
          Add Destination
        </Button>
      </div>

      <div className="destination-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search destinations..."
        />

        <div className="destination-count">
          <MapPin size={16} />

          <span>
            {filteredDestinations.length}{" "}
            destination
            {filteredDestinations.length !==
            1
              ? "s"
              : ""}
          </span>
        </div>
      </div>

      {filteredDestinations.length ===
      0 ? (
        <EmptyState
          title="No destinations found"
          description={
            search
              ? "Try changing your search."
              : "Add your first travel destination."
          }
          action={
            !search ? (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={
                  openAddModal
                }
              >
                Add Destination
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="destination-card-grid">
          {filteredDestinations.map(
            (destination) => (
              <article
                className="destination-card"
                key={destination.id}
              >
                <div className="destination-image-wrapper">
                  {destination.image ? (
                    <img
                      src={
                        destination.image
                      }
                      alt={`${destination.name} travel destination`}
                      className="destination-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="destination-image-placeholder">
                      <ImageIcon
                        size={34}
                      />

                      <span>
                        No image
                      </span>
                    </div>
                  )}

                  <div className="destination-image-overlay" />

                  <div className="destination-card-status">
                    <StatusBadge
                      status={
                        destination.status
                      }
                    />
                  </div>

                  <div className="destination-location">
                    <MapPin size={14} />

                    <span>
                      {
                        destination.country
                      }
                    </span>
                  </div>
                </div>

                <div className="destination-card-content">
                  <div className="destination-card-heading">
                    <div>
                      <h3>
                        {
                          destination.name
                        }
                      </h3>

                      <span>
                        {
                          destination.country
                        }
                      </span>
                    </div>
                  </div>

                  <p>
                    {
                      destination.description
                    }
                  </p>

                  <div className="destination-card-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      icon={
                        <Eye size={15} />
                      }
                      onClick={() =>
                        openViewModal(
                          destination
                        )
                      }
                    >
                      View
                    </Button>

                    <Button
                      variant="secondary"
                      size="small"
                      icon={
                        <Pencil size={15} />
                      }
                      onClick={() =>
                        openEditModal(
                          destination
                        )
                      }
                    >
                      Edit
                    </Button>

                    <button
                      type="button"
                      className="destination-delete-button"
                      aria-label={`Delete ${destination.name}`}
                      onClick={() =>
                        setDeleteTargetId(
                          destination.id
                        )
                      }
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingId !== null
            ? "Edit Destination"
            : "Add Destination"
        }
        size="medium"
      >
        <form
          className="destination-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="destination-name">
                Destination Name
              </label>

              <input
                id="destination-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dubai"
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
              </label>

              <input
                id="destination-country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. United Arab Emirates"
              />

              {errors.country && (
                <small className="form-error">
                  {errors.country}
                </small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="destination-description">
              Description
            </label>

            <textarea
              id="destination-description"
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              rows="4"
              placeholder="Describe this destination..."
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
              onChange={handleChange}
              placeholder="https://..."
            />

            <small className="form-help">
              Leave empty to use a
              default destination image.
            </small>

            {errors.image && (
              <small className="form-error">
                {errors.image}
              </small>
            )}
          </div>

          {formData.image && (
            <div className="destination-form-preview">
              <img
                src={formData.image}
                alt="Destination preview"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="destination-status">
              Status
            </label>

            <select
              id="destination-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              {editingId !== null
                ? "Update Destination"
                : "Add Destination"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewOpen}
        onClose={() =>
          setIsViewOpen(false)
        }
        title="Destination Details"
        size="medium"
      >
        {viewingDestination && (
          <div className="destination-view">
            <div className="destination-view-image">
              {viewingDestination.image ? (
                <img
                  src={
                    viewingDestination.image
                  }
                  alt={
                    viewingDestination.name
                  }
                />
              ) : (
                <ImageIcon
                  size={42}
                />
              )}
            </div>

            <div className="destination-view-content">
              <div className="destination-view-title">
                <div>
                  <h3>
                    {
                      viewingDestination.name
                    }
                  </h3>

                  <span>
                    <MapPin
                      size={14}
                    />

                    {
                      viewingDestination.country
                    }
                  </span>
                </div>

                <StatusBadge
                  status={
                    viewingDestination.status
                  }
                />
              </div>

              <p>
                {
                  viewingDestination.description
                }
              </p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={
          deleteTargetId !== null
        }
        onClose={() =>
          setDeleteTargetId(null)
        }
        onConfirm={confirmDelete}
        title="Delete Destination?"
        message="Are you sure you want to delete this destination? This action cannot be undone."
        confirmText="Delete"
      />

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast(null)
          }
        />
      )}
    </div>
  );
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function getDefaultDestinationImage(
  name
) {
  const images = {
    Dubai:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",

    Bali:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",

    Paris:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",

    Maldives:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",

    Singapore:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85",

    Switzerland:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85"
  };

  return (
    images[name] ||
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85"
  );
}

export default Destinations;