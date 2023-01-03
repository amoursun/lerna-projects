#! /bin/sh

# 流水线构建必要的初始化

# 以便于在流水线 log 出运行的命令
run() {
    echo "Run: $@"
    eval $@
}

export LC_ALL=zh_CN.UTF-8
export LANG=zh_CN.UTF-8
export LANGUAGE=zh_CN.UTF-8

export PATH=$NODEJS_BIN_LATEST:$PATH

echo "node: $(node -v)"
echo "npm: $(npm -v)"

if [ -n "$AGILE_TRIGGER_USER" ]
then
    run "git config user.name $AGILE_TRIGGER_USER"
    run "git config user.email $AGILE_TRIGGER_USER@${xxx}.com"
fi

# ci 环境一般不需要 puppeteer 略去其耗时的 chromium 的 download
run "export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true"
# 理论上，设置设置到 npm 也可以，但注意，npm config 会设置到 ~/.npmrc
# 所以不要使用本地设置 npm 的方式
#run "npm config set puppeteer_skip_chromium_download=true"

echo "-------- initialize-ci finished --------"
