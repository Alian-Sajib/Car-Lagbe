import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Form, Input, Button, message, Spin, Card } from 'antd';
import axios from 'axios';
import { Url } from '../../redux/actionTypes';

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage

    // Memoize the header object to prevent it from changing on every render
    const header = useMemo(() => ({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    }), []);

    // Fetch profile data
    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(Url + `/account/profile/${userId}/`, header);
            form.setFieldsValue(response.data);
        } catch (error) {
            message.error("Error fetching profile data.");
        } finally {
            setLoading(false);
        }
    }, [header, form, userId]); // Add dependencies

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]); // Add fetchProfileData to the dependency array

    // Update profile data
    const handleUpdate = useCallback(async (values) => {
        setLoading(true);
        try {
            await axios.put(Url + `/account/profile/${userId}/`, values, header);
            message.success("Profile updated successfully!");
        } catch (error) {
            message.error("Error updating profile.");
        } finally {
            setLoading(false);
        }
    }, [header, userId]); // Add dependencies

    if (loading) {
        return <Spin />;
    }

    return (
        <div style={{ padding: '20px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card
                bordered={false}
                style={{ maxWidth: '800px', width: '100%', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                >
                    <Form.Item label="Full Name" name="full_name" rules={[{ required: true, message: 'Please enter your full name!' }]}>
                        <Input placeholder="Your Full Name" />
                    </Form.Item>

                    <Form.Item label="Address" name="address_1" rules={[{ required: true, message: 'Please enter your address!' }]}>
                        <Input.TextArea placeholder="Your Address" />
                    </Form.Item>

                    <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please enter your city!' }]}>
                        <Input placeholder="City" />
                    </Form.Item>

                    <Form.Item label="Zipcode" name="zipcode" rules={[{ required: true, message: 'Please enter your zipcode!' }]}>
                        <Input placeholder="Zipcode" />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                        <Input placeholder="Phone Number" />
                    </Form.Item>

                    <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please enter your country!' }]}>
                        <Input placeholder="Country" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;
