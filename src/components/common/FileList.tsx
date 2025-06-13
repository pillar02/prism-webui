import React, { useState } from 'react';
import { Table } from '@/ui/components/Table';
import { Button } from '@/ui/components/Button';
import { FeatherEye, FeatherDownloadCloud } from '@subframe/core';
import { useLazyQuery } from '@apollo/client';
import { QUERY_FILE_DETAILS } from '@/lib/graphql/file-queries';
import FilePreviewDialog from './FilePreviewDialog';
import { FileInfo } from "@/types/file";

interface FileListProps {
  files: FileInfo[];
  onView: (fileId: string) => void;
  onDownload: (fileId: string) => void;
}

import {
  FeatherFile,
  FeatherFileSpreadsheet,
  FeatherFileText,
  FeatherCheck,
  FeatherClock,
  FeatherAlertOctagon,
  FeatherLoader,
} from '@subframe/core';
import { Badge } from '@/ui/components/Badge';

export const getFileIcon = (type: FileInfo['type']) => {
  switch (type) {
    case 'PDF':
    case 'DOCX':
      return <FeatherFile className="text-body font-body text-neutral-500" />;
    case 'XLSX':
    case 'CSV':
      return <FeatherFileSpreadsheet className="text-body font-body text-neutral-500" />;
    case 'TXT':
      return <FeatherFileText className="text-body font-body text-neutral-500" />;
    default:
      return <FeatherFile className="text-body font-body text-neutral-500" />;
  }
};

export const getStatusBadge = (status: FileInfo['status']) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <Badge variant="success" icon={<FeatherCheck />}>
          已完成
        </Badge>
      );
    case 'PROCESSING':
      return <Badge icon={<FeatherClock />}>处理中</Badge>;
    case 'ERROR':
      return (
        <Badge variant="error" icon={<FeatherAlertOctagon />}>
          处理出错
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="neutral" icon={<FeatherLoader />}>
          待处理
        </Badge>
      );
    default:
      return null;
  }
};

const FileList: React.FC<FileListProps> = ({ files, onView, onDownload }) => {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [getFileDetails, { loading: loadingDetails }] = useLazyQuery(QUERY_FILE_DETAILS);

  const handleView = async (file: FileInfo) => {
    try {
      const { data } = await getFileDetails({ variables: { id: file.id } });
      if (data && data.file) {
        setSelectedFile(data.file);
      } else {
        setSelectedFile(file);
      }
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('获取文件详情失败:', error);
      setSelectedFile(file);
      setIsPreviewOpen(true);
    }
    if (onView) {
      onView(file.id);
    }
  };

  return (
    <>
      <Table
        className="w-full grow shrink-0 basis-0 bg-gray-50"
        header={
          <Table.HeaderRow>
            <Table.HeaderCell>文件名</Table.HeaderCell>
            <Table.HeaderCell>上传日期</Table.HeaderCell>
            <Table.HeaderCell>处理状态</Table.HeaderCell>
            <Table.HeaderCell>标签</Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.HeaderRow>
        }
      >
        {files.map((file) => (
          <Table.Row key={file.id} className="hover:bg-brand-100 hover:scale-[1.01] transition-all duration-200 cursor-pointer">
            <Table.Cell>
              <div className="flex items-center gap-2">
                {getFileIcon(file.type)}
                <span className="whitespace-nowrap text-body-bold font-body-bold text-neutral-700">
                  {file.name}
                </span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="whitespace-nowrap text-body font-body text-neutral-500">
                {file.uploadTime}
              </span>
            </Table.Cell>
            <Table.Cell>{getStatusBadge(file.status)}</Table.Cell>
            <Table.Cell>
              <div className="flex items-start gap-2">
                {file.tags?.map((tag) => (
                  <Badge key={tag} className="rounded-sm" variant="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Button
                  variant="neutral-tertiary"
                  icon={<FeatherEye />}
                  onClick={() => handleView(file)}
                >
                  查看
                </Button>
                {onDownload && (
                  <Button
                    variant="neutral-tertiary"
                    icon={<FeatherDownloadCloud />}
                    onClick={() => onDownload(file.id)}
                  >
                    下载
                  </Button>
                )}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      {selectedFile && (
        <FilePreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          file={selectedFile}
        />
      )}
    </>
  );
};

export default FileList;