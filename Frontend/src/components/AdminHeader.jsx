import "../styles/AdminHeader.css";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog.jsx";

const AdminHeader = ({ onMenuClick }) => {
  const { signout } = useAuth();
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleConfirmSignout() {
    setSigningOut(true);
    try {
      await signout();
    } finally {
      setSigningOut(false);
      setShowSignoutConfirm(false);
    }
  }
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
        <button
          type="button"
          className="admin-header-signout"
          onClick={() => setShowSignoutConfirm(true)}
        >
          <LogOut size={16} />
          <span>সাইন আউট</span>
        </button>
      </div>

      {showSignoutConfirm && (
        <ConfirmDialog
          message="আপনি কি নিশ্চিত সাইন আউট করতে চান?"
          confirmLabel="সাইন আউট"
          busy={signingOut}
          onConfirm={handleConfirmSignout}
          onCancel={() => setShowSignoutConfirm(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;
