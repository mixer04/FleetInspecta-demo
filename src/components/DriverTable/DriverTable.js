import React, { useEffect, useState, useCallback } from 'react';
import './DriverTable.css';
import { supabase } from '../../supabaseClient';
import GoBack from '../../assets/goback.png';

export default function DriverTable() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const getDrivers = useCallback(async () => {
        try {
            const { data } = await supabase
                .from('demo_drivers')
                .select('*')
                .order(sortField, { ascending: sortOrder === 'asc' });
            if (data != null) {
                setDrivers(data);
            }
        } catch (error) {
            alert('Error fetching drivers: ', error.message);
        }
    }, [sortField, sortOrder]);

    useEffect(() => {
        getVehicles();
    }, []);

    useEffect(() => {
        if (vehicles.length > 0) {
            getDrivers();
        }
    }, [vehicles, getDrivers]);

    async function getVehicles() {
        try {
            const { data } = await supabase
                .from('demo_vehicles')
                .select('*');
            if (data != null) {
                setVehicles(data);
            }
        } catch (error) {
            alert('Error fetching vehicles: ', error.message);
        }
    }

    async function newDriver(e) {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('demo_drivers')
                .insert({
                    name: name,
                    surname: surname,
                    email: email,
                    phone: phone,
                    vehicle: vehicle,
                })
                .single();
            if (error) throw error;
            window.location.reload();
        } catch (error) {
            alert('Error adding new driver, try again.');
        }
    }

    async function updateDriver(e) {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('demo_drivers')
                .update({
                    name: name,
                    surname: surname,
                    email: email,
                    phone: phone,
                    vehicle: vehicle,
                })
                .eq('id', editingDriver.id);
            if (error) throw error;
            window.location.reload();
        } catch (error) {
            alert('Error updating driver, try again.');
        }
    }

    const handleRowClick = (driver) => {
        setEditingDriver(driver);
        setName(driver.name);
        setSurname(driver.surname);
        setEmail(driver.email);
        setPhone(driver.phone);
        setVehicle(driver.vehicle);
        setShowForm(true);
    };

    const handleFormSubmit = (e) => {
        if (editingDriver) {
            updateDriver(e);
        } else {
            newDriver(e);
        }
    };

    const handleSortFieldChange = (e) => {
        setSortField(e.target.value);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    return (
        <div className='table-container'>
            {!showForm && (
                <div className='table-controls'>
                    <button className='bg-hover text-white text-sm rounded-md block w-28 p-2.5' onClick={() => setShowForm(true)}>New Driver</button>
                    <div className='sort-options'>
                        <select onChange={handleSortFieldChange} value={sortField} className='bg-hover text-white text-sm rounded-md block w-28 p-2.5'>
                            <option value="name">Sort by Name</option>
                            <option value="email">Sort by Email</option>
                            <option value="phone">Sort by Phone</option>
                            <option value="vehicle">Sort by Vehicle</option>
                        </select>
                        <select onChange={handleSortOrderChange} value={sortOrder} className='bg-hover text-white text-sm rounded-md block w-28 p-2.5 text-center'>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            )}
            {showForm ? (
                <div className='new-driver-form'>
                    <div className='form-controls'>
                            <button className='go-back' onClick={() => { setShowForm(false); setEditingDriver(null); }}>
                                <img src={GoBack} alt="Go back" />
                            </button>
                        <h3>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
                        <div className='dummy-button'>{editingDriver ? 'Edit Driver' : 'New Driver'}</div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="surname">Surname:</label>
                            <input type="text" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone Number:</label>
                            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="vehicle">Vehicle:</label>
                            <select id="vehicle" className='text-sm rounded-md block w-full p-2.5 text-center bg-white' value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                                <option value="">Select Vehicle</option>
                                {vehicles.map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.make} {vehicle.model} ({vehicle.plate})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <br></br>
                        <div className='buttons-container mt-6'>
                            <button className='submit-button bg-hover' type="submit">{editingDriver ? 'Update Driver' : 'Add Driver'}</button>
                        </div>
                    </form>
                </div>
            ) : (
                <table className='rounded-md'>
                    <thead className='bg-hover'>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Vehicle</th>
                        </tr>
                    </thead>
                    <tbody>
                    {drivers.map((driver) => {
                        const assignedVehicle = vehicles.find(vehicle => vehicle.id === driver.vehicle);
                        return (
                            <tr key={driver.id} onClick={() => handleRowClick(driver)}>
                                <td>{driver.name} {driver.surname}</td>
                                <td>{driver.email}</td>
                                <td>+48 {driver.phone}</td>
                                <td>{assignedVehicle ? `${assignedVehicle.make} ${assignedVehicle.model} (${assignedVehicle.plate})` : 'No Vehicle Assigned'}</td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            )}
        </div>
    );
}