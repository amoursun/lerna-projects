#! /bin/sh
# agile 流水线构建到微云独立部署
# 关联配置 ci.yml, webpack-config/env-config.js

# 构建
source $(dirname $0)/build.sh

# 判断是否存在output目录，如果存在则彻底删除
if [ -d "output" ]; then
  run "rm -rf output"
fi

# 重新创建 output 目录
run "mkdir output"

# 拷贝组装脚本（目前仅用来作为“上线 stage” 的空脚本使用）
run "cp ./ci/assemble.sh ./output"

# 拷贝镜像 nginx-custom 所需要的配置
# run "cp -r /conf-nginx/recommended ./output/conf"
# 拷贝构建产物
run "cp -r ./dist/prod/* ./output"

# 打包 output
run "cd ./output"
run "zip -rqm --symlinks ./output.zip ."

echo "-------- output finished --------"
