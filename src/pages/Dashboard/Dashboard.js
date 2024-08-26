import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashWidget from '../../components/DashboardWidget/DashboardWidget.js';
import DriversPage from '../Drivers/Drivers.js';
import VehiclesPage from '../Vehicles/Vehicles.js';
import SettingsPage from '../Settings/Settings.js';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className='Dashboard bg-background'>
      <Routes>
        <Route exact path="/" element={<DashWidget />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
};

export default Dashboard;