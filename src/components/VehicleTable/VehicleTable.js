import React, { useEffect, useState } from 'react';
import './VehicleTable.css';
import { supabase } from '../../supabaseClient';
import GoBack from '../../assets/goback.png';

export default function VehicleTable() {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [vin, setVin] = useState('');
    const [plate, setLicensePlate] = useState('');
    const [last_check, setLastCheck] = useState('');
    const [next_check, setNextCheck] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [sortField, setSortField] = useState('days_left');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data } = await supabase
                    .from('demo_vehicles')
                    .select('*');
                if (data != null) {
                    const vehiclesWithDaysLeft = data.map(vehicle => ({
                        ...vehicle,
                        days_left: calculateDaysLeft(vehicle.next_check)
                    }));
                    setVehicles(sortVehicles(vehiclesWithDaysLeft, sortField, sortOrder));
                }
            } catch (error) {
                alert('Error fetching vehicles: ', error.message);
            }
        };

        fetchVehicles();
    }, [sortField, sortOrder]);

    useEffect(() => {
        if (last_check) {
            const lastCheckDate = new Date(last_check);
            const nextCheckDate = new Date(lastCheckDate.setFullYear(lastCheckDate.getFullYear() + 1));
            setNextCheck(nextCheckDate.toISOString().split('T')[0]);
        }
    }, [last_check]);

    const calculateDaysLeft = (nextCheck) => {
        const nextDate = new Date(nextCheck);
        const currentDate = new Date();

        const diffTime = nextDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const sortVehicles = (vehicles, field, order) => {
        return vehicles.sort((a, b) => {
            const aValue = field === 'days_left' ? a.days_left : a[field];
            const bValue = field === 'days_left' ? b.days_left : b[field];

            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    };

    async function newVehicle(e) {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('demo_vehicles')
                .insert({
                    make: make,
                    model: model,
                    year: year,
                    vin: vin,
                    plate: plate,
                    last_check: last_check,
                    next_check: next_check,
                })
                .single();
            if (error) throw error;
            window.location.reload();
        } catch (error) {
            alert('Error adding new vehicle, try again.');
        }
    }

    async function updateVehicle(e) {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('demo_vehicles')
                .update({
                    make: make,
                    model: model,
                    year: year,
                    vin: vin,
                    plate: plate,
                    last_check: last_check,
                    next_check: next_check,
                })
                .eq('id', editingVehicle.id);
            if (error) throw error;
            window.location.reload();
        } catch (error) {
            alert('Error updating vehicle, try again.');
        }
    }

    const handleRowClick = (vehicle) => {
        setEditingVehicle(vehicle);
        setMake(vehicle.make);
        setModel(vehicle.model);
        setYear(vehicle.year);
        setVin(vehicle.vin);
        setLicensePlate(vehicle.plate);
        setLastCheck(vehicle.last_check);
        setNextCheck(vehicle.next_check);
        setShowForm(true);
    };

    const handleFormSubmit = (e) => {
        if (editingVehicle) {
            updateVehicle(e);
        } else {
            newVehicle(e);
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
                    <button className='bg-hover text-white text-sm rounded-md block w-28 p-2.5' onClick={() => setShowForm(true)}>New Vehicle</button>
                    <div className='sort-options'>
                        <select onChange={handleSortFieldChange} value={sortField} className='bg-hover text-white text-sm rounded-md block w-auto p-2.5 text-center'>
                            <option value="make">Sort by make</option>
                            <option value="model">Sort by model</option>
                            <option value="year">Sort by year</option>
                            <option value="license_plate">Sort by license plate</option>
                            <option value="last_check">Sort by last check</option>
                            <option value="next_check">Sort by next check</option>
                            <option value="days_left">Sort by days left</option>
                        </select>
                        <select onChange={handleSortOrderChange} value={sortOrder} className='bg-hover text-white text-sm rounded-md block w-28 p-2.5 text-center'>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            )}
            {showForm ? (
                <div className='new-vehicle-form'>
                    <div className='form-controls'>
                            <button className='go-back' onClick={() => { setShowForm(false); setEditingVehicle(null); }}>
                                <img src={GoBack} alt="Go back" />
                            </button>
                        <h3>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                        <div className='dummy-button'>{editingVehicle ? 'Edit Vehicle' : 'New Vehicle'}</div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="make">Make</label>
                            <input name="make" id="make" type="text" value={make} onChange={(e) => setMake(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="model">Model</label>
                            <input name="model" id="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="year">Year</label>
                            <input name="year" id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="vin">VIN</label>
                            <input name="vin" id="vin" type="text" value={vin} onChange={(e) => setVin(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="last_check">Last Check</label>
                            <input name="last_check" id="last_check" type="date" value={last_check} onChange={(e) => setLastCheck(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="next_check">Next Check</label>
                            <input name="next_check" id="next_check" type="date" value={next_check} onChange={(e) => setNextCheck(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="days_left">Days Left</label>
                            <input name="days_left" id="days_left" type="text" value={calculateDaysLeft(next_check)} className={calculateDaysLeft(next_check) >= 1 && calculateDaysLeft(next_check) <= 30 ? 'red-cell' : ''} readOnly />
                        </div>
                        <div>
                            <label htmlFor="plate">License Plate</label>
                            <input name="plate" id="plate" type="text" value={plate} onChange={(e) => setLicensePlate(e.target.value)} />
                        </div>
                        <br></br>
                        <div className='buttons-container mt-6'>
                            <button className='submit-button bg-hover' type="submit">{editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}</button>
                        </div>
                    </form>
                </div>
            ) : (
                <table className='rounded-md'>
                    <thead className='bg-hover'>
                        <tr>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>VIN</th>
                            <th>Last Check</th>
                            <th>Next Check</th>
                            <th>Days Left</th>
                            <th>License Plate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} onClick={() => handleRowClick(vehicle)} className={vehicle.days_left >= 1 && vehicle.days_left <= 30 ? 'red-row' : ''}>
                                <td>{vehicle.make}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.year}</td>
                                <td>{vehicle.vin}</td>
                                <td>{vehicle.last_check}</td>
                                <td>{vehicle.next_check}</td>
                                <td>{vehicle.days_left} </td>
                                <td>{vehicle.plate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}