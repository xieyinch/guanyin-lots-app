#!/bin/bash

# APK 发布脚本
# 使用方法：./publish-apk.sh

APK_FILE="guanyin-lots-app-v1.0.0-debug.apk"
VERSION="1.0.0"

echo "📦 观音灵签 APK 发布工具"
echo "==================================="
echo ""

# 检查 APK 文件是否存在
if [ ! -f "$APK_FILE" ]; then
    echo "❌ 错误：APK 文件不存在：$APK_FILE"
    echo "请先运行以下命令构建 APK："
    echo "  cd android && ./gradlew assembleDebug"
    exit 1
fi

# 显示 APK 文件信息
echo "✅ APK 文件信息:"
echo "   文件名：$APK_FILE"
echo "   大小：$(du -h $APK_FILE | cut -f1)"
echo "   路径：$(pwd)/$APK_FILE"
echo ""

# 检查是否登录 GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "⚠️ GitHub CLI 未安装，请手动上传 APK 到 GitHub Release"
    echo ""
    echo "📝 手动上传步骤:"
    echo "1. 访问：https://github.com/xieyinch/guanyin-lots-app/releases/new"
    echo "2. 输入 Tag version: v$VERSION"
    echo "3. 输入 Release title: 观音灵签 v$VERSION"
    echo "4. 点击 'Attach binaries by dropping them here or selecting them.'"
    echo "5. 选择 APK 文件：$(pwd)/$APK_FILE"
    echo "6. 填写发布说明并点击 'Publish release'"
    echo ""
    exit 0
fi

# 检查是否已登录 GitHub
if ! gh auth status &> /dev/null; then
    echo "⚠️ 未登录 GitHub，请先运行：gh auth login"
    echo "然后重新执行此脚本"
    exit 1
fi

echo "🚀 开始创建 GitHub Release..."
echo ""

# 创建 Release
gh release create "v$VERSION" \
    "$APK_FILE" \
    --title "观音灵签 v$VERSION - 首个正式版本" \
    --notes "## 🎉 观音灵签 v$VERSION

这是观音灵签应用的 Android APK 版本。

### ✨ 主要功能
- 🎯 灵签抽签 - 100 支观音灵签随机抽取
- 🪙 硬币卜卦 - 传统抛硬币占卜方式
- ☯️ 八卦起卦 - 八卦占卜获取人生指引  
- 🎴 塔罗牌 - 西方塔罗牌占卜
- 📅 日历时辰 - 农历、时辰、月相、中医时辰
- 📖 历史记录 - 查看过往占卜记录
- 🌓 深色模式 - 支持明暗主题切换

### 🎨 UI 特色
- 现代化渐变设计
- 流畅的交动画（旋转、翻转、粒子效果）
- 精致的 Ionicons 图标系统
- 触觉反馈增强体验

### 📱 安装说明
1. 下载 APK 文件
2. 在 Android 设备上允许安装未知来源应用
3. 打开 APK 文件进行安装
4. 开始您的占卜之旅

### ⚠️ 注意事项
- 此版本为 Debug 构建版本
- 适用于 Android 10.0 (API 24) 及以上版本
- 仅供学习和个人使用

---
**构建时间**: $(date '+%Y-%m-%d %H:%M')
**提交哈希**: $(git rev-parse --short HEAD)" \
    || {
        echo "❌ Release 创建失败，可能已存在"
        echo "访问：https://github.com/xieyinch/guanyin-lots-app/releases"
        exit 1
    }

echo ""
echo "✅ Release 创建成功!"
echo "🔗 查看：https://github.com/xieyinch/guanyin-lots-app/releases/tag/v$VERSION"
echo ""
echo "📱 安装命令 (使用 adb):"
echo "  adb install $APK_FILE"
