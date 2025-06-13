"use client";
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Sidebar with large items — https://app.subframe.com/library?component=Sidebar+with+large+items_70c3656e-47c2-460e-8007-e198804e8862
 * Dropdown Menu — https://app.subframe.com/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Avatar — https://app.subframe.com/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { SidebarWithLargeItems } from "../components/SidebarWithLargeItems";
import { FeatherHome } from "@subframe/core";
import { FeatherFiles } from "@subframe/core";
import { FeatherMessageSquare } from "@subframe/core";
import { DropdownMenu } from "../components/DropdownMenu";
import { FeatherStar } from "@subframe/core";
import { FeatherPlus } from "@subframe/core";
import { FeatherEdit2 } from "@subframe/core";
import { FeatherTrash } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { FeatherLogOut } from "@subframe/core";
import { usePathname, useRouter } from "next/navigation";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex h-screen w-full items-center",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SidebarWithLargeItems
        className="mobile:hidden"
        header={
          <div className="flex items-center gap-6">
            <img
              className="h-9 w-9 flex-none object-cover"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417511/shared/t4qorgih4yjwudzjfkxq.png"
            />
            <span className="text-heading-1 font-heading-1 text-default-font">
              Prism
            </span>
          </div>
        }
        footer={
          <div className="flex w-full items-center gap-10">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Avatar
                  size="large"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                  square={true}
                >
                  A
                </Avatar>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon={<FeatherStar />}>
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherPlus />}>
                      Add
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherEdit2 />}>
                      Edit
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherTrash />}>
                      Delete
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
            <Button
              className="h-8 grow shrink-0 basis-0"
              variant="destructive-tertiary"
              icon={<FeatherLogOut />}
            >
              退出登陆
            </Button>
          </div>
        }
      >
        <SidebarWithLargeItems.NavItem 
          icon={<FeatherHome />} 
          selected={pathname === "/home"}
          onClick={() => handleNavigation("/home")}
        >
          主页
        </SidebarWithLargeItems.NavItem>
        <SidebarWithLargeItems.NavItem 
          icon={<FeatherFiles />}
          selected={pathname === "/files"}
          onClick={() => handleNavigation("/files")}
        >
          文件管理
        </SidebarWithLargeItems.NavItem>
        <SidebarWithLargeItems.NavItem 
          icon={<FeatherMessageSquare />}
          selected={pathname === "/chat"}
          onClick={() => handleNavigation("/chat")}
        >
          智能对话
        </SidebarWithLargeItems.NavItem>
      </SidebarWithLargeItems>
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;
