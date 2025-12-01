# App Mockup Studio

🎨 一款在线 App 截图 Mockup 生成工具，让产品截图更有质感。

## 预览

上传你的 App 截图，选择设备机型和背景，一键生成精美的产品展示图。

## 功能特性

- **多种背景风格** - 渐变色、图片背景、磨砂玻璃效果、自定义颜色
- **丰富机型支持** - iPhone、Pixel、Samsung、iPad 等主流设备
- **CSS 3D 效果** - X/Y 轴旋转、透视深度调节、6 种预设角度一键切换
- **双图展示模式** - 支持上传两张不同截图进行对比展示
- **高清导出** - 支持 1080p / 2K / 4K 分辨率导出
- **实时预览** - 所有调整即时生效

## 快速开始

```bash
# 克隆项目
git clone https://github.com/huanghfzhufeng/App-Mockup-Studio.git
cd App-Mockup-Studio

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 支持机型

| 品牌 | 机型 |
|------|------|
| Apple | iPhone 17 Pro, iPhone 16, iPhone 15 Pro, iPad Pro 13", iPad Air |
| Google | Pixel 9 Pro, Pixel 8 |
| Samsung | Galaxy S24 Ultra, Galaxy S24 |

## 项目结构

```
src/
├── main.jsx              # 应用入口
├── App.jsx               # 主组件
├── index.css             # Tailwind CSS
├── config/
│   └── constants.js      # 机型、背景、预设角度配置
├── components/
│   ├── DeviceFrame.jsx   # 设备框架组件
│   ├── ControlPanel.jsx  # 控制面板
│   └── PreviewArea.jsx   # 预览区域
└── hooks/
    └── useExport.js      # 导出逻辑
```

## 技术栈

- React 18
- Vite 5
- Tailwind CSS 3
- html2canvas
- Lucide React

## 扩展

### 添加新机型

编辑 `src/config/constants.js`：

```javascript
'new-device': {
  name: '设备名称',
  brand: 'apple',
  ratio: 9 / 19.5,
  bezelWidth: 10,
  islandType: 'dynamic-island', // dynamic-island | punch-hole | none
  cornerRadius: 48,
  screenRadius: 40,
  frameColor: {
    black: '#000000',
    white: '#ffffff'
  }
}
```

### 添加新背景

```javascript
{
  id: 'my-bg',
  type: 'gradient',  // gradient | image | custom-glass
  value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  name: '我的背景'
}
```

## License

MIT
