import { useState } from "react"
import { Square, X } from "lucide-react"

export default function Sidebar({ sections, onSearch, isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }
  

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Square size={27} className="logo-icon" />
          <span>LOGO</span>
        </div>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="search-containerr">
        <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} className="search-inputt" />
        <span className="search-iconn">
          <img src="./search.svg" alt="🔍" />
        </span>
      </div>

      <nav className="nav">
        {sections.map((section, index) => (
          <div key={index} className="nav-section">
            <h3 className="section-title">{section.title}</h3>
            <ul className="nav-list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${item.active ? "active" : ""}`}
                    onClick={() => {
                      item.onClick()
                      // Close sidebar on mobile after selection
                      if (window.innerWidth <= 768 && onClose) {
                        onClose()
                      }
                    }}
                  >
                    <span className={`left-indicator ${item.active ? "" : "invisible"}`} />
                    <img src={item.active ? item.icon : item.icon2} alt="" className="nav-img" />
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <style>{`
        .sidebar {
          width: 240px;
          background: white;
          border-right: 1px solid #e5e7eb;
          height: 100vh;
          padding: 16px 16px 16px 0;
          overflow-y: auto;
          font-family: inherit;
          transition: transform 0.3s ease;
          position: relative;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-left: 16px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          font-weight: bold;
          font-family: inherit;
        }

        .logo-icon {
          color: #4d007d;
        }

        .logo span {
          color: #4d007d;
          font-size: 18px;
          font-family: 'Nunito', sans-serif;
        }

        .close-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background-color: #f3f4f6;
        }

        .search-containerr {
          position: relative;
          margin-bottom: 24px;
          max-width: 250px;
          padding-left: 16px;
        }

        .search-inputt {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          font-size: 14px;
          box-sizing: border-box;
          height: 34px;
          font-family:inherit;
        }

        .search-inputt:focus {
          outline: none;
          border-color: #4d007d;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .search-iconn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 16px;
          width: 16px;
          display: flex;
          margin-left:10px;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .nav-section {
          margin-bottom: 32px;
          padding-left: 16px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 500;
          color: #a4a4a4;
          letter-spacing: 0.05em;
          margin: 0 0 12px 0;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          height: 42px;
          position: relative;
          gap: 8px;
          width: 100%;
          padding: 1px 12px 1px 0;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          margin-right: 12px;
          border-radius: 0 6px 6px 0;
          transition: all 0.2s;
          margin-bottom: 4px;
          font-family: inherit;
          min-height: 42px;
        }

        .left-indicator {
          width: 8px;
          height: 100%;
          background-color: #4d007d;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
          margin-right: 12px;
          flex-shrink: 0;
          align-self: stretch;
          position: relative;
        }

        .invisible {
          visibility: hidden;
        }

        .nav-item.active {
          color: #4d007d;
        }

        .nav-item:hover {
          background-color: #f3f4f6;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
        }

        .nav-img {
          width: 20px;
          height: 20px;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 50;
            transform: translateX(-100%);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }

          .sidebar-open {
            transform: translateX(0);
          }

          .close-button {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 280px;
            padding: 12px 12px 12px 0;
          }

          .logo span {
            font-size: 16px;
          }

          .search-containerr {
            padding-left: 12px;
          }

          .nav-section {
            padding-left: 12px;
          }
        }
      `}</style>
    </aside>
  )
}
