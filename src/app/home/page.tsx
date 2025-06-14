"use client";

"use client";

import React, { useState, useEffect } from "react"; // Combined useEffect import
import { useRouter } from 'next/navigation';
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { FeatherUpload } from "@subframe/core";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { FeatherFile } from "@subframe/core";
import { FeatherCpu } from "@subframe/core";
import { Loader } from "@/ui/components/Loader";
import { Progress } from "@/ui/components/Progress";
import { FeatherMemoryStick } from "@subframe/core";
import { FeatherHardDrive } from "@subframe/core";
import { FeatherAlertTriangle } from "@subframe/core";
import FileUploadDialog from "@/components/common/FileUploadDialog";
import FileList from "@/components/common/FileList";
import ActivityCalendar, { type ThemeInput, type Activity, Block } from 'react-activity-calendar';
import { FileInfo } from '@/types/file'; // Assuming FileInfo will be updated or is flexible
import { useQuery } from "@apollo/client";
import { searchFiles, getUploadActivity } from '@/lib/graphql/file-queries'; // Changed import

function Dashboard() {
  const numRecentFiles = 5;
  const router = useRouter();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Query for recent files
  const { loading: recentFilesLoading, error: recentFilesError, data: recentFilesData } = useQuery(searchFiles, {
    variables: { limit: numRecentFiles },
  });

  // Query for activity data
  const { loading: activityLoading, error: activityError, data: rawActivityData } = useQuery(getUploadActivity);

  const [activityData, setActivityData] = useState<Activity[]>([]);

  useEffect(() => {
    if (rawActivityData && rawActivityData.getUploadActivity) {
      // Ensure level is within the 0-4 range if not already
      const processedData = rawActivityData.getUploadActivity.map((activity: any) => ({
        ...activity,
        level: Math.min(Math.max(activity.level, 0), 4) as 0 | 1 | 2 | 3 | 4,
      }));
      setActivityData(processedData);
    }
  }, [rawActivityData]);

  const recentFilesToDisplay = recentFilesData?.searchFiles || []; // Adjusted data extraction

  const explicitTheme: ThemeInput = {
    light: [
      "rgb(245, 243, 255)", // brand-50
      "rgb(221, 214, 254)", // brand-200
      "rgb(196, 181, 253)", // brand-300
      "rgb(167, 139, 250)", // brand-400
      "rgb(124, 58, 237)",  // brand-600 (Primary)
    ]
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-8 bg-default-background py-12 overflow-auto">
        <div className="flex w-full flex-wrap items-start gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col flex-wrap items-start gap-4 self-stretch">
            <span className="text-heading-3 font-heading-3 text-default-font">
              文件统计
            </span>
            <div className="flex w-full flex-wrap items-start gap-4">
              <div className="flex min-w-[160px] grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch rounded-md bg-neutral-50 px-6 py-6">
                <IconWithBackground size="large" icon={<FeatherFile />} />
                <div className="flex w-full flex-col items-start gap-1">
                  <span className="w-full text-heading-2 font-heading-2 text-default-font">
                    2,451
                  </span>
                  <span className="line-clamp-1 w-full text-body font-body text-subtext-color">
                    总文件数
                  </span>
                </div>
              </div>
              <div className="flex min-w-[160px] grow shrink-0 basis-0 flex-col items-start gap-6 self-stretch rounded-md bg-neutral-50 px-6 py-6">
                <IconWithBackground
                  variant="warning"
                  size="large"
                  icon={<FeatherFile />}
                />
                <div className="flex w-full flex-col items-start gap-1">
                  <span className="w-full text-heading-2 font-heading-2 text-default-font">
                    12
                  </span>
                  <span className="line-clamp-1 w-full text-body font-body text-subtext-color">
                    待处理文件
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col flex-wrap items-start gap-4 self-stretch">
            <span className="text-heading-3 font-heading-3 text-default-font">
              系统指标
            </span>
            <div className="flex w-full min-w-[160px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-md bg-neutral-50 px-6 py-6">
              <div className="flex w-full flex-col items-start">
                <div className="flex w-full items-center gap-2">
                  <FeatherCpu className="text-body font-body text-brand-600" />
                  <span className="text-body-bold font-body-bold text-default-font">
                    CPU占用率
                  </span>
                  <span className="grow shrink-0 basis-0 text-body font-body text-success-700 text-right">
                    32%
                  </span>
                </div>
                <Progress value={32} />
              </div>
              <div className="flex w-full flex-col items-start">
                <div className="flex w-full items-center gap-2">
                  <FeatherMemoryStick className="text-body font-body text-warning-600" />
                  <span className="text-body-bold font-body-bold text-default-font">
                    内存占用率
                  </span>
                  <span className="grow shrink-0 basis-0 text-body font-body text-warning-600 text-right">
                    78%
                  </span>
                </div>
                <Progress value={78} />
              </div>
              <div className="flex w-full flex-col items-start">
                <div className="flex w-full items-center gap-2">
                  <FeatherHardDrive className="text-body font-body text-error-600" />
                  <span className="text-body-bold font-body-bold text-default-font">
                    存储使用率
                  </span>
                  <span className="grow shrink-0 basis-0 text-body font-body text-error-600 text-right">
                    85%
                  </span>
                </div>
                <Progress value={85} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <span className="text-heading-3 font-heading-3 text-default-font">
            文件上传日历
          </span>
          <div className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-50 px-6 py-6">
            <div className="w-full overflow-x-auto"> {/* Added flex justify-center for centering if content is narrower than container, and pt-6 for padding */}
              {activityLoading && (
                <div className="flex items-center justify-center w-full h-32"> {/* Adjust height as needed */}
                  <Loader className="text-brand-600 h-6 w-6" />
                  <span className="ml-2 text-body font-body text-subtext-color">正在加载活动日历...</span>
                </div>
              )}
              {activityError && (
                <div className="flex items-center justify-center w-full h-32"> {/* Adjust height as needed */}
                  <FeatherAlertTriangle className="text-error-600 h-6 w-6" />
                  <span className="ml-2 text-body font-body text-subtext-color">获取活动日历失败: {activityError.message}</span>
                </div>
              )}
              {!activityLoading && !activityError && activityData.length > 0 && (
                <ActivityCalendar
                  data={activityData}
                  theme={explicitTheme}
                  colorScheme="light"
                  blockSize={14}
                  blockRadius={20} // Note: blockRadius was 20, but react-activity-calendar uses `blockRadius` for border-radius of blocks, typical values are 2 or 4.
                                   // If this was intended for spacing or some other visual effect, it might need adjustment.
                                   // For now, I'll keep it as is, assuming it was a deliberate choice.
                  fontSize={16}
                  renderBlock={(block, activity) => (
                    <div title={`Date: ${activity.date} - Count: ${activity.count}`}>
                      {block}
                    </div>
                  )}
                  eventHandlers={{
                    onClick: (event) => (activity) => {
                      console.log('Activity clicked:', activity);
                    }
                  }}
                  labels={{
                    totalCount: '{{year}} 年共上传 {{count}} 份文件',
                    legend: {
                      less: '更少',
                      more: '更多',
                    },
                    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    // weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                  }}
                />
              )}
              {!activityLoading && !activityError && activityData.length === 0 && !rawActivityData?.getUploadActivity && (
                 <div className="flex items-center justify-center w-full h-32"> {/* Adjust height as needed */}
                  <FeatherAlertTriangle className="text-warning-600 h-6 w-6" />
                  <span className="ml-2 text-body font-body text-subtext-color">暂无活动数据。</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
                theme={explicitTheme}
                colorScheme="light"
                blockSize={14}
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
              最近上传
            </span>

            <Button
              variant="brand-tertiary"
              onClick={() => router.push('/files')}
            >
              查看全部
            </Button>
            <Button
              className="h-auto w-auto flex-none self-stretch"
              variant="brand-primary"
              size="large"
              icon={<FeatherUpload />}
              onClick={() => setIsUploadDialogOpen(true)}
            >
              上传文件
            </Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center w-full h-48">
              <Loader className="text-brand-600 h-8 w-8" />
              <span className="ml-2 text-body font-body text-subtext-color">正在加载最近文件...</span>
            </div>
        ) : recentFilesError ? (
             <div className="flex items-center justify-center w-full h-48">
              <FeatherAlertTriangle className="text-error-600 h-8 w-8" />
            <span className="ml-2 text-body font-body text-subtext-color">获取最近文件失败: {recentFilesError.message}</span>
            </div>
          ) : recentFilesToDisplay.length > 0 ? (
            <FileList files={recentFilesToDisplay} onView={() => {}} onDownload={() => {}} />
          ) : (
            <div className="flex items-center justify-center w-full h-48">
              <FeatherAlertTriangle className="text-warning-600 h-8 w-8" />
              <span className="ml-2 text-body font-body text-subtext-color">暂无最近上传文件。</span>
            </div>
          )}
      </div>
      <FileUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
      />
      </div>
    </DefaultPageLayout>
  );
}

export default Dashboard;