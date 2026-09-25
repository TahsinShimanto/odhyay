import "../styles/AdminHeader.css";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const AdminHeader = ({ onMenuClick }) => {
  const { user, signout } = useAuth();

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onMenuClick}
          aria-label="মেনু খুলুন"
        >
          <Menu size={20} />
        </button>
        <p className="admin-header-logo">অধ্যায়</p>
      </div>

      <div className="admin-header-right">
        <button type="button" className="admin-header-signout" onClick={signout}>
          <LogOut size={16} />
          <span>সাইন আউট</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
