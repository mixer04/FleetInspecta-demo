import React, { useEffect, useState } from 'react';
import './LiveDrivers.css';
import { supabase } from '../../supabaseClient';

export default function LiveDrivers() {
  const [live_drivers, setLive_drivers] = useState(0);

  useEffect(() => {
    getLiveDrivers();
    const subscription = supabase
      .channel('demo_drivers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demo_drivers' }, payload => {
        getLiveDrivers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getLiveDrivers() {
    try {
      const { count } = await supabase
        .from('demo_drivers')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      setLive_drivers(count);
    } catch (error) {
      console.error('Error fetching live drivers: ', error.message);
    }
  }

  return (
    <div className='drivers-widget'>
      <p>Active drivers: <span>{live_drivers}</span></p>
    </div>
  );
}