import React from 'react'
import Header from '../../components/Header/Header'
import './Drivers.css'
import DriverTable from '../../components/DriverTable/DriverTable'

export default function Drivers() {
  return (
    <div className='drivers-container'>
        <Header />
        <div className='drivers-table-widget'>
          <DriverTable />
        </div>
    </div>
  )
}
