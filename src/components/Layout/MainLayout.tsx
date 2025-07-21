import React from 'react';
import { Layout, Menu, Typography, Space, Button, theme } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  TableOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleSidebar } from '@/store/slices/appSlice';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector((state) => state.app);
  const { fileList } = useAppSelector((state) => state.file);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'files',
      icon: <FileTextOutlined />,
      label: '文件列表',
      children: fileList.map((file) => ({
        key: file.type === 'json' ? `/json/${file.id}` : `/excel/${file.id}`,
        icon: file.type === 'json' ? <FileTextOutlined /> : <TableOutlined />,
        label:
          file.name.length > 15
            ? `${file.name.substring(0, 15)}...`
            : file.name,
      })),
    },
  ];

  const handleMenuClick = (key: string): void => {
    navigate(key);
  };

  const getSelectedKeys = (): string[] => {
    const path = location.pathname;
    if (path === '/') return ['/'];

    // 检查是否是文件查看页面
    if (path.includes('/json/') || path.includes('/excel/')) {
      return [path];
    }

    return [path];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            height: '64px',
            padding: '16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!sidebarCollapsed && (
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              JsonShow
            </Title>
          )}
          {sidebarCollapsed && (
            <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: 'none' }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space>
            <Button
              type="text"
              icon={
                sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => dispatch(toggleSidebar())}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Space>

          <Space>
            <span style={{ color: '#666' }}>
              {fileList.length > 0
                ? `已加载 ${fileList.length} 个文件`
                : '暂无文件'}
            </span>
          </Space>
        </Header>

        <Content
          style={{
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
