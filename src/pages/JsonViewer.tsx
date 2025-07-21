import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Typography, Button, Space } from 'antd';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';
import { useAppSelector } from '@/hooks/useAppDispatch';
import type { JSONData } from '@/types';

const { Title } = Typography;

const JsonViewer: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { fileList, currentFile } = useAppSelector((state) => state.file);
  const [jsonData, setJsonData] = useState<JSONData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fileId) {
      loadJsonFile(fileId);
    }
  }, [fileId]);

  const loadJsonFile = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const file = fileList.find((f) => f.id === id) || currentFile;
      if (!file) {
        throw new Error('文件未找到');
      }

      // 模拟文件读取（实际项目中需要真实的文件读取逻辑）
      const mockJsonContent = {
        name: '示例数据',
        version: '1.0.0',
        description: '这是一个示例 JSON 文件',
        data: {
          users: [
            { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
            { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
          ],
          products: [
            { id: 1, name: '产品A', price: 99.9, category: '电子产品' },
            { id: 2, name: '产品B', price: 199.9, category: '家居用品' },
          ],
        },
        metadata: {
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T12:30:00Z',
          author: '系统管理员',
        },
      };

      const data: JSONData = {
        content: mockJsonContent,
        fileName: file.name,
        isValid: true,
      };

      setJsonData(data);
    } catch (error) {
      const errorData: JSONData = {
        content: null,
        fileName: '',
        isValid: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
      setJsonData(errorData);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (): void => {
    if (jsonData?.content) {
      navigator.clipboard.writeText(JSON.stringify(jsonData.content, null, 2));
    }
  };

  const handleDownload = (): void => {
    if (jsonData?.content) {
      const dataStr = JSON.stringify(jsonData.content, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = jsonData.fileName || 'data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!jsonData) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="文件未找到" type="error" />
      </div>
    );
  }

  if (!jsonData.isValid) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="JSON 解析错误"
          description={jsonData.error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              {jsonData.fileName}
            </Title>
            <Space>
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                复制 JSON
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                下载文件
              </Button>
            </Space>
          </div>
        </div>

        <div
          style={{
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '16px',
            backgroundColor: '#fafafa',
          }}
        >
          <ReactJson
            src={jsonData.content}
            theme="rjv-default"
            displayDataTypes={false}
            displayObjectSize={true}
            enableClipboard={true}
            collapsed={2}
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default JsonViewer;
