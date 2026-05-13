import Link from "next/link";
import { Braces } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tools, toolCategories } from "@/constants/tools";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Braces className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DataToolbox</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-12">
        {/* 标题区 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">数据工具箱</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            面向开发者的数据处理工具集合，所有工具纯前端运行，即时响应，无需后端服务器
          </p>
        </div>

        {/* 工具分类展示 */}
        {toolCategories.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category.id);
          if (categoryTools.length === 0) return null;

          return (
            <section key={category.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link key={tool.id} href={tool.href}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">{tool.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{tool.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* 底部 */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        DataToolbox - 数据工具箱 v1.0
      </footer>
    </div>
  );
}
