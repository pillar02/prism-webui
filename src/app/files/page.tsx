"use client";

import React, { useState } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { TextField } from "@/ui/components/TextField";
import { FeatherSearch } from "@subframe/core";
import { Button } from "@/ui/components/Button";
import { FeatherUpload } from "@subframe/core";
import { Tabs } from "@/ui/components/Tabs";
import { Badge } from "@/ui/components/Badge";
import * as SubframeCore from "@subframe/core";
import { FeatherFilter } from "@subframe/core";
import { Calendar } from "@/ui/components/Calendar";
import { FeatherCalendar } from "@subframe/core";
import { FeatherRefreshCw } from "@subframe/core";
import { FeatherAlertTriangle } from "@subframe/core";
import { Loader } from "@/ui/components/Loader";
import FileUploadDialog from "@/components/common/FileUploadDialog";
import FileList from "@/components/common/FileList";
import { useQuery } from "@apollo/client";
import { searchFiles } from '@/lib/graphql/file-queries'; // Changed import
import { FileInfo } from '@/types/file'; // FileInfo is already updated

// Define SortOrder type/enum if not available globally, for now using string literals
// type SortOrder = "ASC" | "DESC";
// Assuming FileFilterInput might be complex, using 'any' for now
// interface FileFilterInput { /* ... structure ... */ }


export default function FilesPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [filter, setFilter] = useState<any | null>(null); // Replace 'any' with actual FileFilterInput if defined
  const [sortBy, setSortBy] = useState<string>("uploadTimestamp");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const { loading, error, data, refetch } = useQuery(searchFiles, { // Changed query
    variables: {
      limit,
      offset,
      searchText,
      filter,
      sortBy,
      sortOrder,
    },
  });

  const filesToDisplay = data?.searchFiles || []; // Adjusted data extraction

  // TODO: Add functions to update filter, sortBy, sortOrder, limit, offset and call refetch()
  // For example, for search text:
  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchText(event.target.value);
  //   // Consider debouncing refetch or calling it on submit
  // };

  return (
    <DefaultPageLayout>
      <FileUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
      />
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-8 py-12 overflow-auto">
        <div className="flex w-full items-center gap-4">
          <TextField
            className="h-auto grow shrink-0 basis-0"
            variant="filled"
            label=""
            helpText=""
            icon={<FeatherSearch />}
          >
            <TextField.Input
              placeholder="Search files..."
              value={searchText} // Bind to searchText state
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchText(event.target.value);
                // TODO: Decide on refetch strategy (e.g., on-the-fly, on-submit, debounced)
                // For now, just updating state. A button or useEffect would trigger refetch.
              }}
            />
          </TextField>
          <Button
            className="h-auto w-auto flex-none self-stretch"
            size="large"
            icon={<FeatherUpload />}
            onClick={() => setIsUploadDialogOpen(true)}
          >
            上传文件
          </Button>
        </div>
        <div className="flex w-full flex-col items-start gap-6 rounded-md bg-neutral-50 px-6 py-6">
          <div className="flex w-full items-center justify-between mobile:flex-row mobile:flex-wrap mobile:items-start mobile:justify-end mobile:gap-4">
            <Tabs className="h-auto w-auto flex-none mobile:h-auto mobile:grow mobile:shrink-0 mobile:basis-0">
              <Tabs.Item active={true}>所有文件</Tabs.Item>
              <Tabs.Item>发票</Tabs.Item>
              <Tabs.Item>合同</Tabs.Item>
              <Tabs.Item>银行回单</Tabs.Item>
              <Tabs.Item>财务报表</Tabs.Item>
            </Tabs>
            <div className="flex items-center gap-2">
              <SubframeCore.Popover.Root>
                <SubframeCore.Popover.Trigger asChild={true}>
                  <Button
                    variant="neutral-secondary"
                    icon={<FeatherFilter />}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                  >
                    按标签筛选
                  </Button>
                </SubframeCore.Popover.Trigger>
                <SubframeCore.Popover.Portal>
                  <SubframeCore.Popover.Content
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    asChild={true}
                  >
                    <div className="flex flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
                      <div className="flex w-full flex-wrap items-start gap-2">
                        <Badge className="rounded-sm cursor-pointer">财务</Badge>
                        <Badge
                          className="rounded-sm cursor-pointer"
                          variant="neutral"
                        >
                          人力资源
                        </Badge>
                        <Badge className="rounded-sm cursor-pointer">战略</Badge>
                        <Badge
                          className="rounded-sm cursor-pointer"
                          variant="neutral"
                        >
                          合规
                        </Badge>
                        <Badge
                          className="rounded-sm cursor-pointer"
                          variant="neutral"
                        >
                          客户服务
                        </Badge>
                      </div>
                      <div className="flex w-full items-center justify-end gap-2">
                        <Button
                          className="h-auto w-auto flex-none"
                          variant="destructive-secondary"
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {}}
                        >
                          取消
                        </Button>
                        <Button
                          className="h-auto w-auto flex-none"
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {}}
                        >
                          应用
                        </Button>
                      </div>
                    </div>
                  </SubframeCore.Popover.Content>
                </SubframeCore.Popover.Portal>
              </SubframeCore.Popover.Root>
              <SubframeCore.Popover.Root>
                <SubframeCore.Popover.Trigger asChild={true}>
                  <Button
                    variant="neutral-secondary"
                    icon={<FeatherCalendar />}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                  >
                    按日期筛选
                  </Button>
                </SubframeCore.Popover.Trigger>
                <SubframeCore.Popover.Portal>
                  <SubframeCore.Popover.Content
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    asChild={true}
                  >
                    <div className="flex flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
                      <div className="flex w-full items-center gap-4">
                        <div className="flex flex-col items-start gap-2">
                          <span className="text-caption-bold font-caption-bold text-default-font">
                            开始日期
                          </span>
                          <Calendar
                            mode={"single"}
                            selected={new Date()}
                            onSelect={(date: Date | undefined) => {}}
                          />
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <span className="text-caption-bold font-caption-bold text-default-font">
                            结束日期
                          </span>
                          <Calendar
                            mode={"single"}
                            selected={new Date()}
                            onSelect={(date: Date | undefined) => {}}
                          />
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-end gap-2">
                        <Button
                          className="h-auto w-auto flex-none"
                          variant="destructive-secondary"
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {}}
                        >
                          取消
                        </Button>
                        <Button
                          className="h-auto w-auto flex-none"
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {}}
                        >
                          应用
                        </Button>
                      </div>
                    </div>
                  </SubframeCore.Popover.Content>
                </SubframeCore.Popover.Portal>
              </SubframeCore.Popover.Root>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center w-full h-48">
                  <Loader className="text-brand-600 h-8 w-8" />
                  <span className="ml-2 text-body font-body text-subtext-color">正在加载文件列表...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center w-full h-48">
                  <FeatherAlertTriangle className="text-error-600 h-8 w-8" />
                  <span className="ml-2 text-body font-body text-subtext-color">获取文件列表失败: {error.message}</span>
                </div>
              ) : filesToDisplay.length > 0 ? (
                <FileList 
                  files={filesToDisplay} 
                  onView={(fileId) => console.log('View file:', fileId)} 
                  onDownload={(fileId) => console.log('Download file:', fileId)} 
                />
              ) : (
                <div className="flex items-center justify-center w-full h-48">
                  <FeatherAlertTriangle className="text-warning-600 h-8 w-8" />
                  <span className="ml-2 text-body font-body text-subtext-color">暂无文件。</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}