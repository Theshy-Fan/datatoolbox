"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { toolCategories, getToolsByCategory } from "@/constants/tools";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 移动端汉堡菜单 */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="outline" size="icon" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* 桌面端固定侧边栏 */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-background">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}

interface SidebarContentProps {
  pathname: string;
  onNavigate?: () => void;
}

function SidebarContent({ pathname, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-6 py-4 hover:opacity-80 transition-opacity">
        <Braces className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">DataToolbox</span>
      </Link>

      <Separator />

      {/* 导航列表 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {toolCategories.map((category) => {
          const categoryTools = getToolsByCategory(category.id);
          if (categoryTools.length === 0) return null;

          return (
            <div key={category.id} className="mb-4">
              <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category.name}
              </h3>
              <div className="space-y-1">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = pathname === tool.href;

                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* 底部信息 */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          DataToolbox v1.0
        </p>
      </div>
    </div>
  );
}
