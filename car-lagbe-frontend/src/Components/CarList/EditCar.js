import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Card, Form, Input, Button, Select, InputNumber, Row, Col, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Url } from '../../redux/actionTypes';

const { Option } = Select;
const { TextArea } = Input;

const EditCar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const car = location.state?.car; // Car data passed from previous component

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const onFinish = (values) => {
        const formData = new FormData();
        const userId = localStorage.getItem('user_id');

        formData.append('owner', userId);
        formData.append('status', values.status);
        formData.append('brand', values.brand);
        formData.append('model', values.model);
        formData.append('year', values.year);
        formData.append('color', values.color);
        formData.append('rent_price', values.rent_price);
        formData.append('description', values.description);

        if (fileList.length > 0) {
            formData.append('image', fileList[0].originFileObj);// Append the image file to the formData
        }

        //  API call to update car data (replace with your API endpoint)
        axios.patch(Url + `/cars/${car.id}/`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Token must be valid
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                message.success('Car updated successfully!');
                navigate('/'); // Redirect to the car listing page
            })
            .catch(() => {
                message.error('Failed to update car. Please try again.');
            });
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Delete Car',
            content: 'Are you sure you want to delete this car?',
            onOk() {
                axios.delete(Url + `/cars/${car.id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Token must be valid
                    },
                })
                    .then(() => {
                        message.success('Car deleted successfully!');
                        navigate('/'); // Redirect to the car listing page
                    })
                    .catch(() => {
                        message.error('Failed to delete car. Please try again.');
                    });
            },
            onCancel() {
                // Do nothing if the user cancels the deletion
            },
        });
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList.slice(-1)); // Keep only the most recent image uploaded
    };

    const handleCancel = () => {
        navigate(-1); // This will navigate to the previous page
    }

    return (
        <div style={{ padding: '20px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card
                title={`Edit Car: ${car.brand} ${car.model}`}
                bordered={false}
                style={{ maxWidth: '800px', width: '100%', margin: '0 auto', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: car.status,
                        brand: car.brand,
                        model: car.model,
                        year: car.year,
                        color: car.color,
                        rent_price: car.rent_price,
                        description: car.description,
                        image: car.image, // Existing image
                    }}
                    onFinish={onFinish}
                >
                    {/* Display Existing Car Image */}
                    <Form.Item label="Current Car Image">
                        <Card
                            cover={<img alt={car.model} src={car.image} />}
                            style={{ maxWidth: '400px', margin: '0 auto' }}
                        >
                            <p>{`${car.brand} ${car.model}`}</p>
                        </Card>
                    </Form.Item>

                    {/* Brand and Model Fields */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="brand"
                                label="Brand"
                                rules={[{ required: true, message: 'Please enter the car brand' }]}
                            >
                                <Input placeholder="Enter car brand" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="model"
                                label="Model"
                                rules={[{ required: true, message: 'Please enter the car model' }]}
                            >
                                <Input placeholder="Enter car model" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Year and Color Fields */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="year"
                                label="Year"
                                rules={[{ required: true, message: 'Please enter the year of manufacture' }]}
                            >
                                <InputNumber min={1900} max={new Date().getFullYear()} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="color"
                                label="Color"
                                rules={[{ required: true, message: 'Please enter the car color' }]}
                            >
                                <Input placeholder="Enter car color" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Status and Rent Price Fields */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Please select the car status' }]}
                            >
                                <Select placeholder="Select car status">
                                    <Option value="Yes">Booked</Option>
                                    <Option value="No">Available</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="rent_price"
                                label="Rent Price (BDT/day)"
                                rules={[{ required: true, message: 'Please enter the rent price' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Description Field */}
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter the car description' }]}
                    >
                        <TextArea rows={4} placeholder="Enter car description" />
                    </Form.Item>

                    {/* Upload New Image Field */}
                    <Form.Item label="Upload New Car Image" name="image">
                        <Upload
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                            beforeUpload={() => false} // Prevent automatic upload
                            onChange={handleUploadChange}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Update Car
                        </Button>
                    </Form.Item>
                </Form>
                <Button type="primary" danger style={{ width: '100%' }} onClick={handleDelete}>
                    Delete Car
                </Button>
                <br />
                <br />
                <Button type="dashed" danger style={{ width: '100%' }} onClick={handleCancel}>
                    Cancel
                </Button>
            </Card>
        </div>
    );
};

export default EditCar;
