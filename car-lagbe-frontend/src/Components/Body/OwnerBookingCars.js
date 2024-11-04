import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { List, Card, Button, Row, Col, Typography, message, Space, Modal, Spin } from 'antd';
import axios from 'axios';
import { Url } from '../../redux/actionTypes';

const { Text } = Typography;

const OwnerBookingCars = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Memoizing the header object to prevent it from changing on every render
    const header = useMemo(() => ({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    }), []);

    const fetchBookings = useCallback(async () => {
        try {
            const response = await axios.get(Url + '/cars/bookings/my-car-bookings/', header);
            setBookings(Array.isArray(response.data.results) ? response.data.results : []);
        } catch (error) {
            message.error('Failed to load bookings.');
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }, [header]); // Include header in dependency 

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]); // Add fetchBookings to dependency array

    // Cancel a booking
    const handleCancelBooking = (bookingId) => {
        Modal.confirm({
            title: 'Cancel Booking',
            content: 'Are you sure you want to cancel this booking?',
            onOk: async () => {
                try {
                    await axios.delete(Url + `/cars/bookings/${bookingId}/`, header);
                    message.success("Booking canceled successfully.");
                    setBookings((prevBookings) => prevBookings.filter(booking => booking.id !== bookingId));
                } catch (error) {
                    console.error("Error canceling booking:", error);
                    message.error("Failed to cancel booking.");
                }
            },
            onCancel: () => { },
        });
    };

    const handleViewBooking = (profile_data) => {
        Modal.confirm({
            title: "Profile Information",
            content: (
                <div>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <Text strong>Customer Name:</Text> {profile_data.full_name}
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Text strong>Phone No :</Text> {profile_data.phone}
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <Text strong>Address:</Text> {profile_data.address_1}
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Text strong>City:</Text> {profile_data.city}<br />
                            <Text strong>Zip Code:</Text> {profile_data.zipcode}
                        </Col>
                    </Row>
                </div>
            )
        });
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <List
                dataSource={bookings}
                renderItem={(booking) => (
                    <List.Item key={booking.id}>
                        <Card
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden',
                            }}
                        >
                            <Row gutter={[16, 16]} align="middle" justify="center">
                                {/* Car Image */}
                                <Col xs={24} sm={6} md={4}>
                                    <img
                                        alt={`${booking.car.brand} ${booking.car.model}`}
                                        src={booking.car.image}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </Col>

                                {/* Car Details */}
                                <Col xs={24} sm={14} md={16}>
                                    <Space direction="vertical" size="small">
                                        <Text strong>{`${booking.car.brand} ${booking.car.model}`}</Text>
                                        <Text strong>Rent Price: BDT {booking.car.rent_price} / day</Text>
                                        <Text strong>({booking.start_date}) to ({booking.end_date})</Text>
                                    </Space>
                                </Col>

                                {/* Cancel Button */}
                                <Col xs={24} sm={24} md={4} style={{ textAlign: 'right' }}>
                                    <Button
                                        type="primary"
                                        danger
                                        style={{ width: '100%' }}
                                        onClick={() => handleCancelBooking(booking.id)}
                                    >
                                        Cancel Booking
                                    </Button>
                                </Col>
                                {/* View Profile Button */}
                                <Col xs={24} sm={24} md={4} style={{ textAlign: 'right' }}>
                                    <Button
                                        type="primary"
                                        style={{ width: '100%' }}
                                        onClick={() => handleViewBooking(booking.profile_data)}
                                    >
                                        View Profile
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default OwnerBookingCars;
