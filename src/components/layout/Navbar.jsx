import {
  Menu,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";

function Navbar({
  onMenuClick
}) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={23} />
        </button>

        <div className="navbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search anything..."
          />
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="notification-dot" />
        </button>

        <div className="navbar-divider" />

        <button className="profile-button">
          <div className="profile-avatar">
            VK
          </div>

          <div className="profile-info">
            <strong>
              Travel Admin
            </strong>

            <span>
              Administrator
            </span>
          </div>

          <ChevronDown size={17} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;