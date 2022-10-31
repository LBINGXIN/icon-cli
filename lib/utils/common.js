"use strict";
/**
 * 放一些通用的工具方法
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRename = exports.handleDelete = exports.handleUncompress = exports.printMsg = exports.getFilePath = exports.TIMEOUT = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const compressing = require("compressing");
exports.TIMEOUT = 30000;
/**
 * 获取项目绝对路径
 * @param filePath 项目名
 */
function getFilePath(filePath) {
    return (0, path_1.resolve)(process.cwd(), filePath);
}
exports.getFilePath = getFilePath;
/**
 * 打印信息
 * @param msg 信息
 */
function printMsg(msg) {
    console.log(msg);
}
exports.printMsg = printMsg;
/**
 * 解压
 */
async function handleUncompress(filePath) {
    await compressing.zip.uncompress((0, path_1.join)(filePath, 'download.zip'), filePath);
}
exports.handleUncompress = handleUncompress;
/**
 * 删除多余文件
 */
async function handleDelete(filePath) {
    const iconfontFolder = (0, path_1.join)(filePath, 'iconfont');
    const zipFile = (0, path_1.join)(filePath, 'download.zip');
    (0, fs_extra_1.existsSync)(iconfontFolder) && (await (0, fs_extra_1.remove)(iconfontFolder));
    (0, fs_extra_1.existsSync)(zipFile) && (await (0, fs_extra_1.remove)(zipFile));
}
exports.handleDelete = handleDelete;
/**
 * 文件重命名
 */
async function handleRename(filePath) {
    const dirs = (0, fs_extra_1.readdirSync)(filePath);
    for (const dir of dirs) {
        if (dir.startsWith('font_')) {
            await (0, fs_extra_1.rename)((0, path_1.join)(filePath, dir), (0, path_1.join)(filePath, 'iconfont'));
            break;
        }
    }
}
exports.handleRename = handleRename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILCtCQUFxQztBQUNyQyx1Q0FBbUU7QUFDbkUsMkNBQTJDO0FBRTlCLFFBQUEsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxTQUFnQixXQUFXLENBQUMsUUFBZ0I7SUFDMUMsT0FBTyxJQUFBLGNBQU8sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUZELGtDQUVDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLEdBQVc7SUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRkQsNEJBRUM7QUFFRDs7R0FFRztBQUNJLEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxRQUFnQjtJQUNyRCxNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUEsV0FBSSxFQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRkQsNENBRUM7QUFFRDs7R0FFRztBQUNJLEtBQUssVUFBVSxZQUFZLENBQUMsUUFBZ0I7SUFDakQsTUFBTSxjQUFjLEdBQUcsSUFBQSxXQUFJLEVBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sT0FBTyxHQUFHLElBQUEsV0FBSSxFQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMvQyxJQUFBLHFCQUFVLEVBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUEsaUJBQU0sRUFBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzdELElBQUEscUJBQVUsRUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBQSxpQkFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUxELG9DQUtDO0FBRUQ7O0dBRUc7QUFDSSxLQUFLLFVBQVUsWUFBWSxDQUFDLFFBQVE7SUFDekMsTUFBTSxJQUFJLEdBQUcsSUFBQSxzQkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ3RCLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzQixNQUFNLElBQUEsaUJBQU0sRUFBQyxJQUFBLFdBQUksRUFBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBQSxXQUFJLEVBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUQsTUFBTTtTQUNQO0tBQ0Y7QUFDSCxDQUFDO0FBUkQsb0NBUUMifQ==