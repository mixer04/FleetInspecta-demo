import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapView.css';
import { supabase } from '../../supabaseClient';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY

const MapComponent = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(10.100000);
    const [lat, setLat] = useState(47.890000);
    const [zoom, setZoom] = useState(3.5);
    const [drivers, setDrivers] = useState([]);
    const markers = useRef({});

    useEffect(() => {
        const fetchDrivers = async () => {
            const { data } = await supabase.from('demo_drivers').select('*').eq('is_active', true);
            setDrivers(data);
        };

        fetchDrivers();

        const subscription = supabase
            .channel('demo_drivers')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'demo_drivers' }, payload => {
                fetchDrivers();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mixer04/cm09hue9800mc01qt1q1nhx5i',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    }, [lng, lat, zoom]);

    useEffect(() => {
        if (!map.current) return;

        drivers.forEach(driver => {
            if (markers.current[driver.id]) {
                if (driver.is_active) {
                    markers.current[driver.id].setLngLat([driver.longitude, driver.latitude]);
                } else {
                    markers.current[driver.id].remove();
                    delete markers.current[driver.id];
                }
            } else if (driver.is_active) {
                const el = document.createElement('div');
                el.className = 'marker';
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([driver.longitude, driver.latitude])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(driver.name + ' ' + driver.surname))
                    .addTo(map.current);
                markers.current[driver.id] = marker;
            }
        });
    }, [drivers]);

    return (
        <div>
            <div className='map' ref={mapContainer} />
        </div>
    );
};

export default MapComponent;