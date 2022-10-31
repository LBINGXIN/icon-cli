"use strict";
/**
 * update 命令需要用到的所有方法
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePublish = exports.handleBuild = exports.handleIconMove = exports.handleIconFile = exports.handleClose = exports.handleDownload = exports.handleInitDownload = exports.handleIknowBtn = exports.handleToLibrary = exports.handleLogin = exports.handleInit = exports.isLogin = void 0;
const chalk_1 = require("chalk");
const common_1 = require("./common");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const puppeteer = require("puppeteer");
const shell = require("shelljs");
const filePath = (0, common_1.getFilePath)('temp');
const targetPath = (0, common_1.getFilePath)('fonts');
const fileList = ['iconfont.css', 'iconfont.json'];
const loginUrl = 'https://www.iconfont.cn/login';
const projectLibraryUrl = 'https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=';
/**
 * 判断是否登录
 */
function isLogin() {
    return false;
}
exports.isLogin = isLogin;
/**
 * 初始化
 * 打开Browser和Page，跳转到登录页面
 * @return object(page, browser)
 */
async function handleInit() {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: common_1.TIMEOUT,
        defaultViewport: {
            // 默认视窗较小，宽高建议设置一下，防止页面需要滚动或者样式乱
            width: 1366,
            height: 768,
        },
    });
    (0, common_1.printMsg)((0, chalk_1.green)('✔ 打开Browser'));
    const page = await browser.newPage();
    (0, common_1.printMsg)((0, chalk_1.green)('✔ 打开Page'));
    await page.goto(loginUrl, { waitUntil: 'networkidle0' });
    return {
        page,
        browser,
    };
}
exports.handleInit = handleInit;
/**
 * 登录
 */
async function handleLogin(page, userName, password) {
    // 输入账号密码，点击登录按钮
    (0, common_1.printMsg)((0, chalk_1.green)('✔ 登录开始'));
    await page.type('#userid', userName, { delay: 50 });
    await page.type('#password', password, { delay: 50 });
    await page.click('.mx-btn-submit');
    await page.waitForNetworkIdle();
    (0, common_1.printMsg)((0, chalk_1.green)('✔ 登录成功'));
}
exports.handleLogin = handleLogin;
/**
 * 跳转到对应图标库
 */
async function handleToLibrary(page, projectId) {
    // 登录成功后，打开项目链接
    (0, common_1.printMsg)((0, chalk_1.green)('跳转到对应图标库'));
    await page.goto(`${projectLibraryUrl}${projectId}`, {
        waitUntil: 'networkidle0',
    });
    await page.waitForSelector('.project-manage-bar > a.bar-text');
    (0, common_1.printMsg)((0, chalk_1.green)('图标库管理页跳转成功'));
}
exports.handleToLibrary = handleToLibrary;
/**
 * 关闭提示弹窗
 */
async function handleIknowBtn(page) {
    await page.$$eval('.btn-iknow', (btns) => btns.map((btn) => btn.click()));
}
exports.handleIknowBtn = handleIknowBtn;
/**
 * 初始化下载
 */
async function handleInitDownload(page) {
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: filePath, //设置下载路径
    });
}
exports.handleInitDownload = handleInitDownload;
/**
 * 处理文件下载
 */
async function handleDownload(page) {
    // 点击下载按钮，触发压缩包下载（一个这么特殊的按钮一个特殊的id或class都没有，第一个a标签：下载至本地）
    await page.click('.project-manage-bar > a.bar-text');
    const start = Date.now(), zipPath = (0, path_1.join)(filePath, 'download.zip');
    while (!(0, fs_extra_1.existsSync)(zipPath)) {
        // 每隔一秒轮询一次，查看download.zip文件是否下载完毕，超时时间设为30秒
        await page.waitForTimeout(1000);
        if (Date.now() - start >= common_1.TIMEOUT) {
            throw new Error('下载超时');
        }
    }
    (0, common_1.printMsg)('图标下载成功！');
}
exports.handleDownload = handleDownload;
/**
 * 关闭浏览器
 */
async function handleClose(page, browser) {
    await page.close();
    await browser.close();
}
exports.handleClose = handleClose;
/**
 * 处理字体文件
 */
async function handleIconFile() {
    // 解压 => 删除 => 重命名
    (0, common_1.printMsg)((0, chalk_1.green)('开始处理字体文件'));
    await (0, common_1.handleUncompress)(filePath);
    await (0, common_1.handleDelete)(filePath);
    await (0, common_1.handleRename)(filePath);
    (0, common_1.printMsg)((0, chalk_1.green)('字体文件处理完成'));
}
exports.handleIconFile = handleIconFile;
/**
 * 文件移动
 */
function handleIconMove() {
    (0, common_1.printMsg)((0, chalk_1.green)('开始移动字体文件'));
    fileList.map(async (file) => {
        const _sourcePath = (0, path_1.join)(filePath, 'iconfont', file);
        const _targetPath = (0, path_1.join)(targetPath, file);
        (0, fs_extra_1.moveSync)(_sourcePath, _targetPath);
    });
    (0, common_1.printMsg)((0, chalk_1.green)('字体文件移动完成'));
}
exports.handleIconMove = handleIconMove;
/**
 * 打包构建
 */
function handleBuild() {
    (0, common_1.printMsg)((0, chalk_1.green)('打包开始'));
    if (shell.exec('npm run build').code !== 0) {
        shell.echo('Error: npm run build failed');
        shell.exit(1);
    }
    (0, common_1.printMsg)((0, chalk_1.green)('打包完成'));
}
exports.handleBuild = handleBuild;
/**
 * 发布
 */
function handlePublish() {
    (0, common_1.printMsg)((0, chalk_1.green)('开发发包'));
    if (shell.exec('npm publish').code !== 0) {
        shell.echo('Error: npm publish failed');
        shell.exit(1);
    }
    (0, common_1.printMsg)((0, chalk_1.green)('发包完成完成'));
}
exports.handlePublish = handlePublish;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILGlDQUE4QjtBQUM5QixxQ0FPa0I7QUFDbEIsdUNBQWdEO0FBQ2hELCtCQUE0QjtBQUM1Qix1Q0FBdUM7QUFDdkMsaUNBQWlDO0FBRWpDLE1BQU0sUUFBUSxHQUFHLElBQUEsb0JBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUNyQyxNQUFNLFVBQVUsR0FBRyxJQUFBLG9CQUFXLEVBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDbkQsTUFBTSxRQUFRLEdBQUcsK0JBQStCLENBQUM7QUFFakQsTUFBTSxpQkFBaUIsR0FDckIsd0VBQXdFLENBQUM7QUFFM0U7O0dBRUc7QUFDSCxTQUFnQixPQUFPO0lBQ3JCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUZELDBCQUVDO0FBRUQ7Ozs7R0FJRztBQUVJLEtBQUssVUFBVSxVQUFVO0lBQzlCLE1BQU0sT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFBRSxnQkFBTztRQUNoQixlQUFlLEVBQUU7WUFDZixnQ0FBZ0M7WUFDaEMsS0FBSyxFQUFFLElBQUk7WUFDWCxNQUFNLEVBQUUsR0FBRztTQUNaO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsSUFBQSxpQkFBUSxFQUFDLElBQUEsYUFBSyxFQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDL0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckMsSUFBQSxpQkFBUSxFQUFDLElBQUEsYUFBSyxFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDNUIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFD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