const { execSync } = require('child_process');
const fs = require("fs");

// Kiểm tra xem có phải môi trường Production (như trên Server/Vercel) không
// Chúng ta thường không muốn cài đặt Husky trên Production
if (process.env.NODE_ENV === 'production') {
  console.log('Production environment detected, skipping husky installation.');
  process.exit(0);
}

// Kiểm tra xem có thư mục .git không
// Có .git thì Husky mới hoạt động được
if (!fs.existsSync(".git")) {
  console.log("[prepare] Skip husky (not a git repo)");
  process.exit(0);
}

try {
  console.log('Installing Husky...');
  // Với Husky v9, chúng ta chỉ cần gọi lệnh 'husky'
  execSync('npx husky', { stdio: 'inherit' });
  console.log('Husky installed successfully!');
} catch (error) {
  console.error('Failed to install Husky:', error.message);
  process.exit(1);
}