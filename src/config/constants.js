// 预设背景 - 简洁版
export const BACKGROUNDS = [
  // 纯色系
  { id: 'white', type: 'solid', value: '#ffffff', name: '纯白' },
  { id: 'light-gray', type: 'solid', value: '#f5f5f5', name: '浅灰' },
  { id: 'black', type: 'solid', value: '#1a1a1a', name: '纯黑' },
  { id: 'warm-white', type: 'solid', value: '#faf8f5', name: '暖白' },
  
  // 简洁渐变
  { id: 'soft-gray', type: 'gradient', value: 'linear-gradient(180deg, #f5f7fa 0%, #e4e8ec 100%)', name: '柔灰' },
  { id: 'soft-blue', type: 'gradient', value: 'linear-gradient(180deg, #e8f4fc 0%, #d1e8f8 100%)', name: '柔蓝' },
  { id: 'soft-purple', type: 'gradient', value: 'linear-gradient(180deg, #f3e8ff 0%, #e4d4f4 100%)', name: '柔紫' },
  { id: 'soft-pink', type: 'gradient', value: 'linear-gradient(180deg, #fce8ec 0%, #f8d4dc 100%)', name: '柔粉' },
  { id: 'soft-green', type: 'gradient', value: 'linear-gradient(180deg, #e8fcf0 0%, #d4f4e0 100%)', name: '柔绿' },
  { id: 'soft-orange', type: 'gradient', value: 'linear-gradient(180deg, #fff4e8 0%, #ffe8d4 100%)', name: '柔橙' },
  
  // 磨砂玻璃
  { id: 'bg-glass', type: 'custom-glass', value: 'glass', name: '磨砂' },
];

// 艺术字体配置
export const FONT_STYLES = [
  { id: 'default', name: '默认', fontFamily: 'system-ui, sans-serif', style: {} },
  { id: 'serif', name: '衬线', fontFamily: 'Georgia, serif', style: {} },
  { id: 'mono', name: '等宽', fontFamily: 'Consolas, monospace', style: {} },
  { id: 'rounded', name: '圆体', fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', style: { fontWeight: '500' } },
  
  // 艺术效果
  { id: 'gradient-blue', name: '渐变蓝', fontFamily: 'system-ui, sans-serif', style: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }},
  { id: 'gradient-sunset', name: '日落', fontFamily: 'system-ui, sans-serif', style: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }},
  { id: 'gradient-ocean', name: '海洋', fontFamily: 'system-ui, sans-serif', style: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }},
  { id: 'gradient-gold', name: '金色', fontFamily: 'system-ui, sans-serif', style: {
    background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }},
  
  // 特效
  { id: 'shadow', name: '阴影', fontFamily: 'system-ui, sans-serif', style: {
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  }},
  { id: 'outline', name: '描边', fontFamily: 'system-ui, sans-serif', style: {
    WebkitTextStroke: '1px currentColor',
    WebkitTextFillColor: 'transparent',
  }},
  { id: 'glow', name: '发光', fontFamily: 'system-ui, sans-serif', style: {
    textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
  }},
];

// 机型配置
export const DEVICE_MODELS = {
  // iPhone 系列
  'iphone-17-pro': {
    name: 'iPhone 17 Pro',
    brand: 'apple',
    ratio: 9 / 19.5,
    bezelWidth: 10,
    islandWidth: 100,
    islandType: 'dynamic-island',
    cornerRadius: 48,
    screenRadius: 40,
    frameColor: {
      titanium: '#8e8e93',
      black: '#1c1c1e',
      silver: '#e5e5ea',
      gold: '#d4af37'
    }
  },
  'iphone-16': {
    name: 'iPhone 16',
    brand: 'apple',
    ratio: 9 / 19.5,
    bezelWidth: 14,
    islandWidth: 90,
    islandType: 'dynamic-island',
    cornerRadius: 52,
    screenRadius: 42,
    frameColor: {
      black: '#000000',
      blue: '#a7c5eb',
      pink: '#ffb7b2',
      white: '#f2f2f2'
    }
  },
  'iphone-15-pro': {
    name: 'iPhone 15 Pro',
    brand: 'apple',
    ratio: 9 / 19.5,
    bezelWidth: 12,
    islandWidth: 95,
    islandType: 'dynamic-island',
    cornerRadius: 50,
    screenRadius: 40,
    frameColor: {
      titanium: '#8e8e93',
      black: '#1c1c1e',
      white: '#f5f5f7',
      blue: '#394867'
    }
  },
  
  // Android - Pixel 系列
  'pixel-9-pro': {
    name: 'Pixel 9 Pro',
    brand: 'google',
    ratio: 9 / 20,
    bezelWidth: 10,
    islandWidth: 0,
    islandType: 'punch-hole',
    cornerRadius: 44,
    screenRadius: 36,
    frameColor: {
      obsidian: '#1a1a1a',
      porcelain: '#f5f5f5',
      hazel: '#b8a99a',
      rose: '#e8c4c4'
    }
  },
  'pixel-8': {
    name: 'Pixel 8',
    brand: 'google',
    ratio: 9 / 20,
    bezelWidth: 12,
    islandWidth: 0,
    islandType: 'punch-hole',
    cornerRadius: 42,
    screenRadius: 34,
    frameColor: {
      obsidian: '#1a1a1a',
      hazel: '#c4b8a8',
      rose: '#f0d4d4',
      mint: '#a8d8c8'
    }
  },

  // Android - Samsung 系列
  'galaxy-s24-ultra': {
    name: 'Galaxy S24 Ultra',
    brand: 'samsung',
    ratio: 9 / 20.1,
    bezelWidth: 8,
    islandWidth: 0,
    islandType: 'punch-hole',
    cornerRadius: 36,
    screenRadius: 30,
    frameColor: {
      black: '#1a1a1a',
      gray: '#8e8e8e',
      violet: '#9b8aa8',
      yellow: '#f0e68c'
    }
  },
  'galaxy-s24': {
    name: 'Galaxy S24',
    brand: 'samsung',
    ratio: 9 / 19.5,
    bezelWidth: 10,
    islandWidth: 0,
    islandType: 'punch-hole',
    cornerRadius: 40,
    screenRadius: 32,
    frameColor: {
      black: '#1a1a1a',
      marble: '#e8e4e0',
      violet: '#b8a8c8',
      yellow: '#f5e6a3'
    }
  },

  // iPad 系列
  'ipad-pro-13': {
    name: 'iPad Pro 13"',
    brand: 'apple',
    ratio: 3 / 4,
    bezelWidth: 16,
    islandWidth: 0,
    islandType: 'none',
    cornerRadius: 28,
    screenRadius: 18,
    frameColor: {
      silver: '#e5e5ea',
      space: '#1c1c1e'
    }
  },
  'ipad-air': {
    name: 'iPad Air',
    brand: 'apple',
    ratio: 3 / 4.3,
    bezelWidth: 18,
    islandWidth: 0,
    islandType: 'none',
    cornerRadius: 32,
    screenRadius: 20,
    frameColor: {
      silver: '#e5e5ea',
      space: '#3a3a3c',
      blue: '#5eb0ef',
      purple: '#b8a9c9',
      starlight: '#f5f0e8'
    }
  }
};

// 预设 3D 角度
export const PRESET_ANGLES = [
  { id: 'front', name: '正面', rotateX: 0, rotateY: 0, perspective: 1000, icon: '⬜' },
  { id: 'left-tilt', name: '左倾', rotateX: 5, rotateY: 25, perspective: 1000, icon: '◪' },
  { id: 'right-tilt', name: '右倾', rotateX: 5, rotateY: -25, perspective: 1000, icon: '◩' },
  { id: 'top-view', name: '俯视', rotateX: 20, rotateY: 0, perspective: 800, icon: '▽' },
  { id: 'showcase', name: '展示', rotateX: 10, rotateY: 15, perspective: 1200, icon: '◈' },
  { id: 'dramatic', name: '戏剧', rotateX: -5, rotateY: 35, perspective: 900, icon: '◆' },
];

// 导出比例配置
export const EXPORT_RATIOS = [
  { id: 'auto', name: '自适应', ratio: null },
  { id: '1:1', name: '1:1', ratio: 1 },
  { id: '3:4', name: '3:4', ratio: 3/4 },
  { id: '4:3', name: '4:3', ratio: 4/3 },
  { id: '4:5', name: '4:5', ratio: 4/5 },
  { id: '9:16', name: '9:16', ratio: 9/16 },
  { id: '16:9', name: '16:9', ratio: 16/9 },
];

// 默认文字标注
export const DEFAULT_TEXT_ANNOTATION = {
  title: {
    text: '',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontStyle: 'default',
    position: { x: 0, y: -320 },
    visible: false,
  },
  subtitle: {
    text: '',
    fontSize: 24,
    fontWeight: 'normal',
    color: '#666666',
    fontStyle: 'default',
    position: { x: 0, y: -260 },
    visible: false,
  }
};
