import "../styles/AdminSidebar.css";
import { NavLink } from "react-router";
import { LayoutDashboard, FileQuestion, ListTree, X } from "lucide-react";

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <div>
      {isOpen && <div className="admin-sidebar-backdrop" onClick={onClose}></div>}

      <div className={isOpen ? "admin-sidebar open" : "admin-sidebar"}>
        <div className="admin-sidebar-header">
          {isOpen ? (<p className="admin-sidebar-logo"> অধ্যায়</p>) : null}
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="মেনু বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>
        <p className="admin-panel-text">অ্যডমিন প্যানেল</p>
        <div className="divider"></div>

        <div className="admin-sidebar-nav">
          <NavLink
            to="/admin"
            end
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "admin-nav-item active" : "admin-nav-item"
            }
          >
            <LayoutDashboard size={18} />
            <span>ড্যাশবোর্ড</span>
          </NavLink>

          <NavLink
            to="/admin/questions"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "admin-nav-item active" : "admin-nav-item"
            }
          >
            <FileQuestion size={18} />
            <span>প্রশ্ন ব্যবস্থাপনা</span>
          </NavLink>

          <NavLink
            to="/admin/taxonomy"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "admin-nav-item active" : "admin-nav-item"
            }
          >
            <ListTree size={18} />
            <span>ট্যাক্সোনমি ব্যবস্থাপনা</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
