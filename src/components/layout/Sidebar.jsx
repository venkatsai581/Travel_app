import {
  LayoutDashboard,
  Map,
  Plane,
  Users,
  CalendarCheck,
  CreditCard,
  CalendarDays,
  BarChart3,
  X,
  Globe
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    label: "Destinations",
    path: "/destinations",
    icon: Map
  },
  {
    label: "Trips",
    path: "/trips",
    icon: Plane
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users
  },
  {
    label: "Bookings",
    path: "/bookings",
    icon: CalendarCheck
  },
  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: CalendarDays
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3
  }
];

function Sidebar({
  isOpen,
  onClose
}) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <Globe size={22} />
            </div>

            <div>
              <h1>Sai Travels</h1>
              <span>Booking Dashboard</span>
            </div>
          </div>

          <button
            className="mobile-close-button"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-navigation">
          {navigationItems.map(
            (item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  end={
                    item.path === "/"
                  }
                  className={({
                    isActive
                  }) =>
                    `sidebar-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >
                  <Icon size={19} />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            }
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-card">
            <div className="footer-globe">
              <Globe size={20} />
            </div>

            <div>
              <strong>
                Explore the world
              </strong>

              <span>
                Manage every journey
                easily.
              </span>
            </div>
          </div>

          <p className="sidebar-version">
            Venkat Travels Dashboard v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;