import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Checkbox, Form, Input, message, Spin, } from 'antd';
import { auth } from '../../redux/authactionTypes';
import '../css/body.css';

const LoginForm = () => {
    const authLoading = useSelector(state => state.authLoading)
    const dispatch = useDispatch()

    const [mode, setMode] = useState({
        email: 'P',
        buttonText: 'Switch to Buisness Account',
    });
    const inputChange = () => {
        if (mode.email === 'P') {
            setMode({
                email: 'B',
                buttonText: 'Switch to Personal Account',
            })
        }
        else {
            setMode({
                email: 'P',
                buttonText: 'Switch to Buisness Account',
            })
        }
    }

    const handleSubmit = (values) => {
        // console.log('Form submitted:', values);
        dispatch(auth(values.email, values.password, 'Login', mode.email));
    }
    const handleSubmitFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
        message.error('Empty Field. Please check your input.');
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
            <div >
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
                            label={mode.email === 'P' ? 'Email' : 'Company Email'}
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
                            <Input name='email' placeholder='Your Email' />
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
                            <Input.Password name='password' placeholder='Your password' />
                        </Form.Item>

                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>

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
export default LoginForm;