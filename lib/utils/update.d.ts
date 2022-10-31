/**
 * update 命令需要用到的所有方法
 */
/**
 * 初始化
 * 打开Browser和Page，跳转到登录页面
 * @return object(page, browser)
 */
export declare function handleInit(): Promise<any>;
/**
 * 登录
 */
export declare function handleLogin(page: any, userName: string, password: string): Promise<void>;
/**
 * 跳转到对应图标库
 */
export declare function handleToLibrary(page: any, projectId: string): Promise<void>;
/**
 * 关闭提示弹窗
 */
export declare function handleIknowBtn(page: any): Promise<void>;
/**
 * 初始化下载
 */
export declare function handleInitDownload(page: any): Promise<void>;
/**
 * 处理文件下载
 */
export declare function handleDownload(page: any): Promise<void>;
/**
 * 关闭浏览器
 */
export declare function handleClose(page: any, browser: any): Promise<void>;
/**
 * 处理字体文件
 */
export declare function handleIconFile(): Promise<void>;
/**
 * 文件移动
 */
export declare function handleIconMove(): void;
/**
 * 打包构建
 */
export declare function handleBuild(): void;
/**
 * 修改版本号
 */
export declare function handleChangeVersion(): void;
/**
 * 发布
 */
export declare function handlePublish(): void;
