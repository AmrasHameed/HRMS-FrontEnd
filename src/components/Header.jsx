import { useState } from "react"
import { Menu } from "lucide-react"

export default function Header({ title, userEmail = "user@example.com", userName = "John Doe", onMenuClick }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-button" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="header-center">
          <h1>{title}</h1>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-button">
          <span className="icon">
            <img src="./mail.svg" alt="mail" />
          </span>
        </button>
        <button className="icon-button">
          <span className="icon">
            <img src="./notification.svg" alt="notification" />
          </span>
        </button>
        <div className="user-menu">
          <button className="user-avatar" onClick={() => setShowUserDropdown(!showUserDropdown)}>
            <img src="/placeholder.svg?height=32&width=32" alt="User" />
            <span className="dropdown-arrow">
              <img src="./dropdown.svg" alt="dropdown" />
            </span>
          </button>
          {showUserDropdown && (
            <div className="user-dropdown">
              <button className="dropdown-item">Edit Profile</button>
              <button className="dropdown-item">Change Password</button>
              <button className="dropdown-item">Manage Notifications</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: white;
          height: 45px;
          box-sizing: border-box;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-button:hover {
          background-color: #f3f4f6;
        }

        .header-center h1 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          line-height: 1;
        }

        .header-right {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 100%;
        }

        .icon-button {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 6px;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 40px;
        }

        .icon-button:hover {
          background-color: #f3f4f6;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20px;
          width: 20px;
        }

        .icon img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        .user-menu {
          position: relative;
          display: flex;
          align-items: center;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          height: 40px;
        }

        .user-avatar > img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e5e7eb;
          object-fit: cover;
        }

        .dropdown-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
        }

        .dropdown-arrow img {
          width: 12px;
          height: 12px;
          object-fit: contain;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 50;
          margin-top: 4px;
        }

        .user-info {
          padding: 12px 16px;
        }

        .user-name {
          font-weight: 500;
          margin: 0 0 4px 0;
          color: #1f2937;
        }

        .user-email {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .user-dropdown hr {
          margin: 0;
          border: none;
          border-top: 1px solid #e5e7eb;
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .header {
            padding: 12px 16px;
          }

          .mobile-menu-button {
            display: flex;
          }

          .header-center h1 {
            font-size: 18px;
          }

          .icon-button {
            padding: 6px;
            height: 36px;
            width: 36px;
          }

          .icon {
            height: 18px;
            width: 18px;
          }

          .icon img {
            width: 18px;
            height: 18px;
          }

          .user-dropdown {
            right: -8px;
            min-width: 180px;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 12px;
          }

          .header-right {
            gap: 8px;
          }

          .user-avatar > img {
            width: 28px;
            height: 28px;
          }

          .dropdown-arrow {
            display: none;
          }

          .icon-button {
            height: 32px;
            width: 32px;
          }

          .icon {
            height: 16px;
            width: 16px;
          }

          .icon img {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </header>
  )
}
