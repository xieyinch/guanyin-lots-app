# 🎉 观音灵签 v1.0.0 APK 已发布！

## 📱 下载方式

### 方式一：直接从 GitHub 下载
APK 文件已包含在代码仓库中，可以访问以下地址下载：
https://github.com/xieyinch/guanyin-lots-app/blob/main/guanyin-lots-app-v1.0.0-debug.apk

点击 "Download" 按钮下载 APK 文件。

### 方式二：使用发布脚本（需要 GitHub 账号）
```bash
# 1. 登录 GitHub
gh auth login

# 2. 运行发布脚本
chmod +x scripts/publish-apk.sh
./scripts/publish-apk.sh
```

### 方式三：自行构建
```bash
# 1. 进入 Android 目录
cd android

# 2. 构建 APK
./gradlew assembleDebug

# 3. 获取 APK
ls app/build/outputs/apk/debug/app-debug.apk
```

## ⚙️ 系统要求

- **操作系统**: Android 10.0 (API 24) 或更高版本
- **存储空间**: 至少 200MB 可用空间
- **构建版本**: Debug (调试版本)

## 🎯 功能列表

### 占卜方式
- **灵签** 🔮 - 100 支观音灵签随机抽取
- **硬币** 🪙 - 传统抛硬币占卜
- **八卦** ☯️ - 八卦占卜获取人生指引
- **塔罗** 🎴 - 西方塔罗牌占卜

### 辅助功能
- **日历时辰** 📅 - 农历、时辰、月相、中医时辰
- **历史记录** 📖 - 查看过往占卜记录  
- **深色模式** 🌓 - 支持明暗主题切换

### UI 特色
- 现代化渐变设计
- 流畅的交动画（旋转、翻转、粒子效果）
- 精致的 Ionicons 图标系统
- 触觉反馈增强体验

## 📲 安装步骤

1. **下载 APK 文件**
   - 从 GitHub 下载 `guanyin-lots-app-v1.0.0-debug.apk`

2. **允许未知来源**
   - 打开 Android 设备的 设置 → 安全
   - 启用"未知来源应用"或"安装未知应用"权限

3. **安装应用**
   - 点击 APK 文件开始安装
   - 等待安装完成

4. **开始使用**
   - 打开"观音灵签"应用
   - 选择喜欢的占卜方式
   - 开始占卜之旅！

## 🛠️ 在线预览

如果您想在 Web 浏览器中体验，可以访问:
https://8081-4945b9f6e2528447.monkeycode-ai.online

## 📝 注意事项

- ✅ Debug 版本包含调试信息和性能监控功能
- ✅ 仅供学习和个人使用
- ✅ 建议在生产环境使用 Release 版本
- ⚠️ 首次安装需要允许"安装来自未知来源的应用"

## 🔄 后续版本

未来版本将提供：
- Release 版本（更小体积、更高性能）
- 通过 GitHub Releases 分发
- 使用 Git LFS 存储大文件
- Google Play 应用商店发布

## 🙏 感谢

感谢您使用观音灵签！如有问题或建议，请在 GitHub 提交 Issue。

---
**构建时间**: 2026-06-07
**仓库地址**: https://github.com/xieyinch/guanyin-lots-app
