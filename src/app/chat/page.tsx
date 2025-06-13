"use client";

import React from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherX } from "@subframe/core";
import { Alert } from "@/ui/components/Alert";
import { Table } from "@/ui/components/Table";
import { FeatherChevronsDown } from "@subframe/core";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { FeatherMoreVertical } from "@subframe/core";
import { TextFieldUnstyled } from "@/ui/components/TextFieldUnstyled";
import { FeatherSend } from "@subframe/core";

function FinancialAiChat() {
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-center gap-6 bg-default-background pt-12 pb-4">
        <div className="flex w-full max-w-[1024px] grow shrink-0 basis-0 flex-col items-center relative">
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2 pb-4 overflow-auto">
            <Alert
              variant="warning"
              title="仍有文件正在后台处理中"
              description="发票、合同等 3 个文件仍在处理中，无法提供相关内容问答"
              actions={
                <IconButton
                  icon={<FeatherX />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              }
            />
            <span className="w-full text-caption font-caption text-subtext-color text-center">
              今天 14:25
            </span>
            <div className="flex w-full items-center gap-4 py-2 flex-row-reverse">
              <div className="flex grow shrink-0 basis-0 items-center gap-4 rounded-lg bg-brand-50 px-4 py-3">
                <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-brand-600 text-center">
                  公司2023年的总收入是多少？
                </span>
              </div>
            </div>
            <div className="flex w-full items-start gap-4 py-2">
              <img
                className="h-6 w-6 flex-none object-cover"
                src="https://res.cloudinary.com/subframe/image/upload/v1711417511/shared/t4qorgih4yjwudzjfkxq.png"
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                <span className="w-full whitespace-pre-wrap text-body font-body text-default-font">
                  {"根据您的文件，2023年的总收入为85,750元，具体明细如下："}
                </span>
                <Table
                  header={
                    <Table.HeaderRow>
                      <Table.HeaderCell>收入类型</Table.HeaderCell>
                      <Table.HeaderCell>金额</Table.HeaderCell>
                    </Table.HeaderRow>
                  }
                >
                  <Table.Row>
                    <Table.Cell>
                      <span className="text-body font-body text-default-font">
                        W2工资收入
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body-bold font-body-bold text-default-font">
                        ¥75,000
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <span className="text-body font-body text-default-font">
                        1099自由职业收入
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body-bold font-body-bold text-default-font">
                        ¥10,750
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table>
              </div>
            </div>
            <span className="w-full text-caption font-caption text-subtext-color text-center">
              今天 14:26
            </span>
            <div className="flex w-full items-center gap-4 py-2 flex-row-reverse">
              <div className="flex grow shrink-0 basis-0 items-center gap-4 rounded-lg bg-brand-50 px-4 py-3">
                <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-brand-600 text-center">
                  这些收入需要缴纳多少税？
                </span>
              </div>
            </div>
            <div className="flex w-full items-start gap-4 py-2">
              <img
                className="h-6 w-6 flex-none object-cover"
                src="https://res.cloudinary.com/subframe/image/upload/v1711417511/shared/t4qorgih4yjwudzjfkxq.png"
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                <span className="w-full whitespace-pre-wrap text-body font-body text-default-font">
                  {"根据您的收入情况，预计需要缴纳的税款如下："}
                </span>
                <Table
                  header={
                    <Table.HeaderRow>
                      <Table.HeaderCell>税费类型</Table.HeaderCell>
                      <Table.HeaderCell>金额</Table.HeaderCell>
                    </Table.HeaderRow>
                  }
                >
                  <Table.Row>
                    <Table.Cell>
                      <span className="text-body font-body text-default-font">
                        个人所得税
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body-bold font-body-bold text-default-font">
                        ¥12,862
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <span className="text-body font-body text-default-font">
                        社会保险费
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body-bold font-body-bold text-default-font">
                        ¥6,435
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <span className="text-body-bold font-body-bold text-default-font">
                        总计
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body-bold font-body-bold text-default-font">
                        ¥19,297
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table>
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-[768px] flex-col items-start gap-8 bg-default-background">
            <div className="flex w-full flex-col items-start gap-2 pb-4">
              <div className="flex w-full grow shrink-0 basis-0 items-center justify-center mb-4">
                <IconButton
                  className="h-12 w-12 flex-none"
                  variant="neutral-primary"
                  size="large"
                  icon={<FeatherChevronsDown />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </div>
              <div className="flex h-14 w-full flex-none items-center gap-4 overflow-hidden rounded-lg bg-neutral-100 px-4 py-3">
                <SubframeCore.DropdownMenu.Root>
                  <SubframeCore.DropdownMenu.Trigger asChild={true}>
                    <IconButton
                      icon={<FeatherMoreVertical />}
                      onClick={(
                        event: React.MouseEvent<HTMLButtonElement>
                      ) => {}}
                    />
                  </SubframeCore.DropdownMenu.Trigger>
                  <SubframeCore.DropdownMenu.Portal>
                    <SubframeCore.DropdownMenu.Content
                      side="top"
                      align="start"
                      sideOffset={4}
                      asChild={true}
                    >
                      <DropdownMenu className="h-auto w-auto min-w-[128px] flex-none">
                        <DropdownMenu.DropdownItem icon={null}>
                          提示词模版 1
                        </DropdownMenu.DropdownItem>
                        <DropdownMenu.DropdownItem icon={null}>
                          提示词模版 2
                        </DropdownMenu.DropdownItem>
                      </DropdownMenu>
                    </SubframeCore.DropdownMenu.Content>
                  </SubframeCore.DropdownMenu.Portal>
                </SubframeCore.DropdownMenu.Root>
                <TextFieldUnstyled className="h-auto grow shrink-0 basis-0">
                  <TextFieldUnstyled.Input
                    className="h-12 w-full flex-none"
                    placeholder="询问您的财务问题..."
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {}}
                  />
                </TextFieldUnstyled>
                <IconButton
                  className="h-8 w-16 flex-none"
                  variant="brand-primary"
                  icon={<FeatherSend />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </div>
              <span className="w-full text-caption font-caption text-subtext-color text-center">
                AI可能会出错，请务必与专业人士核实税务计算结果。
              </span>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default FinancialAiChat;