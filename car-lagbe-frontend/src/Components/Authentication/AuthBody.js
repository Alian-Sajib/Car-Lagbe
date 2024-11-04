import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import '../css/body.css';

const { Header, Content, Footer } = Layout;

const navbar = ["Login", 'Sign Up']
const items = navbar.map((item, index) => ({
    key: index + 1,
    label: item,
}));


const AuthBody = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [content, setContent] = useState(<LoginForm />);
    const show = (items) => {
        if (items.key === '1')
            setContent(<LoginForm />);
        else if (items.key === '2')
            setContent(<SignUpForm />);
    }

    return (
        <Layout className="layout-container">
            <Header className="layout-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                    onClick={show}
                />
            </Header>
            <Content className="layout-content"
                style={{
                    padding: '0 48px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                        padding: '16px 0',
                    }}
                    items={[{ title: 'Welcome to Car Lagbe Official Website' }]}
                />

                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {content}

                </div>
            </Content>
            <Footer className="layout-footer"
                style={{
                    textAlign: 'center',

                }}
            >
                Online Car Rental ©{new Date().getFullYear()} Created by Alian Sajib
            </Footer>
        </Layout>
    );
};
export default AuthBody;