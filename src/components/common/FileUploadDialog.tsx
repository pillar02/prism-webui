"use client";

import React from "react";
import { DialogLayout } from "@/ui/layouts/DialogLayout";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherX } from "@subframe/core";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { FeatherUploadCloud } from "@subframe/core";
import { Button } from "@/ui/components/Button";
import { FeatherPlus } from "@subframe/core";
import { Table } from "@/ui/components/Table";
import { FeatherFileText } from "@subframe/core";
import { Progress } from "@/ui/components/Progress";
import { FeatherTable } from "@subframe/core";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FileUploadDialog({ open, onOpenChange }: FileUploadDialogProps) {
  return (
    <DialogLayout open={open} onOpenChange={onOpenChange}>
      <div className="flex h-full w-full min-w-[768px] flex-col items-start gap-6 bg-default-background px-8 py-6">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-2 font-heading-2 text-default-font">
            选择文件
          </span>
          <IconButton
            icon={<FeatherX />}
            onClick={() => onOpenChange(false)}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-4 rounded-md border border-dashed border-neutral-border bg-neutral-50 px-8 py-12">
          <IconWithBackground size="large" icon={<FeatherUploadCloud />} />
          <div className="flex flex-col items-center gap-2">
            <span className="text-body-bold font-body-bold text-default-font">
              拖拽文件到这里或点击选择
            </span>
            <span className="text-body font-body text-subtext-color">
              支持 PDF、DOCX、XLSX、CSV 等格式
            </span>
          </div>
          <Button
            variant="brand-secondary"
            icon={<FeatherPlus />}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            选择文件
          </Button>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-body-bold font-body-bold text-default-font">
              正在上传 (3)
            </span>
            <Button
              variant="destructive-secondary"
              icon={<FeatherX />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              取消全部
            </Button>
          </div>
          <Table
            header={
              <Table.HeaderRow>
                <Table.HeaderCell>文件名</Table.HeaderCell>
                <Table.HeaderCell>大小</Table.HeaderCell>
                <Table.HeaderCell>进度</Table.HeaderCell>
                <Table.HeaderCell>操作</Table.HeaderCell>
              </Table.HeaderRow>
            }
          >
            <Table.Row>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <FeatherFileText className="text-body font-body text-neutral-500" />
                  <span className="whitespace-nowrap text-body-bold font-body-bold text-neutral-700">
                    Q4_Financial_Report.pdf
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  2.4 MB
                </span>
              </Table.Cell>
              <Table.Cell>
                <Progress value={75} />
              </Table.Cell>
              <Table.Cell>
                <IconButton
                  variant="destructive-tertiary"
                  icon={<FeatherX />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <FeatherFileText className="text-body font-body text-neutral-500" />
                  <span className="whitespace-nowrap text-body-bold font-body-bold text-neutral-700">
                    Tax_Records_2023.pdf
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  1.8 MB
                </span>
              </Table.Cell>
              <Table.Cell>
                <Progress value={45} />
              </Table.Cell>
              <Table.Cell>
                <IconButton
                  variant="destructive-tertiary"
                  icon={<FeatherX />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <FeatherTable className="text-body font-body text-neutral-500" />
                  <span className="whitespace-nowrap text-body-bold font-body-bold text-neutral-700">
                    Revenue_Analysis.xlsx
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  856 KB
                </span>
              </Table.Cell>
              <Table.Cell>
                <Progress value={25} />
              </Table.Cell>
              <Table.Cell>
                <IconButton
                  variant="destructive-tertiary"
                  icon={<FeatherX />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>
      </div>
    </DialogLayout>
  );
}

export default FileUploadDialog; 