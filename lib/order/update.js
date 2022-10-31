"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * update 命令的具体任务
 */
const update_1 = require("../utils/update");
// create 命令
async function update(userName, password, projectId) {
    // 初始化
    const { page, browser } = await (0, update_1.handleInit)();
    // 登录
    await (0, update_1.handleLogin)(page, userName, password);
    // 跳转到对应图标库
    await (0, update_1.handleToLibrary)(page, projectId);
    // 初始化下载
    await (0, update_1.handleInitDownload)(page);
    // 关闭提示弹窗
    await (0, update_1.handleIknowBtn)(page);
    // 下载
    await (0, update_1.handleDownload)(page);
    // 关闭浏览器
    await (0, update_1.handleClose)(page, browser);
    // 处理字体文件
    await (0, update_1.handleIconFile)();
    // 字体文件移动
    await (0, update_1.handleIconMove)();
    // 打包
    (0, update_1.handleBuild)();
    // 发包
    (0, update_1.handlePublish)();
}
exports.default = update;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29yZGVyL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsNENBWXlCO0FBRXpCLFlBQVk7QUFDRyxLQUFLLFVBQVUsTUFBTSxDQUNsQyxRQUFnQixFQUNoQixRQUFnQixFQUNoQixTQUFpQjtJQUVqQixNQUFNO0lBQ04sTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLElBQUEsbUJBQVUsR0FBRSxDQUFDO0lBQzdDLEtBQUs7SUFDTCxNQUFNLElBQUEsb0JBQVcsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLFdBQVc7SUFDWCxNQUFNLElBQUEsd0JBQWUsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkMsUUFBUTtJQUNSLE1BQU0sSUFBQSwyQkFBa0IsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixTQUFTO0lBQ1QsTUFBTSxJQUFBLHVCQUFjLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsS0FBSztJQUNMLE1BQU0sSUFBQSx1QkFBYyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLFFBQVE7SUFDUixNQUFNLElBQUEsb0JBQVcsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakMsU0FBUztJQUNULE1BQU0sSUFBQSx1QkFBYyxHQUFFLENBQUM7SUFDdkIsU0FBUztJQUNULE1BQU0sSUFBQSx1QkFBYyxHQUFFLENBQUM7SUFDdkIsS0FBSztJQUNMLElBQUEsb0JBQVcsR0FBRSxDQUFDO0lBQ2QsS0FBSztJQUNMLElBQUEsc0JBQWEsR0FBRSxDQUFDO0FBQ2xCLENBQUM7QUEzQkQseUJBMkJDIn0=