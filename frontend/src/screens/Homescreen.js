import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [duplicateRooms, setDuplicateRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        const data = response.data;

        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once

  const filterByDate = (dates) => {
    const startDate = dates && dates[0] ? dates[0].format('DD-MM-YYYY') : null;
    const endDate = dates && dates[1] ? dates[1].format('DD-MM-YYYY') : null;

    if (!startDate || !endDate) {
      // If either start or end date is not selected, reset rooms to all duplicateRooms
      setRooms([...duplicateRooms]);
      return;
    }

    const filteredRooms = duplicateRooms.filter(room => {
      // Check if the room has any bookings during the selected date range
      const hasBookings = room.currentbookings.some(booking => {
        const bookingStartDate = moment(booking.fromdate, 'DD-MM-YYYY');
        const bookingEndDate = moment(booking.todate, 'DD-MM-YYYY');

        return (
          (moment(startDate, 'DD-MM-YYYY').isBetween(bookingStartDate, bookingEndDate, undefined, '[]') ||
          moment(endDate, 'DD-MM-YYYY').isBetween(bookingStartDate, bookingEndDate, undefined, '[]')) ||
          (moment(startDate, 'DD-MM-YYYY').isSame(bookingStartDate, 'day') ||
          moment(endDate, 'DD-MM-YYYY').isSame(bookingEndDate, 'day'))
        );
      });

      // Return rooms that do not have any bookings during the selected date range
      return !hasBookings;
    });

    setRooms(filteredRooms);
    setFromDate(startDate); // Update from date state
    setToDate(endDate); // Update to date state
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-3">
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate}/>
        </div>
      </div>
      
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div className="col-md-9 mt-2" key={index}>
              <Room room={room} fromdate={fromDate} todate={toDate}/>
            </div>
          ))
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
};

export default Homescreen;
