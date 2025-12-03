import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BACKGROUNDS, DEFAULT_TEXT_ANNOTATION, EXPORT_RATIOS, DEFAULT_CONFIG, DEVICE_MODELS } from '../config/constants';

// 设备配置 slice
const createDeviceSlice = (set) => ({
  // 设备基础配置
  model: DEFAULT_CONFIG.model,
  deviceColor: DEFAULT_CONFIG.deviceColor,
  isLandscape: DEFAULT_CONFIG.isLandscape,
  hasShadow: DEFAULT_CONFIG.hasShadow,
  
  // 设备位置和缩放
  devicePosition1: { x: 0, y: 0 },
  devicePosition2: { x: 0, y: 0 },
  deviceScale1: 1,
  deviceScale2: 1,
  
  // 图片相关
  screenshot: null,
  screenshot2: null,
  fitMode: DEFAULT_CONFIG.fitMode,
  scale: DEFAULT_CONFIG.scale,
  position: { x: 0, y: 0 },
  position2: { x: 0, y: 0 },
  
  // 交互状态
  moveMode: false,
  activeDevice: 1,

  // Actions
  setModel: (model) => set({ model, deviceColor: Object.keys(DEVICE_MODELS[model].frameColor)[0] }),
  setDeviceColor: (deviceColor) => set({ deviceColor }),
  setIsLandscape: (isLandscape) => set({ isLandscape }),
  setHasShadow: (hasShadow) => set({ hasShadow }),
  setDevicePosition1: (devicePosition1) => set({ devicePosition1 }),
  setDevicePosition2: (devicePosition2) => set({ devicePosition2 }),
  setDeviceScale1: (deviceScale1) => set({ deviceScale1 }),
  setDeviceScale2: (deviceScale2) => set({ deviceScale2 }),
  setScreenshot: (screenshot) => set({ screenshot }),
  setScreenshot2: (screenshot2) => set({ screenshot2 }),
  setFitMode: (fitMode) => set({ fitMode }),
  setScale: (scale) => set({ scale }),
  setPosition: (position) => set({ position }),
  setPosition2: (position2) => set({ position2 }),
  setMoveMode: (moveMode) => set({ moveMode }),
  setActiveDevice: (activeDevice) => set({ activeDevice }),
});

// 3D 效果 slice
const create3DSlice = (set) => ({
  rotateX: DEFAULT_CONFIG.rotateX,
  rotateY: DEFAULT_CONFIG.rotateY,
  perspective: DEFAULT_CONFIG.perspective,

  setRotateX: (rotateX) => set({ rotateX }),
  setRotateY: (rotateY) => set({ rotateY }),
  setPerspective: (perspective) => set({ perspective }),
  
  applyPreset: (preset) => set({
    rotateX: preset.rotateX,
    rotateY: preset.rotateY,
    perspective: preset.perspective,
  }),
});

// 布局和背景 slice
const createLayoutSlice = (set) => ({
  layout: DEFAULT_CONFIG.layout,
  background: BACKGROUNDS[0],
  customBgColor: '#ffffff',
  customBgImage: null,

  setLayout: (layout) => set({ layout }),
  setBackground: (background) => set({ background }),
  setCustomBgColor: (customBgColor) => set({ customBgColor }),
  setCustomBgImage: (customBgImage) => set({ customBgImage }),
});


// 文字标注 slice
const createAnnotationSlice = (set) => ({
  annotation: DEFAULT_TEXT_ANNOTATION,
  isEditingText: false,
  watermark: DEFAULT_CONFIG.watermark,

  setAnnotation: (annotation) => set({ annotation }),
  setIsEditingText: (isEditingText) => set({ isEditingText }),
  setWatermark: (watermark) => set({ watermark }),
  
  updateAnnotation: (type, field, value) => set((state) => ({
    annotation: {
      ...state.annotation,
      [type]: { ...state.annotation[type], [field]: value }
    }
  })),
});

// 导出配置 slice
const createExportSlice = (set) => ({
  exportRes: DEFAULT_CONFIG.exportRes,
  exportRatio: EXPORT_RATIOS[0],
  isExporting: false,
  enableAnimation: false,

  setExportRes: (exportRes) => set({ exportRes }),
  setExportRatio: (exportRatio) => set({ exportRatio }),
  setIsExporting: (isExporting) => set({ isExporting }),
  setEnableAnimation: (enableAnimation) => set({ enableAnimation }),
});

// UI 状态 slice
const createUISlice = (set, get) => ({
  isDark: false,

  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
  
  // 重置所有设置
  resetAll: () => set({
    model: DEFAULT_CONFIG.model,
    deviceColor: DEFAULT_CONFIG.deviceColor,
    layout: DEFAULT_CONFIG.layout,
    fitMode: DEFAULT_CONFIG.fitMode,
    scale: DEFAULT_CONFIG.scale,
    position: { x: 0, y: 0 },
    position2: { x: 0, y: 0 },
    devicePosition1: { x: 0, y: 0 },
    devicePosition2: { x: 0, y: 0 },
    deviceScale1: 1,
    deviceScale2: 1,
    moveMode: false,
    activeDevice: 1,
    hasShadow: DEFAULT_CONFIG.hasShadow,
    rotateX: DEFAULT_CONFIG.rotateX,
    rotateY: DEFAULT_CONFIG.rotateY,
    perspective: DEFAULT_CONFIG.perspective,
    isLandscape: DEFAULT_CONFIG.isLandscape,
    watermark: DEFAULT_CONFIG.watermark,
    background: BACKGROUNDS[0],
    annotation: DEFAULT_TEXT_ANNOTATION,
    customBgImage: null,
  }),
});

// 历史记录 slice
const createHistorySlice = (set, get) => ({
  history: [],
  historyIndex: -1,

  // 保存当前状态到历史
  saveHistory: () => {
    const state = get();
    const snapshot = {
      model: state.model,
      deviceColor: state.deviceColor,
      layout: state.layout,
      rotateX: state.rotateX,
      rotateY: state.rotateY,
      perspective: state.perspective,
      hasShadow: state.hasShadow,
      isLandscape: state.isLandscape,
    };
    
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(snapshot);
      if (newHistory.length > 50) newHistory.shift();
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      set({
        ...prevState,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        ...nextState,
        historyIndex: historyIndex + 1,
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
});

// 合并所有 slices 创建 store
export const useAppStore = create(
  persist(
    (set, get) => ({
      ...createDeviceSlice(set),
      ...create3DSlice(set),
      ...createLayoutSlice(set),
      ...createAnnotationSlice(set),
      ...createExportSlice(set),
      ...createUISlice(set, get),
      ...createHistorySlice(set, get),
    }),
    {
      name: 'mockup-storage',
      partialize: (state) => ({
        // 只持久化配置，不持久化图片和临时状态
        model: state.model,
        deviceColor: state.deviceColor,
        layout: state.layout,
        hasShadow: state.hasShadow,
        rotateX: state.rotateX,
        rotateY: state.rotateY,
        perspective: state.perspective,
        isLandscape: state.isLandscape,
        exportRes: state.exportRes,
        isDark: state.isDark,
        deviceScale1: state.deviceScale1,
        deviceScale2: state.deviceScale2,
        watermark: state.watermark,
        annotation: state.annotation,
      }),
    }
  )
);

// 便捷的 selector hooks
export const useDeviceConfig = () => useAppStore((state) => ({
  model: state.model,
  deviceColor: state.deviceColor,
  isLandscape: state.isLandscape,
  hasShadow: state.hasShadow,
  setModel: state.setModel,
  setDeviceColor: state.setDeviceColor,
  setIsLandscape: state.setIsLandscape,
  setHasShadow: state.setHasShadow,
}));

export const use3DConfig = () => useAppStore((state) => ({
  rotateX: state.rotateX,
  rotateY: state.rotateY,
  perspective: state.perspective,
  setRotateX: state.setRotateX,
  setRotateY: state.setRotateY,
  setPerspective: state.setPerspective,
  applyPreset: state.applyPreset,
}));

export const useLayoutConfig = () => useAppStore((state) => ({
  layout: state.layout,
  background: state.background,
  customBgColor: state.customBgColor,
  customBgImage: state.customBgImage,
  setLayout: state.setLayout,
  setBackground: state.setBackground,
  setCustomBgColor: state.setCustomBgColor,
  setCustomBgImage: state.setCustomBgImage,
}));
