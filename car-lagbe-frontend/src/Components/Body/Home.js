import React from 'react';
import { LogoutOutlined, ProfileOutlined, HomeOutlined, FormOutlined } from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../css/body.css';

const { Header, Content, Footer, Sider } = Layout;
const labels = ['Home', 'Profile', 'Bookings', 'Log Out'];
const items = [HomeOutlined, ProfileOutlined, FormOutlined, LogoutOutlined].map(
    (icon, index) => ({
        key: String(index + 1),
        icon: React.createElement(icon),
        label: labels[index],
    })
);

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user_type = useSelector(state => state.user_type);

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Layout style={{ flex: 1, display: 'flex' }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    style={{ backgroundColor: '#001529' }}
                >
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={items}
                        onClick={(e) => {
                            switch (e.key) {
                                case '1':
                                    navigate('/');
                                    break;
                                case '2':
                                    navigate('/profile');
                                    break;
                                case '3':
                                    user_type === 'P' ? navigate('/Bookings') : navigate('/Bookings-Cars');
                                    break;
                                case '4':
                                    navigate('/logout');
                                    break;
                                default:
                                    break;
                            }
                        }}
                    />
                </Sider>
                <Layout style={{ flex: 1 }}>
                    <Header
                        style={{
                            padding: '0 20px',
                            backgroundColor: '#001529', // Match sidebar color
                            color: '#ffffff',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            fontSize: '18px', // Reduced font size for better responsiveness
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span role="img" aria-label="car-icon" style={{ fontSize: '24px' }}>🚗</span>
                            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Car Lagbe?</span>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '0 16px',
                            padding: 24,
                            minHeight: 0,
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                        }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {user_type === 'B' && location.pathname === '/' && (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        backgroundColor: '#f0f2f5',
                                        padding: '20px',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '20px',
                                        maxWidth: '90%',
                                        width: '100%',
                                        margin: '0 auto',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '16px',
                                            color: '#595959',
                                            marginBottom: '20px',
                                            wordWrap: 'break-word',
                                            textAlign: 'center',
                                            padding: '0 10px',
                                        }}
                                    >
                                        Expand your business by adding new cars to the list!
                                    </p>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            padding: '0 20px',
                                            fontSize: '16px',
                                            borderRadius: '8px',
                                            minWidth: '150px',
                                            maxWidth: '90%',
                                            width: 'auto',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        onClick={() => navigate('/add-car')}
                                    >
                                        Add New Car
                                    </Button>
                                </div>
                            )}
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Outlet />
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
            <Footer
                className="layout-footer"
                style={{
                    textAlign: 'center',
                    height: '50px',
                }}
            >
                Online Car Rental ©{new Date().getFullYear()} Created by Alian Sajib
            </Footer>
        </Layout>
    );
};

export default Home;
