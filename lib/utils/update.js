"use strict";
/**
 * update 命令需要用到的所有方法
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePublish = exports.handleChangeVersion = exports.handleBuild = exports.handleIconMove = exports.handleIconFile = exports.handleClose = exports.handleDownload = exports.handleInitDownload = exports.handleIknowBtn = exports.handleToLibrary = exports.handleLogin = exports.handleInit = void 0;
const chalk_1 = require("chalk");
const common_1 = require("./common");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const puppeteer = require("puppeteer");
const shell = require("shelljs");
// 图标下载路径
const filePath = (0, common_1.getFilePath)('temp');
// 最终存放字体文件的路径
const targetPath = (0, common_1.getFilePath)('fonts');
// 最终需要的字体文件
const fileList = ['iconfont.css', 'iconfont.json'];
// 登录地址
const loginUrl = 'https://www.iconfont.cn/login';
// 对应图标库的基础路径
const projectLibraryUrl = 'https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=';
/**
 * 初始化
 * 打开Browser和Page，跳转到登录页面
 * @return object(page, browser)
 */
// headless属性用于设置是否无头浏览器，开发时可以设置为false，便于查看具体流程
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
    (0, common_1.printMsg)((0, chalk_1.green)('✔ 登录开始'));
    // 根据选择器获取对象dom，输入账号密码，点击登录按钮
    await page.type('#userid', userName, { delay: 50 });
    await page.type('#password', password, { delay: 50 });
    await page.click('.mx-btn-submit');
    // 根据当前页面再也没有网络请求，判断为登录结束
    await page.waitForNetworkIdle();
    (0, common_1.printMsg)((0, chalk_1.green)('✔ 登录成功'));
}
exports.handleLogin = handleLogin;
/**
 * 跳转到对应图标库
 */
async function handleToLibrary(page, projectId) {
    // 登录成功后，打开对应图标库
    (0, common_1.printMsg)((0, chalk_1.green)('跳转到对应图标库'));
    // 拼接用户传入的projectId，实现对应图标库跳转
    await page.goto(`${projectLibraryUrl}${projectId}`, {
        waitUntil: 'networkidle0',
    });
    // 根据图标库的下载图标按钮存在，判断跳转图标库成功
    await page.waitForSelector('.project-manage-bar > a.bar-text');
    (0, common_1.printMsg)((0, chalk_1.green)('图标库管理页跳转成功'));
}
exports.handleToLibrary = handleToLibrary;
/**
 * 关闭提示弹窗
 */
// 在图标库会弹出一些提示弹窗，无法确定多少个，直接进行遍历，全部关闭
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
    // 点击下载按钮，触发压缩包下载（下载按钮由于没有特殊标记，所以暴力选择第一个a标签：下载至本地）
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
    // 因为下载的时download.zip，所以需要进行解压
    await (0, common_1.handleUncompress)(filePath);
    // 删除掉download.zip
    await (0, common_1.handleDelete)(filePath);
    // 由于解压出来的文件名称不确定，不好进行路径读取，所以重命名为iconfont
    await (0, common_1.handleRename)(filePath);
    (0, common_1.printMsg)((0, chalk_1.green)('字体文件处理完成'));
}
exports.handleIconFile = handleIconFile;
/**
 * 文件移动
 */
// 利用moveSync将fileList: ['iconfont.css', 'iconfont.json']两个文件移动到目标路径fonts
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
// 由于shell.exec('npm run build')是同步的，所以执行起来挺方便的
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
 * 修改版本号
 */
// 使用npm version patch递增小版本号
function handleChangeVersion() {
    (0, common_1.printMsg)((0, chalk_1.green)('开始修改版本'));
    if (shell.exec('npm version patch').code !== 0) {
        shell.echo('Error: npm version patch failed');
        shell.exit(1);
    }
    (0, common_1.printMsg)((0, chalk_1.green)('版本修改完成'));
}
exports.handleChangeVersion = handleChangeVersion;
/**
 * 发布
 */
// 发布
function handlePublish() {
    (0, common_1.printMsg)((0, chalk_1.green)('开始发包'));
    if (shell.exec('npm publish').code !== 0) {
        shell.echo('Error: npm publish failed');
        shell.exit(1);
    }
    (0, common_1.printMsg)((0, chalk_1.green)('发包完成完成'));
}
exports.handlePublish = handlePublish;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILGlDQUE4QjtBQUM5QixxQ0FPa0I7QUFDbEIsdUNBQWdEO0FBQ2hELCtCQUE0QjtBQUM1Qix1Q0FBdUM7QUFDdkMsaUNBQWlDO0FBRWpDLFNBQVM7QUFDVCxNQUFNLFFBQVEsR0FBRyxJQUFBLG9CQUFXLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFDckMsY0FBYztBQUNkLE1BQU0sVUFBVSxHQUFHLElBQUEsb0JBQVcsRUFBQyxPQUFPLENBQUMsQ0FBQztBQUN4QyxZQUFZO0FBQ1osTUFBTSxRQUFRLEdBQUcsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDbkQsT0FBTztBQUNQLE1BQU0sUUFBUSxHQUFHLCtCQUErQixDQUFDO0FBQ2pELGFBQWE7QUFDYixNQUFNLGlCQUFpQixHQUNyQix3RUFBd0UsQ0FBQztBQUUzRTs7OztHQUlHO0FBRUgsK0NBQStDO0FBQ3hDLEtBQUssVUFBVSxVQUFVO0lBQzlCLE1BQU0sT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFBRSxnQkFBTztRQUNoQixlQUFlLEVBQUU7WUFDZixnQ0FBZ0M7WUFDaEMsS0FBSyxFQUFFLElBQUk7WUFDWCxNQUFNLEVBQUUsR0FBRztTQUNaO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsSUFBQSxpQkFBUSxFQUFDLElBQUEsYUFBSyxFQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDL0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckMsSUFBQSxpQkFBUSxFQUFDLElBQUEsYUFBSyxFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDNUIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEs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