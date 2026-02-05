import { execSync, spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

function killPid(pid) {
  try {
    execSync(`taskkill /PID ${pid} /F`);
    console.log(`Killed process ${pid} using port ${PORT}`);
  } catch (err) {
    // ignore
  }
}

function findPIDsUsingPort(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const lines = out.split(/\r?\n/).filter(Boolean);
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (/^\d+$/.test(pid)) pids.add(pid);
    }
    return Array.from(pids).map(Number);
  } catch (err) {
    return [];
  }
}

(async () => {
  const pids = findPIDsUsingPort(PORT);
  for (const pid of pids) {
    if (pid && pid !== process.pid) {
      killPid(pid);
    }
  }

  // start the server
  const child = spawn(process.execPath, ['server.js'], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
})();
