import { useLocalStorage } from './useLocalStorage';

// 预设模板
const DEFAULT_TEMPLATES = [
  {
    id: 'app-store',
    name: 'App Store 风格',
    config: {
      model: 'iphone-16',
      deviceColor: 'black',
      backgroundId: 'bg-1',
      layout: 'single',
      rotateX: 5,
      rotateY: 15,
      perspective: 1000,
      hasShadow: true,
    }
  },
  {
    id: 'showcase',
    name: '产品展示',
    config: {
      model: 'iphone-16',
      deviceColor: 'black',
      backgroundId: 'bg-3',
      layout: 'double',
      rotateX: 10,
      rotateY: 0,
      perspective: 1200,
      hasShadow: true,
    }
  },
  {
    id: 'minimal',
    name: '极简风格',
    config: {
      model: 'iphone-15-pro',
      deviceColor: 'titanium',
      backgroundId: 'bg-1',
      layout: 'single',
      rotateX: 0,
      rotateY: 0,
      perspective: 1000,
      hasShadow: false,
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
