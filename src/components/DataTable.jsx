import { useState, useEffect } from 'react';

const BACKEND_URL = 'https://hrms-backend-26st.onrender.com'

export default function DataTable({
  columns,
  data,
  actions,
  onRowClick,
  onStatusChange,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Close dropdown when data changes
  useEffect(() => {
    setOpenDropdown(null);
  }, [data]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return '#000';
      case 'selected':
        return '#4d007d';
      case 'approved':
      case 'present':
        return '#008413';
      case 'rejected':
      case 'absent':
        return '#b70000';
      case 'pending':
        return '#e8b000';
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusOptions = (columnKey) => {
    switch (columnKey) {
      case 'status':
        // Check if this is candidates, attendance, or leaves based on data structure
        if (data.length > 0) {
          if (data[0].candidatesName) {
            // Candidates table
            return [
              { value: 'New', label: 'New' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Ongoing', label: 'Ongoing' },
              { value: 'Selected', label: 'Selected' },
              { value: 'Rejected', label: 'Rejected' },
            ];
          } else if (data[0].task) {
            // Attendance table
            return [
              { value: 'Present', label: 'Present' },
              { value: 'Absent', label: 'Absent' },
              { value: 'Medical Leave', label: 'Medical Leave' },
              { value: 'Work From Home', label: 'Work From Home' },
            ];
          } else if (data[0].reason) {
            // Leaves table
            return [
              { value: 'Pending', label: 'Pending' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
            ];
          }
        }
        return [];
      default:
        return [];
    }
  };

  const handleStatusChange = (rowIndex, newStatus, row) => {
    if (onStatusChange) {
      onStatusChange(rowIndex, newStatus, row);
    }
  };

  const renderCell = (column, row, rowIndex) => {
    const value = row[column.key];

    // Handle profile image cells
    if (column.key === 'profileImage') {
      return (
        <div className="profile-image">
          <img src={'./profile.jpg'} alt="Profile" />
        </div>
      );
    }

    // Handle status cells with dropdown
    if (column.key === 'status' && value) {
      const statusOptions = getStatusOptions(column.key);

      if (statusOptions.length > 0) {
        return (
          <select
            value={value}
            onChange={(e) => {
              e.stopPropagation();
              handleStatusChange(rowIndex, e.target.value, row);
            }}
            className="status-dropdown"
            style={{
              color: getStatusColor(value),
              borderColor: getStatusColor(value),
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      } else {
        return (
          <span
            className="status-badge"
            style={{
              backgroundColor: getStatusColor(value),
            }}
          >
            {value}
          </span>
        );
      }
    }

    // Handle document cells
    if (column.key === 'docs' && value) {
      return (
        <a
          href="#"
          className="doc-link"
          onClick={(e) => {
            const fileUrl = `${BACKEND_URL}${value}`;
            window.open(fileUrl, '_blank');
            e.stopPropagation();
          }}
        >
          {value}
        </a>
      );
    }

    // Default cell rendering
    return <span className="cell-content">{value}</span>;
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={{ width: column.width }}>
                  {column.label}
                </th>
              ))}
              {actions?.length > 0 && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} onClick={() => onRowClick && onRowClick(row)}>
                {columns.map((column) => (
                  <td key={column.key} data-label={column.label}>
                    {renderCell(column, row, index)}
                  </td>
                ))}
                {actions?.length > 0 && (
                  <td data-label="Action">
                    <div className="action-dropdown">
                      <button
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(index);
                        }}
                      >
                        ⋮
                      </button>
                      {openDropdown === index && (
                        <div className="dropdown-menu">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              className={`dropdown-item ${
                                action.variant === 'danger' ? 'danger' : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                                setOpenDropdown(null);
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            <tr className="spacer-row">
              <td
                colSpan={columns.length + (actions?.length ? 1 : 0)}
                style={{ height: '100px', border: 'none' }}
              ></td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .data-table thead {
          background: #4d007d;
          color: white;
        }

        .data-table th {
          padding: 16px;
          text-align: left;
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
        }

        .data-table td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }


        .data-table tbody tr:last-child {
          margin-bottom:100px;
          padding-bottom:100px;
        }

        .data-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .cell-content {
          display: block;
          word-break: break-word;
        }

        .profile-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .profile-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .status-dropdown {
          padding: 6px 16px;
          border: none;
          border-radius: 9999px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          appearance: none;
          background-image: url("./dropdown.svg");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 12px;
          padding-right: 32px;
          min-width: 80px;
        }

        .status-dropdown:focus {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 1px;
        }

        .status-dropdown option {
          background: white;
          color: #1f2937;
          padding: 4px 8px;
        }

        .doc-link {
          color: #4d007d;
          text-decoration: underline;
        }

        .doc-link:hover {
          color: #6d28d9;
        }

        .action-dropdown {
          position: relative;
        }

        .action-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
        }

        .action-button:hover {
          background-color: #f3f4f6;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          min-width: 150px;
          z-index: 20;
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        .dropdown-item.danger {
          color: #ef4444;
        }

        .dropdown-item.danger:hover {
          background-color: #fee2e2;
        }

        /* Tablet styles */
        @media (max-width: 1024px) {
          .data-table {
            min-width: 700px;
          }
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .data-table {
            min-width: 600px;
          }

          .data-table th,
          .data-table td {
            padding: 12px 8px;
            font-size: 13px;
          }

          .status-dropdown {
            font-size: 11px;
            padding: 3px 6px;
            padding-right: 18px;
            min-width: 70px;
          }
        }

        /* Small mobile styles */
        @media (max-width: 480px) {
          .data-table {
            min-width: 500px;
          }

          .data-table th,
          .data-table td {
            padding: 8px 6px;
            font-size: 12px;
          }

          .status-badge {
            padding: 2px 8px;
            font-size: 11px;
          }

          .status-dropdown {
            font-size: 10px;
            padding: 2px 4px;
            padding-right: 16px;
            min-width: 60px;
          }
        }
      `}</style>
    </div>
  );
}
