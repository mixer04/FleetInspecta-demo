import { useEffect } from 'react';
import { supabase } from './supabaseClient';

const generateNewLocation = (lat, lon) => {
  const newLat = lat + (Math.random() * 0.012 - 0.006);
  const newLon = lon + (Math.random() * 0.012 - 0.006);
  return { newLat, newLon };
};

const updateDriverLocations = async () => {
  try {
    const { data: drivers, error } = await supabase
      .from('demo_drivers')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching drivers:', error);
      return;
    }

    for (const driver of drivers) {
      if (driver.latitude !== null && driver.longitude !== null) {
        const { newLat, newLon } = generateNewLocation(driver.latitude, driver.longitude);

        const { error: updateError } = await supabase
          .from('demo_drivers')
          .update({
            latitude: newLat,
            longitude: newLon,
            updated_at: new Date().toISOString(),
          })
          .eq('id', driver.id);

        if (updateError) {
          console.error('Error updating driver location:', updateError);
        } else {
          console.log(`Updated driver ${driver.id} to new location: (${newLat}, ${newLon})`);
        }
      }
    }
  } catch (error) {
    console.error('Error in updateDriverLocations:', error);
  }
};

const shuffleDriverStatus = async () => {
  try {
    const { data: drivers, error } = await supabase
      .from('demo_drivers')
      .select('id, is_active');

    if (error) {
      console.error('Error fetching drivers:', error);
      return;
    }

    if (drivers.length < 2) {
      console.warn('Not enough drivers to shuffle status.');
      return;
    }

    const shuffledDrivers = drivers.sort(() => 0.5 - Math.random()).slice(0, 2);

    for (const driver of shuffledDrivers) {
      const { error: updateError } = await supabase
        .from('demo_drivers')
        .update({ is_active: !driver.is_active })
        .eq('id', driver.id);

      if (updateError) {
        console.error('Error updating driver status:', updateError);
      } else {
        console.log(`Shuffled driver ${driver.id} status to ${!driver.is_active}`);
      }
    }
  } catch (error) {
    console.error('Error in shuffleDriverStatus:', error);
  }
};

const useDriverLocationUpdater = () => {
  useEffect(() => {
    const locationIntervalId = setInterval(updateDriverLocations, 5000);
    const statusIntervalId = setInterval(shuffleDriverStatus, 300000);

    return () => {
      clearInterval(locationIntervalId);
      clearInterval(statusIntervalId);
    };
  }, []);
};

export default useDriverLocationUpdater;