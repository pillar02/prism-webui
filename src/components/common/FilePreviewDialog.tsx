"use client";

import React, { useState } from "react";
import { DialogLayout } from "@/ui/layouts/DialogLayout";
import { FeatherFile, FeatherClock, FeatherCheck, FeatherDownloadCloud, FeatherX, FeatherChevronLeft, FeatherChevronRight, FeatherEdit, FeatherPlus } from "@subframe/core";
import { Badge } from "@/ui/components/Badge";
import { getStatusBadge, getFileIcon } from "@/components/common/FileList"; // Added getFileIcon
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { Select } from "@/ui/components/Select";
import { TextField } from "@/ui/components/TextField";
import { FilePreviewDialogProps, InvoiceData, ContractData, BankSlipData } from "@/types/file"; // Added imports

function FilePreviewDialog({ open, onOpenChange, file }: FilePreviewDialogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // 这里应该根据实际文件页数来设置

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <DialogLayout open={open} onOpenChange={onOpenChange}>
      <div className="flex h-144 w-full max-w-[1280px] flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between rounded-md bg-neutral-50 px-6 py-4">
          <div className="flex grow shrink-0 basis-0 items-center gap-4">
            <div className="flex items-center gap-2">
              {getFileIcon(file.fileType || 'OTHER')}
              <span className="text-heading-3 font-heading-3 text-default-font">
                {file.fileName}
              </span>
            </div>
            <Badge variant="neutral" icon={<FeatherClock />}>
              {file.uploadTimestamp}
            </Badge>
            {getStatusBadge(file.processingStatus)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral-secondary"
              icon={<FeatherDownloadCloud />}
              onClick={() => {}}
            >
              下载
            </Button>
            <IconButton
              variant="destructive-tertiary"
              icon={<FeatherX />}
              onClick={() => onOpenChange(false)}
            />
          </div>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 items-start">
          <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch">
            <div className="flex w-full min-w-[320px] grow shrink-0 basis-0 flex-col items-center overflow-hidden rounded-md border border-solid border-neutral-border bg-default-background shadow-sm">
              <div className="flex w-full grow shrink-0 basis-0 flex-col items-center justify-center gap-6 bg-default-background px-12 py-12">
                <img
                  className="flex-none rounded-sm"
                  src={file.previewImageUrl}
                  alt={file.fileName}
                />
              </div>
              <div className="flex w-full flex-wrap items-center justify-center gap-4 border-b border-solid border-neutral-border bg-neutral-50 px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <IconButton
                    icon={<FeatherChevronLeft />}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  />
                  <span className="text-body font-body text-subtext-color">
                    {currentPage} of {totalPages}
                  </span>
                  <IconButton
                    icon={<FeatherChevronRight />}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch px-6 py-6 overflow-auto">
            <div className="flex w-full items-center justify-end gap-2">
              <Button
                disabled={true}
                variant="neutral-secondary"
                icon={<FeatherEdit />}
                onClick={() => {}}
              >
                编辑
              </Button>
              <Button
                variant="neutral-secondary"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button
                variant="brand-secondary"
                onClick={() => {}}
              >
                保存更改
              </Button>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-heading-3 font-heading-3 text-default-font">
                文件类型
              </span>
              <Select
                label=""
                placeholder="Select"
                helpText=""
                value={file.documentType || ""} // Changed to documentType
                onValueChange={(value: string) => {}}
              >
                <Select.Item value="pdf">PDF</Select.Item>
                <Select.Item value="image">图片</Select.Item>
                <Select.Item value="document">文档</Select.Item>
              </Select>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-heading-3 font-heading-3 text-default-font">
                结构化信息
              </span>
              <div className="flex w-full flex-col items-start gap-4">
                {file.structuredData?.__typename === 'InvoiceData' && (
                  <>
                    <TextField label="Invoice Number" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as InvoiceData).invoiceNumber || ""} readOnly={true} />
                    </TextField>
                    <TextField label="Issuer Name" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as InvoiceData).issuerName || ""} readOnly={true} />
                    </TextField>
                    <TextField label="Total Amount" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as InvoiceData).totalAmount?.toString() || ""} readOnly={true} />
                    </TextField>
                  </>
                )}
                {file.structuredData?.__typename === 'ContractData' && (
                  <>
                    <TextField label="Contract Name" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as ContractData).contractName || ""} readOnly={true} />
                    </TextField>
                    <TextField label="Party A" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as ContractData).partyA || ""} readOnly={true} />
                    </TextField>
                    <TextField label="Total Amount" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as ContractData).totalAmount?.toString() || ""} readOnly={true} />
                    </TextField>
                  </>
                )}
                {file.structuredData?.__typename === 'BankSlipData' && (
                  <>
                    <TextField label="Payer Name" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as BankSlipData).payerName || ""} readOnly={true} />
                    </TextField>
                    <TextField label="Payee Name" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as BankSlipData).payeeName || ""} readOnly={true} />
                    </TextField>
                    <TextField label="Payment Amount" disabled={true} className="w-full">
                      <TextField.Input value={(file.structuredData as BankSlipData).paymentAmount?.toString() || ""} readOnly={true} />
                    </TextField>
                  </>
                )}
                {!file.structuredData || !['InvoiceData', 'ContractData', 'BankSlipData'].includes(file.structuredData?.__typename || "") && (
                  <p className="text-body font-body text-subtext-color">No specific structured data preview available for this document type.</p>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-heading-3 font-heading-3 text-default-font">
                标签管理
              </span>
              <div className="flex w-full flex-wrap items-start gap-2">
                {file.userTags?.map((tag, index) => (
                  <Badge key={index} className="rounded-sm" variant="neutral">
                    {tag}
                  </Badge>
                ))}
                <Button
                  variant="neutral-tertiary"
                  size="small"
                  icon={<FeatherPlus />}
                  onClick={() => {}}
                >
                  添加标签
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogLayout>
  );
}

export default FilePreviewDialog;