# php-vite
php项目基础vue3
# 前端vue3 工程化配置
## 使用方法
### 本地开发
```sh
cd vite #进入前端目录
npm install # 安装依赖
npm run dev # 启动开发环境
sudo npm run build # 构建代码（需要读写文件夹，请用系统权限）
sudo npm run buildtophp # 1. 构建代码 2.同步dist/assets 到 php的public/vite/assets， 同步dist/*.html 到 test/*.phtml（需要读写文件夹，请用系统权限）
```

# 背景
早期使用yaf搭建的php后台管理系统，属于ssr，前端采用传统的jquery + bootstrap架构。
目前在这个基础上需要开发新功能。
考虑到后期可能重构和维护性。 
- 需要把SSR架构调整为前后端分离
- 前端改用vue3+vite+elementPlus架构
- 数据获取从php输出改成resful风格

