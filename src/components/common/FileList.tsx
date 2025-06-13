import React, { useState } from 'react';
import { Table } from '@/ui/components/Table';
import { Button } from '@/ui/components/Button';
import { FeatherEye, FeatherDownloadCloud } from '@subframe/core';
import { useLazyQuery } from '@apollo/client';
import { getFileDetails } from '@/lib/graphql/file-queries';
import FilePreviewDialog from './FilePreviewDialog';
import { FileListItemView, FileDetailView } from "@/types/file"; // Changed FileInfo to FileListItemView

interface FileListProps {
  files: FileListItemView[]; // Changed FileInfo to FileListItemView
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

export const getFileIcon = (type: FileListItemView['fileType']) => { // Changed FileInfo to FileListItemView
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

export const getStatusBadge = (status: FileListItemView['processingStatus']) => { // Changed FileInfo to FileListItemView
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
  const [selectedFile, setSelectedFile] = useState<FileDetailView | null>(null); // Changed type here
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [fetchFileDetailsForPreview, { loading: loadingDetails }] = useLazyQuery(getFileDetails);

  const handleView = async (fileItem: FileListItemView) => { // Changed FileInfo to FileListItemView
    try {
      // Fetch full details
      const { data, error: queryError } = await fetchFileDetailsForPreview({ variables: { id: fileItem.id } });

      if (queryError) {
        console.error('获取文件详情失败 (queryError):', queryError.message);
        setIsPreviewOpen(false);
        setSelectedFile(null);
        // Optionally: notify user via toast or inline message
        if (onView) onView(fileItem.id); // Still call onView to indicate an attempt was made
        return;
      }

      if (data && data.getFileDetails) {
        setSelectedFile(data.getFileDetails);
        setIsPreviewOpen(true);
      } else {
        console.warn('获取文件详情未返回数据 for ID:', fileItem.id);
        setIsPreviewOpen(false);
        setSelectedFile(null);
        // Optionally: notify user
      }
    } catch (error) { // Catch network or other unexpected errors during the async operation
      console.error('获取文件详情时发生异常:', error);
      setIsPreviewOpen(false);
      setSelectedFile(null);
      // Optionally: notify user
    }

    // Call onView callback if provided, regardless of success, to indicate interaction
    // Or, only call it on successful preview open, depending on desired UX.
    // For now, calling it to signify an attempt.
    if (onView) {
      onView(fileItem.id);
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
                {getFileIcon(file.fileType)}
                <span className="whitespace-nowrap text-body-bold font-body-bold text-neutral-700">
                  {file.fileName}
                </span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="whitespace-nowrap text-body font-body text-neutral-500">
                {file.uploadTimestamp}
              </span>
            </Table.Cell>
            <Table.Cell>{getStatusBadge(file.processingStatus)}</Table.Cell>
            <Table.Cell>
              <div className="flex items-start gap-2">
                {file.userTags?.map((tag) => (
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