import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
            <CardTitle>页面未找到</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            抱歉，您访问的页面不存在
          </p>
          <Button render={<Link href="/" />} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
