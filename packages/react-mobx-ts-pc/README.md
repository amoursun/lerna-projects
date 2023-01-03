# 初建项目 Todo
- [ ] 熟悉 `src/entries` 结构，并进根据项目情况处置
    - [ ] 处置 `entries/main`，main 作为模块名是具有通用性的，可根据项目情况选择是保留还是删除
    - [ ] 处置 `entries/main/home`，如果你的 main 模块没有 home page 的话，删除☞
    - [ ] 删除 `entries/main/some-list`，样例而已
    - [ ] 删除 `entries/main/some-detail`，样例而已
    - [ ] 删除 `entries/other`，因为实际项目，一般不会有个 `other` 模块
    
- [ ] 搜索 `@todo 根据项目情况处置` 分别确认、处置
- [ ] 删除此段

## Development
### node version
- ^v10.15 lts

### scripts
- `npm run setup` 初始化安装
- `npm run dev` 启动 dev server
- `npm run build` 构建 production
- `npm run start` 启动 prod server
- `npm run dll:dev` 构建 dev dll，在打到 vendor 包里的依赖有更新时需要重新执行
- `npm run dll:prod` 构建 prod dll，在打到 vendor 包里的依赖有更新时需要重新执行

## 更多指引 [sack/seeds/react-mobx-pc](http://sack.weiyun.baidu.com/main/seeds/react-mobx-pc)
