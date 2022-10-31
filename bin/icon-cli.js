#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// 这句脚本的作用是指定用node执行当前脚本文件
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 icon-cli.js 实现修改

// 将构建目录(lib)下的 index.js 作为脚手架的入口
require('../lib/index');
