import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Card, Button, Row, Col, Typography, Space, message } from 'antd';
import DateRangePicker from './DateRangePicker';
import axios from 'axios';
import { Url } from '../../redux/actionTypes';

const { Title, Text } = Typography;

const CarDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const car = location.state?.car;
    let selectedDates = [];  // Temporary variable to store selected dates
    const user_id = localStorage.getItem('user_id');
    const header = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    }

    const handleBooked = () => {
        Modal.confirm({
            title: "Book Car",
            content: (
                <div>
                    <p>Select Booking Dates:</p>
                    <DateRangePicker onChange={(values) => (selectedDates = values)} />
                </div>
            ),
            onOk: async () => {
                // Check if dates were selected
                if (!selectedDates || selectedDates.length !== 2) {
                    message.error("Please select a start and end date.");
                    return;
                }

                try {
                    const [startDate, endDate] = selectedDates;
                    // Fetch profile data first
                    const profileResponse = await axios.get(
                        Url + `/account/profile/${user_id}/`,
                        header
                    );

                    const profileData = profileResponse.data;
                    if (profileData.full_name === '' || profileData.address_1 === '' || profileData.phone === '') {
                        message.warning("Please provide Profile Information")
                        navigate('/profile')
                    }
                    else {
                        // Make the booking request
                        await axios.post(Url + `/cars/bookings/`, {
                            car_id: car.id,
                            user: user_id,
                            profile_id: profileData.id,
                            start_date: startDate.format("YYYY-MM-DD"),
                            end_date: endDate.format("YYYY-MM-DD"),
                        }, header);

                        message.success("Car Booked Successfully");
                        car.status = "Yes";  // Update local car status if needed
                        navigate(-1); // Refresh to show updated status
                    }

                } catch (error) {
                    console.error("Error booking the car:", error); // Log the error for debugging
                    message.error("Booking failed. Please try again.");
                }
            },
            onCancel() { },
        });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Card
                title={<Title level={3} style={{ textAlign: 'center', margin: 0 }}>{`${car.brand} ${car.model}`}</Title>}
                bordered={false}
                cover={
                    <img
                        alt={car.model}
                        src={car.image}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                }
                style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Text strong>Brand:</Text>
                            <Text>{car.brand}</Text>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Text strong>Model:</Text>
                            <Text>{car.model}</Text>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Text strong>Year:</Text>
                            <Text>{car.year}</Text>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Text strong>Color:</Text>
                            <Text>{car.color}</Text>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Text strong>Status:</Text>
                            <Text>{car.status === 'Yes' ? 'Booked' : 'Available'}</Text>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Text strong>Rent Price:</Text>
                            <Text>BDT {car.rent_price} / day</Text>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong>Description:</Text>
                            <Text>{car.description}</Text>
                        </Space>
                    </Col>
                </Row>
                <Button
                    type="primary"
                    onClick={() => handleBooked(car)}
                    disabled={car.status === 'Yes'}// Disable button if car is already booked
                    style={{ width: '100%', borderRadius: '8px', backgroundColor: 'orange' }}
                >
                    Booked
                </Button>
                <br />
                <br />
                <Button
                    type="dashed"
                    onClick={() => navigate(-1)}
                    style={{ width: '100%', borderRadius: '8px' }}
                >
                    Go Back
                </Button>
            </Card>
        </div>
    );
};

export default CarDetail;
