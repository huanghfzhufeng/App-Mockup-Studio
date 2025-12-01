import { useLocalStorage } from './useLocalStorage';

// 预设模板
const DEFAULT_TEMPLATES = [
  // 基础风格
  {
    id: 'app-store',
    name: 'App Store',
    config: {
      model: 'iphone-16',
      deviceColor: 'black',
      backgroundId: 'white',
      layout: 'single',
      rotateX: 5,
      rotateY: 15,
      perspective: 1000,
      hasShadow: true,
      isLandscape: false,
    }
  },
  {
    id: 'minimal',
    name: '极简白',
    config: {
      model: 'iphone-15-pro',
      deviceColor: 'titanium',
      backgroundId: 'white',
      layout: 'single',
      rotateX: 0,
      rotateY: 0,
      perspective: 1000,
      hasShadow: false,
      isLandscape: false,
    }
  },
  {
    id: 'dark-mode',
    name: '暗黑风',
    config: {
      model: 'iphone-16',
      deviceColor: 'black',
      backgroundId: 'black',
      layout: 'single',
      rotateX: 5,
      rotateY: -20,
      perspective: 1000,
      hasShadow: true,
      isLandscape: false,
    }
  },
  
  // 展示风格
  {
    id: 'showcase',
    name: '双机展示',
    config: {
      model: 'iphone-16',
      deviceColor: 'black',
      backgroundId: 'soft-purple',
      layout: 'double',
      rotateX: 10,
      rotateY: 0,
      perspective: 1200,
      hasShadow: true,
      isLandscape: false,
    }
  },
  {
    id: 'mixed-devices',
    name: '手机+平板',
    config: {
      model: 'iphone-16',
      deviceColor: 'black',
      backgroundId: 'soft-blue',
      layout: 'mixed',
      rotateX: 5,
      rotateY: 0,
      perspective: 1200,
      hasShadow: true,
      isLandscape: false,
    }
  },
  
  // 3D 效果
  {
    id: 'dramatic',
    name: '戏剧感',
    config: {
      model: 'iphone-16',
      deviceColor: 'blue',
      backgroundId: 'soft-gray',
      layout: 'single',
      rotateX: -5,
      rotateY: 35,
      perspective: 900,
      hasShadow: true,
      isLandscape: false,
    }
  },
  {
    id: 'top-view',
    name: '俯视角',
    config: {
      model: 'iphone-15-pro',
      deviceColor: 'titanium',
      backgroundId: 'warm-white',
      layout: 'single',
      rotateX: 25,
      rotateY: 0,
      perspective: 800,
      hasShadow: true,
      isLandscape: false,
    }
  },
  {
    id: 'floating',
    name: '悬浮感',
    config: {
      model: 'iphone-16',
      deviceColor: 'white',
      backgroundId: 'soft-pink',
      layout: 'single',
      rotateX: 15,
      rotateY: -15,
      perspective: 1100,
      hasShadow: true,
      isLandscape: false,
    }
  },
  
  // 设备特色
  {
    id: 'pixel-style',
    name: 'Pixel 风',
    config: {
      model: 'pixel-9-pro',
      deviceColor: 'porcelain',
      backgroundId: 'soft-green',
      layout: 'single',
      rotateX: 5,
      rotateY: 20,
      perspective: 1000,
      hasShadow: true,
      isLandscape: false,
    }
  },
  {
    id: 'samsung-style',
    name: 'Galaxy 风',
    config: {
      model: 'galaxy-s24-ultra',
      deviceColor: 'violet',
      backgroundId: 'soft-purple',
      layout: 'single',
      rotateX: 5,
      rotateY: -20,
      perspective: 1000,
      hasShadow: true,
      isLandscape: false,
    }
  },
  {
    id: 'ipad-showcase',
    name: 'iPad 展示',
    config: {
      model: 'ipad-pro-13',
      deviceColor: 'space',
      backgroundId: 'soft-gray',
      layout: 'single',
      rotateX: 10,
      rotateY: 15,
      perspective: 1200,
      hasShadow: true,
      isLandscape: false,
    }
  },
  
  // 横屏
  {
    id: 'landscape-game',
    name: '横屏游戏',
    config: {
      model: 'iphone-16',
      deviceColor: 'black',
      backgroundId: 'black',
      layout: 'single',
      rotateX: 5,
      rotateY: 10,
      perspective: 1000,
      hasShadow: true,
      isLandscape: true,
    }
  },
];

export function useTemplates() {
  const [customTemplates, setCustomTemplates] = useLocalStorage('mockup-templates', []);

  const allTemplates = [...DEFAULT_TEMPLATES, ...customTemplates];

  const saveTemplate = (name, config) => {
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name,
      config,
      isCustom: true,
    };
    setCustomTemplates([...customTemplates, newTemplate]);
    return newTemplate;
  };

  const deleteTemplate = (id) => {
    setCustomTemplates(customTemplates.filter(t => t.id !== id));
  };

  return { templates: allTemplates, saveTemplate, deleteTemplate };
}
