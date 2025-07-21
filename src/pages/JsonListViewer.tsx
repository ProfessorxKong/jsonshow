import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Spin,
  Alert,
  Typography,
  Button,
  Space,
  Select,
  Table,
  Tag,
  Checkbox,
  Row,
  Col,
  message,
} from 'antd';
import {
  DownloadOutlined,
  CopyOutlined,
  SettingOutlined,
  TableOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/hooks/useAppDispatch';
import type { JSONData } from '@/types';

const { Title, Text } = Typography;
const { Option } = Select;

interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
  dataIndex: string;
}

interface DataRecord {
  [key: string]: unknown;
  __index: number;
}

const JsonListViewer: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const { fileList, currentFile } = useAppSelector((state) => state.file);
  const [jsonData, setJsonData] = useState<JSONData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState<DataRecord[]>([]);
  const [availableKeys, setAvailableKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>([]);

  useEffect(() => {
    if (fileId) {
      loadJsonFile(fileId);
    }
  }, [fileId]);

  // 当JSON数据加载后，分析数据结构
  useEffect(() => {
    if (jsonData?.content) {
      analyzeJsonStructure(jsonData.content);
    }
  }, [jsonData]);

  // 当选择的键发生变化时，更新表格列配置
  useEffect(() => {
    updateTableColumns();
  }, [selectedKeys]);

  const loadJsonFile = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const file = fileList.find((f) => f.id === id) || currentFile;
      if (!file) {
        throw new Error('文件未找到');
      }

      if (!file.content) {
        throw new Error('文件内容为空或未能正确读取');
      }

      const data: JSONData = {
        content: file.content,
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

  const analyzeJsonStructure = (content: unknown): void => {
    try {
      // 检查是否为数组
      if (!Array.isArray(content)) {
        throw new Error('JSON数据不是数组格式，无法以列表形式展示');
      }

      if (content.length === 0) {
        throw new Error('数组为空');
      }

      // 获取所有可能的键名
      const keysSet = new Set<string>();
      const processedArray: DataRecord[] = [];

      content.forEach((item: unknown, index: number) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item as Record<string, unknown>).forEach((key) =>
            keysSet.add(key)
          );
          processedArray.push({
            ...(item as Record<string, unknown>),
            __index: index,
          });
        } else {
          // 如果数组项不是对象，创建一个包装对象
          keysSet.add('value');
          processedArray.push({ value: item, __index: index });
        }
      });

      const keys = Array.from(keysSet).sort();
      setAvailableKeys(keys);
      setDataArray(processedArray);

      // 默认选择前5个键或所有键（如果少于5个）
      const defaultKeys = keys.slice(0, Math.min(5, keys.length));
      setSelectedKeys(defaultKeys);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '数据分析失败');
      setAvailableKeys([]);
      setDataArray([]);
      setSelectedKeys([]);
    }
  };

  const updateTableColumns = (): void => {
    const newColumns: ColumnConfig[] = selectedKeys.map((key) => ({
      key,
      title: key,
      visible: true,
      dataIndex: key,
    }));
    setColumns(newColumns);
  };

  // 生成表格列配置
  const tableColumns = useMemo(() => {
    return columns
      .filter((col) => col.visible)
      .map((col) => ({
        title: col.title,
        dataIndex: col.dataIndex,
        key: col.key,
        render: (value: unknown) => {
          if (value === null || value === undefined) {
            return <Text type="secondary">-</Text>;
          }
          if (typeof value === 'object') {
            return (
              <Tag color="blue" style={{ cursor: 'pointer' }}>
                {Array.isArray(value) ? `数组[${value.length}]` : '对象'}
              </Tag>
            );
          }
          if (typeof value === 'boolean') {
            return <Tag color={value ? 'green' : 'red'}>{String(value)}</Tag>;
          }
          if (typeof value === 'number') {
            return <Text type="success">{value}</Text>;
          }
          // 字符串类型，如果太长则截断
          const stringValue = String(value);
          if (stringValue.length > 50) {
            return (
              <Text title={stringValue}>{stringValue.substring(0, 50)}...</Text>
            );
          }
          return stringValue;
        },
        ellipsis: true,
      }));
  }, [columns]);

  const handleKeySelection = (keys: string[]): void => {
    setSelectedKeys(keys);
  };

  const handleColumnVisibilityChange = (
    key: string,
    checked: boolean
  ): void => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible: checked } : col))
    );
  };

  const handleCopyData = (): void => {
    if (dataArray.length > 0) {
      const exportData = dataArray.map((item) => {
        const filteredItem: Record<string, unknown> = {};
        selectedKeys.forEach((key) => {
          if (key !== '__index') {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      message.success('数据已复制到剪贴板');
    }
  };

  const handleDownloadCsv = (): void => {
    if (dataArray.length === 0 || selectedKeys.length === 0) {
      message.warning('没有数据可导出');
      return;
    }

    const headers = selectedKeys.filter((key) => key !== '__index');
    const csvContent = [
      headers.join(','), // 标题行
      ...dataArray.map((item) =>
        headers
          .map((key) => {
            const value = item[key];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value).replace(/,/g, '，'); // 替换逗号避免CSV解析问题
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jsonData?.fileName || 'data'}_list.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('CSV文件已下载');
  };

  const handleSwitchToTreeView = (): void => {
    if (fileId) {
      navigate(`/json/${fileId}`);
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

  if (dataArray.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="数据格式不支持"
          description="只支持JSON对象数组的列表展示，请确保数据是对象数组格式"
          type="warning"
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
              marginBottom: '16px',
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              <TableOutlined style={{ marginRight: '8px' }} />
              {jsonData.fileName} - 列表视图
            </Title>
            <Space>
              <Button
                icon={<FileTextOutlined />}
                onClick={handleSwitchToTreeView}
              >
                树形视图
              </Button>
              <Button icon={<CopyOutlined />} onClick={handleCopyData}>
                复制数据
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownloadCsv}>
                导出CSV
              </Button>
            </Space>
          </div>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>选择要显示的字段：</Text>
              <Select
                mode="multiple"
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="选择要显示的字段"
                value={selectedKeys}
                onChange={handleKeySelection}
                maxTagCount="responsive"
              >
                {availableKeys.map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Text strong>列显示设置：</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {columns.map((col) => (
                    <Checkbox
                      key={col.key}
                      checked={col.visible}
                      onChange={(e) =>
                        handleColumnVisibilityChange(col.key, e.target.checked)
                      }
                    >
                      {col.title}
                    </Checkbox>
                  ))}
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary">
            共 {dataArray.length} 条记录，显示 {tableColumns.length} 个字段
          </Text>
        </div>

        <Table
          columns={tableColumns}
          dataSource={dataArray}
          rowKey="__index"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 20,
          }}
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default JsonListViewer;
