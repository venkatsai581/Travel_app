import { useEffect, useMemo, useState } from "react";

import {
  CreditCard,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  Plus,
  Eye,
  Pencil,
  Trash2,
  UserRound,
  Plane,
  CalendarDays,
  IndianRupee,
  ReceiptText,
  X,
  ArrowUpDown,
  Hash
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
  bookingId: "",
  paymentDate: "",
  amount: "",
  method: "UPI",
  status: "Pending",
  reference: ""
};

const paymentMethods = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Cash"
];

function Payments() {
  const {
    payments,
    bookings,
    addPayment,
    updatePayment,
    deletePayment
  } = useTravel();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [methodFilter, setMethodFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("date-desc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [formOpen, setFormOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editingPayment, setEditingPayment] =
    useState(null);

  const [viewingPayment, setViewingPayment] =
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

  const totalPayments =
    payments.length;

  const paidPayments =
    payments.filter(
      (payment) =>
        payment.status === "Paid"
    ).length;

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status === "Pending"
    ).length;

  const partialPayments =
    payments.filter(
      (payment) =>
        payment.status === "Partial"
    ).length;

  const totalPaidAmount =
    payments
      .filter(
        (payment) =>
          payment.status === "Paid"
      )
      .reduce(
        (total, payment) =>
          total +
          Number(payment.amount || 0),
        0
      );

  const selectedBooking =
    bookings.find(
      (booking) =>
        booking.bookingId ===
        formData.bookingId
    );

  const availableBookings = useMemo(() => {
    if (editingPayment) {
      return bookings;
    }

    return bookings;
  }, [bookings, editingPayment]);

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (payment) =>
          payment.transactionId
            .toLowerCase()
            .includes(searchValue) ||
          payment.bookingId
            .toLowerCase()
            .includes(searchValue) ||
          payment.customer
            .toLowerCase()
            .includes(searchValue) ||
          payment.trip
            .toLowerCase()
            .includes(searchValue) ||
          payment.reference
            .toLowerCase()
            .includes(searchValue)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (payment) =>
          payment.status ===
          statusFilter
      );
    }

    if (methodFilter !== "All") {
      result = result.filter(
        (payment) =>
          payment.method ===
          methodFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date-asc") {
        return a.paymentDate.localeCompare(
          b.paymentDate
        );
      }

      if (sortBy === "date-desc") {
        return b.paymentDate.localeCompare(
          a.paymentDate
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

      if (sortBy === "customer-asc") {
        return a.customer.localeCompare(
          b.customer
        );
      }

      if (sortBy === "customer-desc") {
        return b.customer.localeCompare(
          a.customer
        );
      }

      return 0;
    });

    return result;
  }, [
    payments,
    search,
    statusFilter,
    methodFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPayments.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedPayments =
    filteredPayments.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    methodFilter,
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
    setEditingPayment(null);

    setFormData({
      ...emptyForm,
      paymentDate:
        new Date()
          .toISOString()
          .split("T")[0]
    });

    setErrors({});
    setFormOpen(true);
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);

    setFormData({
      bookingId:
        payment.bookingId || "",
      paymentDate:
        payment.paymentDate || "",
      amount:
        payment.amount !== undefined
          ? String(payment.amount)
          : "",
      method:
        payment.method || "UPI",
      status:
        payment.status || "Pending",
      reference:
        payment.reference || ""
    });

    setErrors({});
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingPayment(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const openViewModal = (payment) => {
    setViewingPayment(payment);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setViewingPayment(null);
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

    if (name === "bookingId") {
      const booking =
        bookings.find(
          (item) =>
            item.bookingId ===
            value
        );

      setFormData((current) => ({
        ...current,
        bookingId: value,
        amount:
          booking && !editingPayment
            ? String(
                booking.amount || ""
              )
            : current.amount
      }));

      setErrors((current) => ({
        ...current,
        bookingId: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bookingId) {
      newErrors.bookingId =
        "Booking is required.";
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate =
        "Payment date is required.";
    }

    if (formData.amount === "") {
      newErrors.amount =
        "Amount is required.";
    } else if (
      Number(formData.amount) <= 0
    ) {
      newErrors.amount =
        "Amount must be greater than 0.";
    }

    if (!formData.method) {
      newErrors.method =
        "Payment method is required.";
    }

    if (!formData.status) {
      newErrors.status =
        "Payment status is required.";
    }

    if (!formData.reference.trim()) {
      newErrors.reference =
        "Transaction reference is required.";
    } else if (
      formData.reference.trim().length < 4
    ) {
      newErrors.reference =
        "Reference must contain at least 4 characters.";
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

    const booking =
      bookings.find(
        (item) =>
          item.bookingId ===
          formData.bookingId
      );

    const cleanData = {
      bookingId:
        formData.bookingId,

      customer:
        booking?.customer || "",

      trip:
        booking?.trip || "",

      paymentDate:
        formData.paymentDate,

      amount:
        Number(formData.amount),

      method:
        formData.method,

      status:
        formData.status,

      reference:
        formData.reference.trim()
    };

    if (editingPayment) {
      updatePayment(
        editingPayment.id,
        cleanData
      );

      showToast(
        "Payment updated successfully."
      );
    } else {
      addPayment(cleanData);

      showToast(
        "Payment added successfully."
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

    deletePayment(deleteTargetId);

    setDeleteTargetId(null);

    showToast(
      "Payment deleted successfully."
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "All" ||
    methodFilter !== "All" ||
    sortBy !== "date-desc";

  return (
    <div className="page payments-page">
      <div className="page-header">
        <div>
          <h2>Payments</h2>

          <p>
            Track transactions, payment
            methods and payment status.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={17} />}
          onClick={openAddModal}
        >
          Add Payment
        </Button>
      </div>

      <section className="payment-stats">
        <StatCard
          title="Total Payments"
          value={totalPayments}
          description="All transactions"
          icon={
            <ReceiptText
              size={21}
            />
          }
        />

        <StatCard
          title="Paid"
          value={paidPayments}
          description={formatCurrency(
            totalPaidAmount
          )}
          icon={
            <CheckCircle2
              size={21}
            />
          }
        />

        <StatCard
          title="Pending"
          value={pendingPayments}
          description="Awaiting payment"
          icon={<Clock3 size={21} />}
        />

        <StatCard
          title="Partial"
          value={partialPayments}
          description="Partially paid"
          icon={
            <CircleDollarSign
              size={21}
            />
          }
        />
      </section>

      <section className="payment-card">
        <FilterBar
          showReset={hasActiveFilters}
          onReset={resetFilters}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search payments..."
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
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Methods
            </option>

            {paymentMethods.map(
              (method) => (
                <option
                  key={method}
                  value={method}
                >
                  {method}
                </option>
              )
            )}
          </select>
        </FilterBar>

        <div className="payment-sort-row">
          <div className="payment-result-info">
            Showing{" "}
            <strong>
              {filteredPayments.length}
            </strong>{" "}
            payment
            {filteredPayments.length !==
            1
              ? "s"
              : ""}
          </div>

          <div className="payment-sort">
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
                Date: Latest
              </option>

              <option value="date-asc">
                Date: Earliest
              </option>

              <option value="amount-high">
                Amount: High to Low
              </option>

              <option value="amount-low">
                Amount: Low to High
              </option>

              <option value="customer-asc">
                Customer A-Z
              </option>

              <option value="customer-desc">
                Customer Z-A
              </option>
            </select>
          </div>
        </div>

        {paginatedPayments.length > 0 ? (
          <>
            <div className="payment-table-wrapper">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Booking</th>
                    <th>Customer</th>
                    <th>Payment Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPayments.map(
                    (payment) => (
                      <tr
                        key={payment.id}
                      >
                        <td>
                          <div className="payment-id-cell">
                            <div className="payment-icon">
                              <CreditCard
                                size={17}
                              />
                            </div>

                            <div>
                              <strong>
                                {
                                  payment.transactionId
                                }
                              </strong>

                              <span>
                                Ref:{" "}
                                {
                                  payment.reference
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="payment-booking-cell">
                            <strong>
                              {
                                payment.bookingId
                              }
                            </strong>

                            <span>
                              {
                                payment.trip
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="payment-customer-cell">
                            <UserRound
                              size={14}
                            />

                            {
                              payment.customer
                            }
                          </div>
                        </td>

                        <td>
                          <div className="payment-date-cell">
                            <CalendarDays
                              size={14}
                            />

                            {formatDate(
                              payment.paymentDate
                            )}
                          </div>
                        </td>

                        <td>
                          <strong className="payment-amount">
                            {formatCurrency(
                              payment.amount
                            )}
                          </strong>
                        </td>

                        <td>
                          <span className="payment-method">
                            {
                              payment.method
                            }
                          </span>
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              payment.status
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
                                  payment
                                )
                              }
                              title="View"
                              aria-label={`View ${payment.transactionId}`}
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
                                  payment
                                )
                              }
                              title="Edit"
                              aria-label={`Edit ${payment.transactionId}`}
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
                                  payment.id
                                )
                              }
                              title="Delete"
                              aria-label={`Delete ${payment.transactionId}`}
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
                ? "No payments found"
                : "No payments yet"
            }
            message={
              hasActiveFilters
                ? "Try changing your search or filters."
                : "Add your first payment to get started."
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
                  Add Payment
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
          editingPayment
            ? "Edit Payment"
            : "Add Payment"
        }
        size="large"
      >
        <form
          className="payment-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label htmlFor="payment-booking">
                Booking
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <ReceiptText size={15} />

                <select
                  id="payment-booking"
                  name="bookingId"
                  value={
                    formData.bookingId
                  }
                  onChange={
                    handleFormChange
                  }
                  className={
                    errors.bookingId
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="">
                    Select booking
                  </option>

                  {availableBookings.map(
                    (booking) => (
                      <option
                        key={booking.id}
                        value={
                          booking.bookingId
                        }
                      >
                        {booking.bookingId} —{" "}
                        {booking.customer} —{" "}
                        {booking.trip}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.bookingId && (
                <small className="form-error">
                  {errors.bookingId}
                </small>
              )}

              {selectedBooking && (
                <small className="form-hint">
                  Booking amount:{" "}
                  {formatCurrency(
                    selectedBooking.amount
                  )}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="payment-date">
                Payment Date
                <span>*</span>
              </label>

              <input
                id="payment-date"
                name="paymentDate"
                type="date"
                value={
                  formData.paymentDate
                }
                onChange={
                  handleFormChange
                }
                className={
                  errors.paymentDate
                    ? "input-error"
                    : ""
                }
              />

              {errors.paymentDate && (
                <small className="form-error">
                  {errors.paymentDate}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="payment-amount">
                Amount
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <IndianRupee size={15} />

                <input
                  id="payment-amount"
                  name="amount"
                  type="number"
                  min="1"
                  value={
                    formData.amount
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="85000"
                  className={
                    errors.amount
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.amount && (
                <small className="form-error">
                  {errors.amount}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="payment-method">
                Payment Method
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <CreditCard size={15} />

                <select
                  id="payment-method"
                  name="method"
                  value={
                    formData.method
                  }
                  onChange={
                    handleFormChange
                  }
                >
                  {paymentMethods.map(
                    (method) => (
                      <option
                        key={method}
                        value={method}
                      >
                        {method}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.method && (
                <small className="form-error">
                  {errors.method}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="payment-status">
                Payment Status
                <span>*</span>
              </label>

              <select
                id="payment-status"
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleFormChange
                }
                className={
                  errors.status
                    ? "input-error"
                    : ""
                }
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

              {errors.status && (
                <small className="form-error">
                  {errors.status}
                </small>
              )}
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="payment-reference">
                Transaction Reference
                <span>*</span>
              </label>

              <div className="form-input-with-icon">
                <Hash size={15} />

                <input
                  id="payment-reference"
                  name="reference"
                  type="text"
                  value={
                    formData.reference
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="e.g. UPI-785421"
                  className={
                    errors.reference
                      ? "input-error"
                      : ""
                  }
                />
              </div>

              {errors.reference && (
                <small className="form-error">
                  {errors.reference}
                </small>
              )}
            </div>
          </div>

          {selectedBooking && (
            <div className="payment-preview">
              <div>
                <span>Customer</span>

                <strong>
                  {
                    selectedBooking.customer
                  }
                </strong>
              </div>

              <div>
                <span>Trip</span>

                <strong>
                  {selectedBooking.trip}
                </strong>
              </div>

              <div>
                <span>Booking Amount</span>

                <strong>
                  {formatCurrency(
                    selectedBooking.amount
                  )}
                </strong>
              </div>

              <div className="payment-preview-total">
                <span>Payment</span>

                <strong>
                  {formatCurrency(
                    formData.amount
                  )}
                </strong>
              </div>
            </div>
          )}

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
                editingPayment ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={16} />
                )
              }
            >
              {editingPayment
                ? "Update Payment"
                : "Add Payment"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={viewOpen}
        onClose={closeViewModal}
        title="Payment Details"
        size="medium"
      >
        {viewingPayment && (
          <PaymentDetails
            payment={viewingPayment}
            onClose={closeViewModal}
            onEdit={() => {
              closeViewModal();

              openEditModal(
                viewingPayment
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
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
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

function PaymentDetails({
  payment,
  onClose,
  onEdit
}) {
  return (
    <div className="payment-view">
      <div className="payment-view-header">
        <div className="payment-view-icon">
          <CreditCard size={28} />
        </div>

        <div className="payment-view-title">
          <span>TRANSACTION</span>

          <h3>
            {payment.transactionId}
          </h3>

          <p>
            {payment.bookingId}
          </p>
        </div>

        <StatusBadge
          status={payment.status}
        />
      </div>

      <div className="payment-view-amount">
        <span>Payment Amount</span>

        <strong>
          {formatCurrency(
            payment.amount
          )}
        </strong>
      </div>

      <div className="payment-view-grid">
        <div className="payment-view-item">
          <UserRound size={17} />

          <div>
            <span>Customer</span>

            <strong>
              {payment.customer}
            </strong>
          </div>
        </div>

        <div className="payment-view-item">
          <Plane size={17} />

          <div>
            <span>Trip</span>

            <strong>
              {payment.trip}
            </strong>
          </div>
        </div>

        <div className="payment-view-item">
          <CalendarDays size={17} />

          <div>
            <span>Payment Date</span>

            <strong>
              {formatDate(
                payment.paymentDate
              )}
            </strong>
          </div>
        </div>

        <div className="payment-view-item">
          <CreditCard size={17} />

          <div>
            <span>Payment Method</span>

            <strong>
              {payment.method}
            </strong>
          </div>
        </div>
      </div>

      <div className="payment-reference">
        <Hash size={16} />

        <div>
          <span>Transaction Reference</span>

          <strong>
            {payment.reference}
          </strong>
        </div>
      </div>

      <div className="payment-booking-summary">
        <span>Booking ID</span>

        <strong>
          {payment.bookingId}
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
          Edit Payment
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

export default Payments;