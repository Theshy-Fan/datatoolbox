import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col lg:pl-72">
        {/* 顶部栏 */}
        <header className="flex items-center justify-end px-6 py-3 border-b">
          <ThemeToggle />
        </header>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
