const fs = require('fs');
const path = require('path');

// 获取__dirname的父目录路径
const parentDir = path.dirname(__dirname);

// 日志文件夹路径
const logsDirPath = path.join(parentDir, 'logs');

// 创建logs文件夹（如果不存在）
if (!fs.existsSync(logsDirPath)) {
  fs.mkdirSync(logsDirPath, { recursive: true }); // 创建logs文件夹及其所有父文件夹
}

// 日志文件路径
const logFilePath = path.join(logsDirPath, 'app.log');

// 创建日志输出流
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// 将控制台输出重定向到日志文件
console.log = function (message) {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
};

// 在程序退出时关闭日志输出流
process.on('exit', () => {
  logStream.end();
});