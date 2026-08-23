# Automotive Skill UI

这是 `$automotive-marketing-materials` 的本地可视化操作界面。它会在本机启动一个很薄的 Codex Bridge，网页负责收集需求，Bridge 负责调用 Codex CLI 执行 skill 并把图片结果显示回页面。

## 适用系统

- Windows 10/11
- macOS

## 使用前需要

1. 已安装并登录 Codex。
2. 已安装 Node.js。建议使用 LTS 版本。
3. 电脑可以联网。官网找图和 Codex 生成都需要网络。

完整安装包会自带 `automotive-marketing-materials` skill。运行安装脚本后，会自动复制到 Codex 的 skills 目录：

- Windows：`%USERPROFILE%\.codex\skills\automotive-marketing-materials`
- macOS：`~/.codex/skills/automotive-marketing-materials`

## 安装

Windows 双击：

```text
install.bat
```

macOS 双击：

```text
install.command
```

如果 macOS 无法双击运行，打开终端进入本目录执行：

```bash
chmod +x install.command start.command
sh install.sh
```

安装脚本会检查：

- 是否包含 packaged skill
- 是否已安装 Node.js / npm
- 是否已安装前端依赖
- 是否已把 skill 复制到 Codex skills 目录

## Windows 启动

双击：

```text
start.bat
```

然后打开：

```text
http://localhost:8787/
```

如果首次启动时缺少依赖，脚本会自动运行 `npm install`。

## macOS 启动

第一次解压后，如果 `start.command` 不能双击运行，先在终端进入本目录执行：

```bash
chmod +x start.command
```

然后双击：

```text
start.command
```

也可以在终端运行：

```bash
sh start.sh
```

然后打开：

```text
http://localhost:8787/
```

如果首次启动时缺少依赖，脚本会自动运行 `npm install`。

## 迁移到其他电脑

把整个文件夹复制到新电脑即可。建议不要复制历史生成记录，所以发布包默认不包含 `jobs/` 和 `node_modules/`。

新电脑首次使用顺序：

1. 解压安装包。
2. 运行 `install.bat` 或 `install.command`。
3. 运行 `start.bat` 或 `start.command`。
4. 打开 `http://localhost:8787/`。

缺少任何一项都会在启动窗口里提示。

## 输出位置

每次生成会在本目录下创建：

```text
jobs/<job-id>/
```

里面包含：

- `input.json`
- `prompt.txt`
- `codex.stdout.log`
- `codex.stderr.log`
- `output.png` 或 `output.jpg`

页面会自动检测输出图片并显示。

## 常见问题

### 页面能打开，但生成一直等待

通常是 Codex CLI 无法联网或当前终端没有网络权限。重新启动 Bridge，并确认 Codex CLI 可以在终端里正常执行。

### 提示缺少 skill

先安装 `automotive-marketing-materials` skill，再重新运行启动脚本。

### macOS 提示无法打开 start.command

在终端运行：

```bash
chmod +x start.command
```

如果仍被系统拦截，右键 `start.command`，选择“打开”。
