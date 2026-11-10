const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🚀 FixNear India Platform - Starting All Services...');
console.log('====================================================\n');

// 1. Start Backend Express Server (Port 5000)
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Dev Server (Port 3000)
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

backend.on('close', (code) => {
  console.log(`[FixNear Backend] Process exited with code ${code}`);
});

frontend.on('close', (code) => {
  console.log(`[FixNear Frontend] Process exited with code ${code}`);
});

process.on('SIGINT', () => {
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
});
