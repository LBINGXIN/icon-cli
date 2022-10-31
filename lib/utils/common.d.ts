/**
 * 放一些通用的工具方法
 */
export declare const TIMEOUT = 30000;
/**
 * 获取项目绝对路径
 * @param filePath 项目名
 */
export declare function getFilePath(filePath: string): string;
/**
 * 打印信息
 * @param msg 信息
 */
export declare function printMsg(msg: string): void;
/**
 * 解压
 */
export declare function handleUncompress(filePath: string): Promise<void>;
/**
 * 删除多余文件
 */
export declare function handleDelete(filePath: string): Promise<void>;
/**
 * 文件重命名
 */
export declare function handleRename(filePath: any): Promise<void>;
