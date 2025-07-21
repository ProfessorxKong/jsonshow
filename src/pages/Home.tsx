import React from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Upload,
  Space,
  Dropdown,
  Button,
} from 'antd';
import {
  InboxOutlined,
  FileTextOutlined,
  TableOutlined,
  DownOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { addFile, setCurrentFile } from '@/store/slices/fileSlice';
import { SUPPORTED_FILE_TYPES, FILE_SIZE_LIMIT } from '@/constants';
import type { FileInfo } from '@/types';

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fileList } = useAppSelector((state) => state.file);

  const handleFileUpload = (file: File): boolean => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let content: unknown;
        const fileType = getFileType(file.name);

        if (fileType === 'json') {
          // 解析 JSON 文件
          content = JSON.parse(e.target?.result as string);
        } else {
          // 其他文件类型暂时存储原始内容
          content = e.target?.result;
        }

        const fileInfo: FileInfo = {
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          type: fileType,
          size: file.size,
          lastModified: new Date(file.lastModified),
          content: content,
        };

        dispatch(addFile(fileInfo));
        dispatch(setCurrentFile(fileInfo));

        // 根据文件类型导航到相应页面（JSON默认使用树形视图）
        if (fileInfo.type === 'json') {
          navigate(`/json/${fileInfo.id}`);
        } else if (fileInfo.type === 'excel') {
          navigate(`/excel/${fileInfo.id}`);
        }
      } catch (error) {
        console.error('文件解析失败:', error);
        // 即使解析失败也创建文件信息，但标记为有错误
        const fileInfo: FileInfo = {
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          type: getFileType(file.name),
          size: file.size,
          lastModified: new Date(file.lastModified),
        };

        dispatch(addFile(fileInfo));
        dispatch(setCurrentFile(fileInfo));

        if (fileInfo.type === 'json') {
          navigate(`/json/${fileInfo.id}`);
        } else if (fileInfo.type === 'excel') {
          navigate(`/excel/${fileInfo.id}`);
        }
      }
    };

    reader.onerror = () => {
      console.error('文件读取失败');
    };

    // 根据文件类型选择读取方式
    const fileType = getFileType(file.name);
    if (fileType === 'json') {
      reader.readAsText(file, 'utf-8');
    } else {
      reader.readAsArrayBuffer(file);
    }

    return false; // 阻止自动上传
  };

  const getFileType = (fileName: string): 'json' | 'excel' | 'other' => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (!ext) return 'other';

    const fullExt = `.${ext}`;
    if (SUPPORTED_FILE_TYPES.JSON.includes(fullExt as '.json')) return 'json';
    if (
      SUPPORTED_FILE_TYPES.EXCEL.includes(fullExt as '.xlsx' | '.xls' | '.csv')
    )
      return 'excel';
    return 'other';
  };

  const handleFileClick = (
    file: FileInfo,
    viewType?: 'tree' | 'list'
  ): void => {
    dispatch(setCurrentFile(file));
    if (file.type === 'json') {
      const route =
        viewType === 'list' ? `/jsonlist/${file.id}` : `/json/${file.id}`;
      navigate(route);
    } else if (file.type === 'excel') {
      navigate(`/excel/${file.id}`);
    }
  };

  const getJsonViewMenuItems = (file: FileInfo) => [
    {
      key: 'tree',
      label: (
        <Space>
          <FileTextOutlined />
          树形视图
        </Space>
      ),
      onClick: () => handleFileClick(file, 'tree'),
    },
    {
      key: 'list',
      label: (
        <Space>
          <TableOutlined />
          列表视图
        </Space>
      ),
      onClick: () => handleFileClick(file, 'list'),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={2}>文件展示工具</Title>
          <Paragraph>
            支持 JSON 和 Excel
            文件的在线查看和分析，拖拽或点击上传文件开始使用。
          </Paragraph>
        </Col>

        <Col span={24}>
          <Card title="上传文件">
            <Dragger
              name="file"
              multiple={false}
              beforeUpload={handleFileUpload}
              accept=".json,.xlsx,.xls,.csv"
              style={{ padding: '20px' }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持 JSON、Excel（xlsx/xls）和 CSV 文件，最大文件大小{' '}
                {FILE_SIZE_LIMIT / 1024 / 1024}MB
              </p>
            </Dragger>
          </Card>
        </Col>

        {fileList.length > 0 && (
          <Col span={24}>
            <Card title="最近文件">
              <Row gutter={[16, 16]}>
                {fileList.slice(0, 6).map((file) => (
                  <Col key={file.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      size="small"
                      style={{ position: 'relative' }}
                    >
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: '100%' }}
                      >
                        <div
                          style={{
                            textAlign: 'center',
                            fontSize: '24px',
                            color: '#1890ff',
                          }}
                        >
                          {file.type === 'json' ? (
                            <FileTextOutlined />
                          ) : (
                            <TableOutlined />
                          )}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {file.name.length > 20
                              ? `${file.name.substring(0, 20)}...`
                              : file.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {(file.size / 1024).toFixed(2)} KB
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                          {file.type === 'json' ? (
                            <Dropdown
                              menu={{ items: getJsonViewMenuItems(file) }}
                              trigger={['click']}
                            >
                              <Button size="small" type="primary">
                                <EyeOutlined />
                                查看 <DownOutlined />
                              </Button>
                            </Dropdown>
                          ) : (
                            <Button
                              size="small"
                              type="primary"
                              onClick={() => handleFileClick(file)}
                            >
                              <EyeOutlined />
                              查看
                            </Button>
                          )}
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Home;
