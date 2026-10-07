import { useEffect, useMemo, useState } from "react";

import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  IndianRupee,
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
  name: "",
  email: "",
  phone: "",
  city: "",
  status: "Active"
};

function Customers() {
  const {
    customers,
    bookings,
    addCustomer,
    updateCustomer,
    deleteCustomer
  } = useTravel();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [cityFilter, setCityFilter] =
    useState("All");
  const [sortBy, setSortBy] =
    useState("name-asc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [formOpen, setFormOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [viewingCustomer, setViewingCustomer] =
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

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Active"
    ).length;

  const inactiveCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Inactive"
    ).length;

  const newCustomers =
    customers.filter((customer) => {
      const customerBookings =
        bookings.filter(
          (booking) =>
            booking.customer ===
            customer.name
        );

      return customerBookings.length === 0;
    }).length;

  const cities = useMemo(() => {
    return [
      ...new Set(
        customers
          .map((customer) => customer.city)
          .filter(Boolean)
      )
    ].sort();
  }, [customers]);

  const getCustomerBookings = (
    customerName
  ) => {
    return bookings.filter(
      (booking) =>
        booking.customer ===
        customerName
    );
  };

  const getCustomerTotal = (
    customerName
  ) => {
    return getCustomerBookings(
      customerName
    ).reduce(
      (total, booking) =>
        total + Number(booking.amount || 0),
      0
    );
  };

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (customer) =>
          customer.name
            .toLowerCase()
            .includes(searchValue) ||
          customer.email
            .toLowerCase()
            .includes(searchValue) ||
          customer.phone
            .toLowerCase()
            .includes(searchValue) ||
          customer.city
            .toLowerCase()
            .includes(searchValue)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (customer) =>
          customer.status ===
          statusFilter
      );
    }

    if (cityFilter !== "All") {
      result = result.filter(
        (customer) =>
          customer.city === cityFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(
          b.name
        );
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(
          a.name
        );
      }

      if (sortBy === "city-asc") {
        return a.city.localeCompare(
          b.city
        );
      }

      if (sortBy === "city-desc") {
        return b.city.localeCompare(
          a.city
        );
      }

      if (sortBy === "bookings-high") {
        return (
          getCustomerBookings(b.name)
            .length -
          getCustomerBookings(a.name)
            .length
        );
      }

      if (sortBy === "spending-high") {
        return (
          getCustomerTotal(b.name) -
          getCustomerTotal(a.name)
        );
      }

      return 0;
    });

    return result;
  }, [
    customers,
    bookings,
    search,
    statusFilter,
    cityFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCustomers.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedCustomers =
    filteredCustomers.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    cityFilter,
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
    setEditingCustomer(null);
    setFormData(emptyForm);
    setErrors({});
    setFormOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      city: customer.city || "",
      status:
        customer.status || "Active"
    });

    setErrors({});
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingCustomer(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const openViewModal = (customer) => {
    setViewingCustomer(customer);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setViewingCustomer(null);
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
        "Customer name is required.";
    } else if (
      formData.name.trim().length < 3
    ) {
      newErrors.name =
        "Name must contain at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[+]?[0-9\s-]{10,15}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone =
        "Enter a valid phone number.";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "City is required.";
    } else if (
      formData.city.trim().length < 2
    ) {
      newErrors.city =
        "Enter a valid city.";
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
      email:
        formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      status: formData.status
    };

    if (editingCustomer) {
      updateCustomer(
        editingCustomer.id,
        cleanData
      );

      showToast(
        "Customer updated successfully."
      );
    } else {
      addCustomer(cleanData);

      showToast(
        "Customer added successfully."
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

    deleteCustomer(deleteTargetId);

    setDeleteTargetId(null);

    showToast(
      "Customer deleted successfully."
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCityFilter("All");
    setSortBy("name-asc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "All" ||
    cityFilter !== "All" ||
    sortBy !== "name-asc";

  return (
    <div className="page customers-page">
      <div className="page-header">
        <div>
          <h2>Customers</h2>

          <p>
            Manage travelers, customer
            information and booking activity.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={17} />}
          onClick={openAddModal}
        >
          Add Customer
        </Button>
      </div>

      <section className="customer-stats">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          description="All registered customers"
          icon={<Users size={21} />}
        />

        <StatCard
          title="Active"
          value={activeCustomers}
          description="Active customers"
          icon={<UserCheck size={21} />}
        />

        <StatCard
          title="Inactive"
          value={inactiveCustomers}
          description="Inactive customers"
          icon={<UserX size={21} />}
        />

        <StatCard
          title="New Customers"
          value={newCustomers}
          description="No bookings yet"
          icon={<UserPlus size={21} />}
        />
      </section>

      <section className="customer-card">
        <FilterBar
          showReset={hasActiveFilters}
          onReset={resetFilters}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search customers..."
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

          <select
            className="filter-select"
            value={cityFilter}
            onChange={(event) =>
              setCityFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Cities
            </option>

            {cities.map((city) => (
              <option
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </select>
        </FilterBar>

        <div className="customer-sort-row">
          <div className="customer-result-info">
            Showing{" "}
            <strong>
              {filteredCustomers.length}
            </strong>{" "}
            customer
            {filteredCustomers.length !== 1
              ? "s"
              : ""}
          </div>

          <div className="customer-sort">
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
              <option value="name-asc">
                Name A-Z
              </option>

              <option value="name-desc">
                Name Z-A
              </option>

              <option value="city-asc">
                City A-Z
              </option>

              <option value="city-desc">
                City Z-A
              </option>

              <option value="bookings-high">
                Most Bookings
              </option>

              <option value="spending-high">
                Highest Spending
              </option>
            </select>
          </div>
        </div>

        {paginatedCustomers.length > 0 ? (
          <>
            <div className="customer-table-wrapper">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>City</th>
                    <th>Bookings</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCustomers.map(
                    (customer) => {
                      const customerBookings =
                        getCustomerBookings(
                          customer.name
                        );

                      const totalSpent =
                        getCustomerTotal(
                          customer.name
                        );

                      return (
                        <tr
                          key={
                            customer.id
                          }
                        >
                          <td>
                            <div className="customer-name-cell">
                              <div className="customer-avatar">
                                {getInitials(
                                  customer.name
                                )}
                              </div>

                              <div>
                                <strong>
                                  {
                                    customer.name
                                  }
                                </strong>

                                <span>
                                  Customer #
                                  {
                                    customer.id
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="customer-contact-cell">
                              <span>
                                <Mail
                                  size={13}
                                />
                                {
                                  customer.email
                                }
                              </span>

                              <span>
                                <Phone
                                  size={13}
                                />
                                {
                                  customer.phone
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="customer-city-cell">
                              <MapPin
                                size={14}
                              />

                              {
                                customer.city
                              }
                            </div>
                          </td>

                          <td>
                            <strong>
                              {
                                customerBookings.length
                              }
                            </strong>
                          </td>

                          <td>
                            <strong className="customer-spending">
                              {formatCurrency(
                                totalSpent
                              )}
                            </strong>
                          </td>

                          <td>
                            <StatusBadge
                              status={
                                customer.status
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
                                    customer
                                  )
                                }
                                title="View"
                                aria-label={`View ${customer.name}`}
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
                                    customer
                                  )
                                }
                                title="Edit"
                                aria-label={`Edit ${customer.name}`}
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
                                    customer.id
                                  )
                                }
                                title="Delete"
                                aria-label={`Delete ${customer.name}`}
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
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
                ? "No customers found"
                : "No customers yet"
            }
            message={
              hasActiveFilters
                ? "Try changing your search or filters."
                : "Add your first customer to get started."
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
                  onClick={
                    openAddModal
                  }
                >
                  Add Customer
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
          editingCustomer
            ? "Edit Customer"
            : "Add Customer"
        }
        size="medium"
      >
        <form
          className="customer-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label htmlFor="customer-name">
                Full Name
                <span>*</span>
              </label>

              <input
                id="customer-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g. Rahul Sharma"
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
              <label htmlFor="customer-email">
                Email
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <Mail size={15} />

                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="customer@example.com"
                  className={
                    errors.email
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.email && (
                <small className="form-error">
                  {errors.email}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer-phone">
                Phone
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <Phone size={15} />

                <input
                  id="customer-phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+91 9876543210"
                  className={
                    errors.phone
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.phone && (
                <small className="form-error">
                  {errors.phone}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer-city">
                City
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <MapPin size={15} />

                <input
                  id="customer-city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleFormChange}
                  placeholder="e.g. Hyderabad"
                  className={
                    errors.city
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.city && (
                <small className="form-error">
                  {errors.city}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer-status">
                Status
              </label>

              <select
                id="customer-status"
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
                editingCustomer ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={16} />
                )
              }
            >
              {editingCustomer
                ? "Update Customer"
                : "Add Customer"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={viewOpen}
        onClose={closeViewModal}
        title="Customer Details"
        size="medium"
      >
        {viewingCustomer && (
          <CustomerDetails
            customer={viewingCustomer}
            bookings={getCustomerBookings(
              viewingCustomer.name
            )}
            totalSpent={getCustomerTotal(
              viewingCustomer.name
            )}
            onClose={closeViewModal}
            onEdit={() => {
              closeViewModal();
              openEditModal(
                viewingCustomer
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
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

function CustomerDetails({
  customer,
  bookings,
  totalSpent,
  onClose,
  onEdit
}) {
  return (
    <div className="customer-view">
      <div className="customer-view-header">
        <div className="customer-view-avatar">
          {getInitials(customer.name)}
        </div>

        <div className="customer-view-title">
          <span>CUSTOMER PROFILE</span>

          <h3>{customer.name}</h3>

          <div className="customer-view-location">
            <MapPin size={13} />
            {customer.city}
          </div>
        </div>

        <StatusBadge
          status={customer.status}
        />
      </div>

      <div className="customer-view-contact">
        <div className="customer-view-item">
          <Mail size={17} />

          <div>
            <span>Email</span>
            <strong>
              {customer.email}
            </strong>
          </div>
        </div>

        <div className="customer-view-item">
          <Phone size={17} />

          <div>
            <span>Phone</span>
            <strong>
              {customer.phone}
            </strong>
          </div>
        </div>
      </div>

      <div className="customer-view-stats">
        <div>
          <CalendarDays size={18} />

          <span>Total Bookings</span>

          <strong>
            {bookings.length}
          </strong>
        </div>

        <div>
          <IndianRupee size={18} />

          <span>Total Spent</span>

          <strong>
            {formatCurrency(totalSpent)}
          </strong>
        </div>
      </div>

      <div className="customer-view-summary">
        <span>Customer ID</span>

        <strong>
          #{customer.id}
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
          Edit Customer
        </Button>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) {
    return "CU";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
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

export default Customers;