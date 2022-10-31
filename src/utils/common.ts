/**
 * 放一些通用的工具方法
 */

import { resolve, join } from 'path';
import { existsSync, remove, readdirSync, rename } from 'fs-extra';
import * as compressing from 'compressing';

export const TIMEOUT = 30000;

/**
 * 获取项目绝对路径
 * @param filePath 项目名
 */
export function getFilePath(filePath: string): string {
  return resolve(process.cwd(), filePath);
}

/**
 * 打印信息
 * @param msg 信息
 */
export function printMsg(msg: string): void {
  console.log(msg);
}

/**
 * 解压
 */
export async function handleUncompress(filePath: string) {
  await compressing.zip.uncompress(join(filePath, 'download.zip'), filePath);
}

/**
 * 删除多余文件
 */
export async function handleDelete(filePath: string) {
  const iconfontFolder = join(filePath, 'iconfont');
  const zipFile = join(filePath, 'download.zip');
  existsSync(iconfontFolder) && (await remove(iconfontFolder));
  existsSync(zipFile) && (await remove(zipFile));
}

/**
 * 文件重命名
 */
// download.zip 解压后的名称会议font_开头，借助这个特性进行文件重命名
export async function handleRename(filePath) {
  const dirs = readdirSync(filePath);
  for (const dir of dirs) {
    if (dir.startsWith('font_')) {
      await rename(join(filePath, dir), join(filePath, 'iconfont'));
      break;
    }
  }
}
