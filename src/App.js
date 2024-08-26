import './App.css';
import Dashboard from './pages/Dashboard/Dashboard.js';
import Sidebar from './components/Sidebar/Sidebar.js';
import updateLocation from './updateLocation.js';
import { useState } from 'react';

function App() {
  updateLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="App">
      <div className='dashboard-header' style={{ position: 'relative', zIndex: 2 }}>
        <Sidebar onToggle={handleSidebarToggle} />
      </div>
      <div className='dashboard-content scrollable-content' key={sidebarExpanded ? 'expanded' : 'collapsed'} style={{ position: 'relative', zIndex: 1 }}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;