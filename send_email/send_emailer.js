// send_mailer.js
const PASSWORD = require('./email_param');
const nodemailer = require('nodemailer');
require('./email_param')

async function sendMail() {
  console.log("开始初始化stmp"+PASSWORD)
  // 创建一个 SMTP transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com', // SMTP 服务器主机名
    port: 587, // SMTP 服务器端口号
    secure: false, // 是否使用 SSL/TLS
    auth: {
      user: '121370451@qq.com', // SMTP 服务器用户名
      pass: PASSWORD // SMTP 服务器密码或授权码
    }
  });

  // 设置邮件内容
  const mailOptions = {
    from: '121370451@qq.com', // 发件人邮箱地址
    to: 'gaopy2793@idss-cn.com', // 收件人邮箱地址
    subject: '监控提醒', // 邮件主题
    text: '可以去看看了 加油！！！', // 邮件正文
  };

  // 发送邮件
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.log('Error occurred while sending email:', error);
  }
}
module.exports = sendMail;