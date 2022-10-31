"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const update_1 = require("./order/update");
// 查看版本 icon-cli -v 或 icon-cli --version
/* eslint-disable @typescript-eslint/no-var-requires */
commander_1.program
    .version(`${require('../package.json').version}`, '-v --version')
    .usage('<command> [options]');
// 创建项目命令 icon-cli update
commander_1.program
    .command('update <user-name> <password> <project_id>')
    .description('auto handle iconfont')
    .action(async (userName, password, projectId) => {
    // 创建逻辑
    await (0, update_1.default)(userName, password, projectId);
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBb0M7QUFDcEMsMkNBQW9DO0FBRXBDLHdDQUF3QztBQUN4Qyx1REFBdUQ7QUFDdkQsbUJBQU87S0FDSixPQUFPLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxjQUFjLENBQUM7S0FDaEUsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFFaEMseUJBQXlCO0FBQ3pCLG1CQUFPO0tBQ0osT0FBTyxDQUFDLDRDQUE0QyxDQUFDO0tBQ3JELFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQztLQUNuQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxTQUFpQixFQUFFLEVBQUU7SUFDdEUsT0FBTztJQUNQLE1BQU0sSUFBQSxnQkFBTSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFFTCxtQkFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMifQ==