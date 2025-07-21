import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Table,
  Tabs,
  Spin,
  Alert,
  Typography,
  Button,
  Space,
} from 'antd';
import { DownloadOutlined, TableOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/useAppDispatch';
import type { ExcelData, ExcelSheet } from '@/types';

const { Title } = Typography;
const { TabPane } = Tabs;

const ExcelViewer: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { fileList, currentFile } = useAppSelector((state) => state.file);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fileId) {
      loadExcelFile(fileId);
    }
  }, [fileId]);

  const loadExcelFile = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const file = fileList.find((f) => f.id === id) || currentFile;
      if (!file) {
        throw new Error('文件未找到');
      }

      // 模拟 Excel 文件读取（实际项目中需要使用 xlsx 库读取真实文件）
      const mockExcelData: ExcelData = {
        fileName: file.name,
        sheets: [
          {
            name: '用户数据',
            headers: ['ID', '姓名', '年龄', '邮箱', '部门', '入职日期'],
            data: [
              ['ID', '姓名', '年龄', '邮箱', '部门', '入职日期'],
              [1, '张三', 28, 'zhangsan@example.com', '技术部', '2023-01-15'],
              [2, '李四', 32, 'lisi@example.com', '市场部', '2022-11-20'],
              [3, '王五', 25, 'wangwu@example.com', '技术部', '2023-03-01'],
              [4, '赵六', 29, 'zhaoliu@example.com', '财务部', '2022-08-10'],
              [5, '陈七', 31, 'chenqi@example.com', '人事部', '2023-02-14'],
            ],
          },
          {
            name: '销售数据',
            headers: ['月份', '产品名称', '销售额', '销量', '客户数'],
            data: [
              ['月份', '产品名称', '销售额', '销量', '客户数'],
              ['2024-01', '产品A', 50000, 120, 35],
              ['2024-01', '产品B', 35000, 80, 28],
              ['2024-02', '产品A', 58000, 145, 42],
              ['2024-02', '产品B', 42000, 95, 31],
              ['2024-03', '产品A', 62000, 156, 48],
              ['2024-03', '产品B', 48000, 110, 38],
            ],
          },
          {
            name: '财务报表',
            headers: ['项目', 'Q1收入', 'Q2收入', 'Q3收入', 'Q4收入'],
            data: [
              ['项目', 'Q1收入', 'Q2收入', 'Q3收入', 'Q4收入'],
              ['产品销售', 280000, 320000, 350000, 420000],
              ['服务收入', 120000, 145000, 160000, 180000],
              ['其他收入', 45000, 52000, 48000, 65000],
              ['总收入', 445000, 517000, 558000, 665000],
            ],
          },
        ],
      };

      setExcelData(mockExcelData);
    } catch (error) {
      setError(error instanceof Error ? error.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (): void => {
    if (excelData) {
      // 简单的 CSV 导出实现
      const csvContent = excelData.sheets
        .map((sheet) => {
          const sheetData = sheet.data
            .map((row) => row.map((cell) => `"${cell}"`).join(','))
            .join('\n');
          return `--- ${sheet.name} ---\n${sheetData}`;
        })
        .join('\n\n');

      const dataBlob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${excelData.fileName.replace(/\.[^/.]+$/, '')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const renderSheetTable = (sheet: ExcelSheet): React.ReactNode => {
    if (!sheet.data || sheet.data.length === 0) {
      return <Alert message="该工作表没有数据" type="info" />;
    }

    const headers = sheet.data[0];
    const dataRows = sheet.data.slice(1);

    const columns = headers.map((header, index) => ({
      title: String(header),
      dataIndex: index,
      key: index,
      render: (text: any) => String(text),
    }));

    const dataSource = dataRows.map((row, rowIndex) => {
      const record: any = { key: rowIndex };
      row.forEach((cell, cellIndex) => {
        record[cellIndex] = cell;
      });
      return record;
    });

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / 总共 ${total} 条`,
        }}
        scroll={{ x: 'max-content' }}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="文件读取错误"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!excelData) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="文件未找到" type="error" />
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
              <TableOutlined style={{ marginRight: '8px' }} />
              {excelData.fileName}
            </Title>
            <Space>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                导出 CSV
              </Button>
            </Space>
          </div>
        </div>

        <Tabs defaultActiveKey="0" type="card">
          {excelData.sheets.map((sheet, index) => (
            <TabPane tab={sheet.name} key={index}>
              <div style={{ marginTop: '16px' }}>{renderSheetTable(sheet)}</div>
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default ExcelViewer;
