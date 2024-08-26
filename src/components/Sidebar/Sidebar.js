import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import './Sidebar.css'
import drivers from '../../assets/driver.svg';
import vehicles from '../../assets/vehicle.svg';
import home from '../../assets/home.svg';
import { Link } from 'react-router-dom';
import github from '../../assets/github.png';

const SidebarContext = createContext()

export default function Sidebar() {
  const [expanded, setExpanded] = useState(() => {
    const savedState = sessionStorage.getItem('sidebar-expanded')
    return savedState !== null ? JSON.parse(savedState) : true
  })

  useEffect(() => {
    sessionStorage.setItem('sidebar-expanded', JSON.stringify(expanded))
  }, [expanded])

  const handleSidebarToggle = () => {
    setExpanded((curr) => !curr);
  };

  return (
    <aside className="h-screen inline-flex">
      <nav className="h-full flex flex-col bg-button border-r shadow-sm">
        <div className="pl-5 pr-5 pt-4 pb-1 flex justify-between items-center">
          <p className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"} logo-text`}>FleetWise</p>
          <button
            onClick={handleSidebarToggle}
            className="p-1.5 rounded-lg bg-background hover:bg-secondary "
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 pt-5">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <SidebarItem icon={<img src={home} alt="Home" />} text="Home" />
            </Link>
            <Link to="/drivers" style={{ textDecoration: 'none' }}>
              <SidebarItem icon={<img src={drivers} alt="Drivers" />} text="Drivers" />
            </Link>
            <Link to="/vehicles" style={{ textDecoration: 'none' }}>
              <SidebarItem icon={<img src={vehicles} alt="Vehicles" />} text="Vehicles" />
            </Link>
            <a href="https://github.com/mixer04/transitapp" className="github-cont" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <SidebarItem icon={<img src={github} alt="GitHub" className="github" />} text="GitHub" />
            </a>
          </ul>
        </SidebarContext.Provider>

        <div className="flex items-center justify-center p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">John Doe</h4>
              <span className="text-xs text-white">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} color="white" />
          </div>
        </div>
      </nav>
    </aside>
  )
}

function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext)
  
      return (
    <li
      className={`
        relative flex items-center py-1 px-2 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-hover text-white"
        }
    `}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span
        className={`whitespace-nowrap overflow-hidden transition-width duration-300 ${
          expanded ? "w-40 ml-2" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-slate-500 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full top-0 rounded-md px-2 py-1 ml-6
          bg-hover text-white text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}