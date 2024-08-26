import React from 'react'
import './DashboardWidget.css'
import Header from '../Header/Header.js'
import MapView from '../MapView/MapView.js'
import TimeWidget from '../TimeWidget/TimeWidget.js'
import LiveDrivers from '../LiveDrivers/LiveDrivers.js'
import DateWidget from '../DateWidget/DateWidget.js'

export default function DashboardWidget() {
  return (
    <div className='dashboard-container'>
        <Header />
        <div className='header-widgets'>
          <DateWidget />
          <TimeWidget />
          <LiveDrivers />
        </div>
        <div className='widget'>
          <MapView />
        </div>
    </div>
  )
}
