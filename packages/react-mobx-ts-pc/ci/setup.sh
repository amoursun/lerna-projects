#! /bin/bash
# 清理并安装项目依赖
# ci 环境其实并没有 node_modules 这个清理是方便本地调试的，无妨
rm -rf node_modules
npm ci
