"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

export function LoginDialog() {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(process.env.NEXT_PUBLIC_ADMIN_INITIAL_ID || "", password);
    
    if (success) {
      toast({
        title: "登录成功",
        description: "欢迎回来！"
      });
    } else {
      toast({
        title: "登录失败",
        description: "密码错误",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={!isAuthenticated} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>系统登录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">
              {process.env.NEXT_PUBLIC_ADMIN_INITIAL_ID}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full">
            登录
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 