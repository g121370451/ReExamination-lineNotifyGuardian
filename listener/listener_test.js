const puppeteer = require('puppeteer-core');

const getDefaultOsPath = () => {
  if (process.platform === 'win32') {
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  } else {
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  }
}

(async () => {
  // 启动 Puppeteer
  const browser = await puppeteer.launch({
    executablePath: getDefaultOsPath()
  })
  const page = await browser.newPage();

  // 打开页面
  await page.goto('https://yz.chsi.com.cn/kyzx/zt/kyfs2024.shtml');

  // 使用 evaluate 方法在页面上下文中执行 JavaScript 代码
  const targetA = await page.evaluate(() => {
    const aElement = document.querySelector('div.zhx-sch-list.clearfix ul:first-child > li:nth-child(2) div.sch-year-list:nth-child(2) > a:first-child');
    if (aElement) {
      // 获取属性值并返回
      return {
        class: aElement.className,
        textContent: aElement.getAttribute('target'),
        // 如果需要获取其他属性，请在这里添加
      };
    } else {
      // 如果目标元素不存在，则返回 null 或者其他适当的值
      return null;
    }
  });

  // 打印目标元素的属性
  console.log(targetA);

  // 关闭浏览器
  await browser.close();
})();

// console.log(process.platform)