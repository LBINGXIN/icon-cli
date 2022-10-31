/**
 * update 命令的具体任务
 */
import {
  handleInit,
  handleLogin,
  handleToLibrary,
  handleInitDownload,
  handleIknowBtn,
  handleDownload,
  handleClose,
  handleIconFile,
  handleIconMove,
  handleBuild,
  handleChangeVersion,
  handlePublish,
} from '../utils/update';

// create 命令
export default async function update(
  userName: string,
  password: string,
  projectId: string,
): Promise<void> {
  // 初始化
  const { page, browser } = await handleInit();
  // 登录
  await handleLogin(page, userName, password);
  // 跳转到对应图标库
  await handleToLibrary(page, projectId);
  // 初始化下载
  await handleInitDownload(page);
  // 关闭提示弹窗
  await handleIknowBtn(page);
  // 下载
  await handleDownload(page);
  // 关闭浏览器
  await handleClose(page, browser);
  // 处理字体文件
  await handleIconFile();
  // 字体文件移动
  await handleIconMove();
  // 打包
  handleBuild();
  // 修改版本号
  handleChangeVersion();
  // 发包
  handlePublish();
}
