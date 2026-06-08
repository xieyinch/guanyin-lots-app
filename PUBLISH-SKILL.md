# 🚀 Build Android APK Skill - GitHub 发布指南

## 快速发布（3 步完成）

### 步骤 1: 登录 GitHub CLI

```bash
gh auth login
```

按照提示完成登录（选择 GitHub.com → HTTPS → 复制代码在浏览器登录）

### 步骤 2: 运行发布脚本

```bash
cd /workspace/build-android-apk-skill
chmod +x scripts/publish-to-github.sh
./scripts/publish-to-github.sh
```

### 步骤 3: 完成！

脚本会自动：
- ✅ 创建 GitHub 仓库 `build-android-apk`
- ✅ 推送所有代码
- ✅ 创建 Release v1.0.0
- ✅ 显示仓库链接

---

## 手动发布方式（如不想使用 CLI）

### 1. 创建 GitHub 仓库

访问：https://github.com/new

- **Repository name**: `build-android-apk`
- **Description**: `Expo/React Native Android APK 构建 Skill - 自动化 JDK/Android SDK 安装和 APK 构建`
- **Public** ✅
- **不要** 初始化 README

### 2. 推送代码

```bash
cd /workspace/build-android-apk-skill

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/build-android-apk.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3. 创建 Release

```bash
# 创建 tag
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
```

然后在 GitHub Releases 页面手动创建 Release。

---

## 发布后的仓库信息

### 仓库结构
```
build-android-apk/
├── README.md
├── DEPLOY.md
├── SUMMARY.md
├── .gitignore
├── scripts/
│   ├── install.sh
│   └── publish-to-github.sh
└── skills/
    └── build-android-apk/
        ├── SKILL.md
        └── build.sh
```

### 用户使用方式

用户安装后在 MonkeyCode 中输入：

```
skill: build-android-apk
```

即可自动构建 Android APK！

### Skill 安装说明

```bash
# 用户克隆仓库
git clone https://github.com/YOUR_USERNAME/build-android-apk.git
cd build-android-apk

# 安装 Skill
./scripts/install.sh
```

---

## 验证发布成功

发布成功后，你应该能看到：

- ✅ GitHub 仓库：`https://github.com/YOUR_USERNAME/build-android-apk`
- ✅ 代码已推送：显示所有文件
- ✅ Release：`https://github.com/YOUR_USERNAME/build-android-apk/releases/tag/v1.0.0`

---

## 分享 Skill

发布后可以：

1. 在 MonkeyCode 社区分享链接
2. 添加到官方 Skills 列表
3. 编写使用教程

---

**创建时间**: 2026-06-08
**Skill 版本**: v1.0.0
