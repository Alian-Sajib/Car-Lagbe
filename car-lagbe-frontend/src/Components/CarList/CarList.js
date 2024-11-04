import React, { useEffect, useState } from 'react';
import { EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Card, Pagination, Row, Col, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Url } from '../../redux/actionTypes';

const { Meta } = Card;

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const userType = useSelector(state => state.user_type);

    useEffect(() => {
        fetchCars(currentPage);
    }, [currentPage]);

    const fetchCars = async (page) => {
        try {
            const response = await axios.get(Url + `/cars/?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setCars(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 6)); // Assuming 6 cars per page
        } catch (error) {
            console.error("Error fetching cars", error);
            message.error("Failed to fetch cars. Please try again later.");
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getStatusText = (status) => {
        return status === 'Yes' ? 'Booked' : 'Available';
    };

    const handleEditClick = (car) => {
        navigate(`/edit-car/${car.id}`, { state: { car } });
    };

    const handleViewClick = (car) => {
        navigate(`/details/${car.id}`, { state: { car } });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row
                gutter={[16, 16]}
                justify={cars.length <= 2 ? 'center' : 'start'}
            >
                {cars.map((car) => (
                    <Col
                        key={car.id}
                        xs={24} sm={12} md={8} lg={6} xl={4}
                        style={{ minWidth: '250px', maxWidth: '300px' }} // Ensures consistent width
                    >
                        <Card
                            style={{
                                width: '100%',
                                height: '100%',
                                marginBottom: '10px',
                                border: '1px solid #d9d9d9',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                            cover={
                                <img
                                    alt={car.model}
                                    src={`${car.image}`}
                                // style={{ height: '200px', width: '100%', objectFit: 'cover' }} // Set height and objectFit
                                />
                            }
                            actions={[
                                userType === "B" ? (
                                    <span
                                        onClick={() => handleEditClick(car)}
                                        style={styles.editIconWrapper}
                                    >
                                        <EditOutlined style={styles.editIcon} />
                                    </span>
                                ) : (
                                    <span onClick={() => handleViewClick(car)} style={styles.editIconWrapper}>
                                        <ArrowRightOutlined style={styles.editIcon} />
                                    </span>
                                )
                            ]}
                        >
                            <Meta
                                title={`${car.brand} ${car.model}`}
                                description={`${car.rent_price} BDT /day`}
                            />
                            <div style={{ marginTop: 'auto' }}>
                                <span style={{
                                    backgroundColor: car.status === 'Yes' ? 'yellow' : 'orange',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid white',
                                    textAlign: 'center',
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    fontWeight: 'bold',
                                }}>
                                    {getStatusText(car.status)}
                                </span>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
            <br />
            <br />
            {/* Pagination */}
            <Pagination
                style={{ marginTop: '20px', textAlign: 'center' }}
                current={currentPage}
                total={totalPages * 5}
                onChange={handlePageChange}
                pageSize={5}
            />
        </div>
    );
};

// Custom styles for the EditOutlined icon
const styles = {
    editIconWrapper: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
        padding: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #d9d9d9',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    editIcon: {
        fontSize: '18px',
        color: '#1890ff',
    },
};

export default CarList;
