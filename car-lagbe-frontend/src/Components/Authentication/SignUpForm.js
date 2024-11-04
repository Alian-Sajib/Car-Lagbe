import React, { useState } from 'react';
import { Button, Form, Input, message, Spin, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../redux/authactionTypes';
import '../css/body.css';

const SignUpForm = () => {
    const authLoading = useSelector(state => state.authLoading)
    const dispatch = useDispatch()

    const [mode, setMode] = useState({
        email: 'Email',
        buttonText: 'Switch to Buisness Account',
    });
    const inputChange = () => {
        if (mode.email === 'Email') {
            setMode({
                email: 'Company Email',
                buttonText: 'Switch to Personal Account',
            })
        }
        else {
            setMode({
                email: 'Email',
                buttonText: 'Switch to Buisness Account',
            })
        }
    }
    const handleSubmit = (values) => {
        //  console.log('Form submitted:', values);
        if (mode.email === 'Email')
            dispatch(auth(values.email, values.password, 'SignUp', 'P'));
        else
            dispatch(auth(values.email, values.password, 'SignUp', 'B'));
    }
    const handleSubmitFailed = (errorInfo) => {
        //  console.log('Failed:', errorInfo);
        message.error('Failed to Create Account. Please check your input.');
    }

    if (authLoading) {
        return (
            <div className="spinner-container">
                <Spin size="large" />
            </div>
        );
    }

    else {

        return (
            <div>
                <Card className="card-container"
                    bordered={false}
                    style={{ maxWidth: '800px', margin: '0 auto', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#f5f5f5', }}>
                    <Form
                        layout='vertical'
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                        onFinish={handleSubmit}
                        onFinishFailed={handleSubmitFailed}

                    >
                        <Form.Item
                            label={mode.email}
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Please enter a valid email address!',
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder='Enter your email address' />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password placeholder='Enter your password' />
                        </Form.Item>

                        <Form.Item
                            label="Re-enter Password"
                            name="re-enterpassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please re-enter your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder='Confirm your password' />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Sign Up
                            </Button>
                        </Form.Item>
                        <br />
                        <Form.Item>
                            <Button type="primary" ghost onClick={inputChange}>
                                {mode.buttonText}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

            </div>

        );
    }
}
export default SignUpForm;