export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-4
  messages: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const messages: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length < 8) {
    messages.push("密码长度至少需要8位");
  } else {
    score += 1;
  }

  // 包含数字
  if (!/\d/.test(password)) {
    messages.push("需要包含数字");
  } else {
    score += 1;
  }

  // 包含小写字母
  if (!/[a-z]/.test(password)) {
    messages.push("需要包含小写字母");
  } else {
    score += 1;
  }

  // 包含大写字母或特殊字符
  if (!/[A-Z]/.test(password) && !/[!@#$%^&*]/.test(password)) {
    messages.push("需要包含大写字母或特殊字符");
  } else {
    score += 1;
  }

  return {
    isValid: messages.length === 0,
    score,
    messages
  };
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
      return "text-destructive";
    case 1:
      return "text-destructive";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-yellow-600";
    case 4:
      return "text-green-500";
    default:
      return "text-muted-foreground";
  }
}

export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0:
      return "非常弱";
    case 1:
      return "弱";
    case 2:
      return "一般";
    case 3:
      return "强";
    case 4:
      return "非常强";
    default:
      return "";
  }
} 