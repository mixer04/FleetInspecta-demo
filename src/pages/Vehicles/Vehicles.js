import React from 'react'
import Header from '../../components/Header/Header'
import './Vehicles.css'
import VehicleTable from '../../components/VehicleTable/VehicleTable'

export default function Vehicles() {
  return (
    <div className='vehicles-container'>
        <Header />
        <div className='vehicles-table-widget'>
          <VehicleTable />
        </div>
    </div>
  )
}
