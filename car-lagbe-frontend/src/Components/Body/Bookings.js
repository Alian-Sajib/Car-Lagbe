import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { List, Card, Button, Row, Col, Typography, message, Space, Modal, Spin } from 'antd';
import axios from 'axios';
import { Url } from '../../redux/actionTypes';

const { Text } = Typography;

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    // Memoize the header object
    const header = useMemo(() => ({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    }), []);

    // Fetch the bookings for the logged-in user
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(Url + '/cars/bookings/', header);
            setBookings(response.data.results);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            message.error("Failed to load bookings.");
        }
        finally {
            setLoading(false);
        }
    }, [header]); // Add header to the dependencies

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]); // Add fetchBookings to the dependency array

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
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Bookings;
