const puppeteer = require('puppeteer-core');
const sendEmailer = require('../send_email/send_emailer');

const CHROME_PATH = require('./main_param');

require("../log_write/log_writer")
const getDefaultOsPath = () => {
  if (process.platform === 'win32') {
    return CHROME_PATH
  } else {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  }
}
// 准备 Puppeteer 浏览器实例
(async () => {
  const browser = await puppeteer.launch({
    executablePath: getDefaultOsPath()
  })
  const page = await browser.newPage();

  // 定义页面刷新和检测变化的函数
  async function refreshAndCheck() {
    // 打开页面
    await page.goto('https://yz.chsi.com.cn/kyzx/zt/kyfs2024.shtml');

    // 获取目标 <a> 标签的属性值
    const target = await page.evaluate(() => {
      const targetAnchor = document.querySelector('div.zhx-sch-list.clearfix ul:first-child > li:nth-child(3) div.sch-year-list:nth-child(2) > a:first-child');

      return {
        target: targetAnchor.getAttribute('target'),
        class: targetAnchor.getAttribute('class')
      };
    });

    // 定义目标值，与目标 <a> 标签的属性值进行对比
    const desiredTarget = '_blank';
    const desiredClass = ''; // 请替换成您期望的 class 值

    // 如果目标属性值与期望值匹配，则触发发送邮件的函数，并关闭浏览器实例
    if (target.target === desiredTarget && target.class === desiredClass) {
      console.log('Target attributes match desired values. Sending email...');
      await Promise.all([
        sendEmail(),
        browser.close()
      ]);
      process.exit();
    } else {
      console.log('Target attributes do not match desired values. Refreshing page...');
      setTimer();
    }
  }

  async function sendEmail() {
    // 实现邮件发送逻辑
    return new Promise((resolve, reject) => {
      // 这里编写发送邮件的代码，可以使用 nodemailer 或其他邮件发送库
      sendEmailer().then(() => {
        resolve(); // 解决 Promise 表示邮件发送完成
      }).catch(error => {
        reject(error); // 如果发送邮件时出现错误，拒绝 Promise
      });
    });
  }

  // 定义刷新间隔（毫秒）
  let refreshInterval = 180000; // 每 180 秒刷新一次

  // 根据当前时间设置定时器
  function setTimer() {
    const now = new Date();
    const hours = now.getHours();
    // 如果当前时间在 0 点到 6 点之间，设置定时器为 20 分钟
    if (hours >= 0 && hours < 6) {
      refreshInterval = 20 * 60 * 1000;
    } else {
      refreshInterval = 180 * 1000;
    }
    console.log("当前时间为" + hours + "等待" + refreshInterval + "s");
    setTimeout(refreshAndCheck, refreshInterval); // 20分钟
  }

  // 首次启动定时器
  setTimer();

})();