export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log Out</h2>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to log out?</p>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="logout-button" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 1000px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          background: #4d007d;
          color: white;
          padding: 16px 24px;
          text-align: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .modal-body {
          padding: 32px 24px;
          text-align: center;
        }

        .modal-body p {
          margin: 0;
          font-size: 16px;
          color: #374151;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px 24px;
          justify-content: center;
        }

        .cancel-button,
        .logout-button {
          padding: 12px 24px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          border: 2px solid transparent;
        }

        .cancel-button {
          background: #4d007d;
          color: white;
          border-color: #4d007d;
        }

        .cancel-button:hover {
          background: #6d28d9;
          border-color: #6d28d9;
        }

        .logout-button {
          background: white;
          color: #b70000;
          border-color: #b70000;
        }

        .logout-button:hover {
          background: #f8f4ff;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }

          .modal-content {
            max-width: 90vw;
          }

          .modal-header {
            padding: 14px 20px;
          }

          .modal-header h2 {
            font-size: 16px;
          }

          .modal-body {
            padding: 24px 20px;
          }

          .modal-body p {
            font-size: 15px;
          }

          .modal-actions {
            padding: 0 20px 20px 20px;
            flex-direction: column;
          }

          .cancel-button,
          .logout-button {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  )
}
