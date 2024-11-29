"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkPasswordStrength, getPasswordStrengthColor, getPasswordStrengthText } from "@/lib/utils/password";

export function ChangePassword() {
  const { username } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState({ isValid: false, score: 0, messages: [] });
  const [isConfirmValid, setIsConfirmValid] = useState(true);

  // 检查密码强度
  useEffect(() => {
    if (newPassword) {
      setStrength(checkPasswordStrength(newPassword));
    } else {
      setStrength({ isValid: false, score: 0, messages: [] });
    }
  }, [newPassword]);

  // 检查确认密码
  useEffect(() => {
    if (confirmPassword) {
      setIsConfirmValid(confirmPassword === newPassword);
    } else {
      setIsConfirmValid(true);
    }
  }, [confirmPassword, newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!strength.isValid) {
      toast({
        title: "密码强度不足",
        description: "请确保密码满足所有要求",
        variant: "destructive"
      });
      return;
    }

    if (!isConfirmValid) {
      toast({
        title: "错误",
        description: "两次输入的新密码不一致",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        toast({
          title: "修改成功",
          description: "密码已更新"
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "修改失败",
          description: "当前密码错误",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "修改失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>修改密码</CardTitle>
        <CardDescription>修改管理员密码，下次登录时生效</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">当前密码</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {newPassword && (
              <div className="mt-2 text-sm">
                <div className={getPasswordStrengthColor(strength.score)}>
                  密码强度: {getPasswordStrengthText(strength.score)}
                </div>
                {strength.messages.length > 0 && (
                  <ul className="list-disc list-inside text-muted-foreground">
                    {strength.messages.map((msg, index) => (
                      <li key={index}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {!isConfirmValid && confirmPassword && (
              <p className="text-sm text-destructive mt-1">
                两次输入的密码不一致
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!strength.isValid || !isConfirmValid}
          >
            确认修改
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 