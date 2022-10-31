/**
 * update 命令需要用到的所有方法
 */

import { green } from 'chalk';
import {
  printMsg,
  getFilePath,
  TIMEOUT,
  handleUncompress,
  handleDelete,
  handleRename,
} from './common';
import { existsSync, moveSync } from 'fs-extra';
import { join } from 'path';
import * as puppeteer from 'puppeteer';
import * as shell from 'shelljs';

// 图标下载路径
const filePath = getFilePath('temp');
// 最终存放字体文件的路径
const targetPath = getFilePath('fonts');
// 最终需要的字体文件
const fileList = ['iconfont.css', 'iconfont.json'];
// 登录地址
const loginUrl = 'https://www.iconfont.cn/login';
// 对应图标库的基础路径
const projectLibraryUrl =
  'https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=';

/**
 * 初始化
 * 打开Browser和Page，跳转到登录页面
 * @return object(page, browser)
 */

// headless属性用于设置是否无头浏览器，开发时可以设置为false，便于查看具体流程
export async function handleInit(): Promise<any> {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: TIMEOUT,
    defaultViewport: {
      // 默认视窗较小，宽高建议设置一下，防止页面需要滚动或者样式乱
      width: 1366,
      height: 768,
    },
  });
  printMsg(green('✔ 打开Browser'));
  const page = await browser.newPage();
  printMsg(green('✔ 打开Page'));
  await page.goto(loginUrl, { waitUntil: 'networkidle0' });
  return {
    page,
    browser,
  };
}

/**
 * 登录
 */

export async function handleLogin(
  page: any,
  userName: string,
  password: string,
): Promise<void> {
  printMsg(green('✔ 登录开始'));
  // 根据选择器获取对象dom，输入账号密码，点击登录按钮
  await page.type('#userid', userName, { delay: 50 });
  await page.type('#password', password, { delay: 50 });
  await page.click('.mx-btn-submit');
  // 根据当前页面再也没有网络请求，判断为登录结束
  await page.waitForNetworkIdle();
  printMsg(green('✔ 登录成功'));
}

/**
 * 跳转到对应图标库
 */
export async function handleToLibrary(
  page: any,
  projectId: string,
): Promise<void> {
  // 登录成功后，打开对应图标库
  printMsg(green('跳转到对应图标库'));
  // 拼接用户传入的projectId，实现对应图标库跳转
  await page.goto(`${projectLibraryUrl}${projectId}`, {
    waitUntil: 'networkidle0',
  });
  // 根据图标库的下载图标按钮存在，判断跳转图标库成功
  await page.waitForSelector('.project-manage-bar > a.bar-text');
  printMsg(green('图标库管理页跳转成功'));
}

/**
 * 关闭提示弹窗
 */
// 在图标库会弹出一些提示弹窗，无法确定多少个，直接进行遍历，全部关闭
export async function handleIknowBtn(page: any): Promise<void> {
  await page.$$eval('.btn-iknow', (btns) => btns.map((btn) => btn.click()));
}

/**
 * 初始化下载
 */
export async function handleInitDownload(page: any): Promise<void> {
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow', //允许下载请求
    downloadPath: filePath, //设置下载路径
  });
}

/**
 * 处理文件下载
 */
export async function handleDownload(page: any): Promise<void> {
  // 点击下载按钮，触发压缩包下载（下载按钮由于没有特殊标记，所以暴力选择第一个a标签：下载至本地）
  await page.click('.project-manage-bar > a.bar-text');
  const start = Date.now(),
    zipPath = join(filePath, 'download.zip');
  while (!existsSync(zipPath)) {
    // 每隔一秒轮询一次，查看download.zip文件是否下载完毕，超时时间设为30秒
    await page.waitForTimeout(1000);
    if (Date.now() - start >= TIMEOUT) {
      throw new Error('下载超时');
    }
  }
  printMsg('图标下载成功！');
}

/**
 * 关闭浏览器
 */
export async function handleClose(page: any, browser: any): Promise<void> {
  await page.close();
  await browser.close();
}

/**
 * 处理字体文件
 */
export async function handleIconFile(): Promise<void> {
  // 解压 => 删除 => 重命名
  printMsg(green('开始处理字体文件'));
  // 因为下载的时download.zip，所以需要进行解压
  await handleUncompress(filePath);
  // 删除掉download.zip
  await handleDelete(filePath);
  // 由于解压出来的文件名称不确定，不好进行路径读取，所以重命名为iconfont
  await handleRename(filePath);
  printMsg(green('字体文件处理完成'));
}

/**
 * 文件移动
 */
// 利用moveSync将fileList: ['iconfont.css', 'iconfont.json']两个文件移动到目标路径fonts
export function handleIconMove(): void {
  printMsg(green('开始移动字体文件'));
  fileList.map(async (file) => {
    const _sourcePath = join(filePath, 'iconfont', file);
    const _targetPath = join(targetPath, file);
    moveSync(_sourcePath, _targetPath);
  });
  printMsg(green('字体文件移动完成'));
}

/**
 * 打包构建
 */
// 由于shell.exec('npm run build')是同步的，所以执行起来挺方便的
export function handleBuild(): void {
  printMsg(green('打包开始'));
  if (shell.exec('npm run build').code !== 0) {
    shell.echo('Error: npm run build failed');
    shell.exit(1);
  }
  printMsg(green('打包完成'));
}

/**
 * 修改版本号
 */
// 使用npm version patch递增小版本号
export function handleChangeVersion(): void {
  printMsg(green('开始修改版本'));
  if (shell.exec('npm version patch').code !== 0) {
    shell.echo('Error: npm version patch failed');
    shell.exit(1);
  }
  printMsg(green('版本修改完成'));
}

/**
 * 发布
 */
// 发布
export function handlePublish(): void {
  printMsg(green('开始发包'));
  if (shell.exec('npm publish').code !== 0) {
    shell.echo('Error: npm publish failed');
    shell.exit(1);
  }
  printMsg(green('发包完成完成'));
}
