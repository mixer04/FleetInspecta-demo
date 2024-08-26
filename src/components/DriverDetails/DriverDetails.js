import React from 'react'
import './DriverDetails.css';
import { useEffect, useState } from'react';
import { supabase } from '../../supabaseClient';

export default function DriverDetails() {
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        getDrivers();
    }, []);

    async function getDrivers() {
        try {
            const { data } = await supabase
            .from('demo_drivers')
            .select('*');
            setDrivers(data);
        } catch (error) {
            alert('Error fetching drivers: ', error.message);
        }
    }

  return (
    <div className='driver-details-form'>
      
    </div>
  )
}
