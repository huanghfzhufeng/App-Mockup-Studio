import { useState, useRef, useEffect, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import { useExport } from './hooks/useExport';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboard } from './hooks/useKeyboard';
import { useTemplates } from './hooks/useTemplates';
import { useDarkMode } from './hooks/useDarkMode';
import { useHistory } from './hooks/useHistory';
import { BACKGROUNDS, DEFAULT_TEXT_ANNOTATION, EXPORT_RATIOS, DEFAULT_CONFIG } from './config/constants';

export default function App() {
  // 图片状态
  const [screenshot, setScreenshot] = useState(null);
  const [screenshot2, setScreenshot2] = useState(null);
  const [customBgImage, setCustomBgImage] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // 配置状态（本地存储）
  const [model, setModel] = useLocalStorage('mockup-model', DEFAULT_CONFIG.model);
  const [deviceColor, setDeviceColor] = useLocalStorage('mockup-color', DEFAULT_CONFIG.deviceColor);
  const [background, setBackground] = useLocalStorage('mockup-bg', BACKGROUNDS[0]);
  const [customBgColor, setCustomBgColor] = useLocalStorage('mockup-custom-bg', '#ffffff');
  const [layout, setLayout] = useLocalStorage('mockup-layout', DEFAULT_CONFIG.layout);
  const [fitMode, setFitMode] = useLocalStorage('mockup-fit', DEFAULT_CONFIG.fitMode);
  const [scale, setScale] = useLocalStorage('mockup-scale', DEFAULT_CONFIG.scale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [position2, setPosition2] = useState({ x: 0, y: 0 });
  const [moveMode, setMoveMode] = useState(false); // 移动模式开关
  const [activeDevice, setActiveDevice] = useState(1); // 当前选中的设备 1 或 2
  const [hasShadow, setHasShadow] = useLocalStorage('mockup-shadow', DEFAULT_CONFIG.hasShadow);
  const [exportRes, setExportRes] = useLocalStorage('mockup-res', DEFAULT_CONFIG.exportRes);
  const [exportRatio, setExportRatio] = useLocalStorage('mockup-ratio', EXPORT_RATIOS[0]);

  // 3D 效果
  const [rotateX, setRotateX] = useLocalStorage('mockup-rx', DEFAULT_CONFIG.rotateX);
  const [rotateY, setRotateY] = useLocalStorage('mockup-ry', DEFAULT_CONFIG.rotateY);
  const [perspective, setPerspective] = useLocalStorage('mockup-persp', DEFAULT_CONFIG.perspective);

  // 新功能
  const [isLandscape, setIsLandscape] = useLocalStorage('mockup-landscape', DEFAULT_CONFIG.isLandscape);
  const [enableAnimation, setEnableAnimation] = useLocalStorage('mockup-animation', false);
  const [watermark, setWatermark] = useLocalStorage('mockup-watermark', DEFAULT_CONFIG.watermark);

  // 文字标注
  const [annotation, setAnnotation] = useLocalStorage('mockup-annotation', DEFAULT_TEXT_ANNOTATION);
  const [isEditingText, setIsEditingText] = useState(false);

  // 暗色模式
  const { isDark, toggle: toggleDark } = useDarkMode();

  // 历史记录
  const { pushState, undo, redo, canUndo, canRedo } = useHistory({
    model, deviceColor, layout, rotateX, rotateY, perspective, hasShadow, isLandscape
  });

  const previewRef = useRef(null);
  const { exportImage } = useExport();
  const { templates, saveTemplate, deleteTemplate } = useTemplates();

  // 保存历史状态
  const saveHistory = useCallback(() => {
    pushState({ model, deviceColor, layout, rotateX, rotateY, perspective, hasShadow, isLandscape });
  }, [model, deviceColor, layout, rotateX, rotateY, perspective, hasShadow, isLandscape, pushState]);

  // 撤销
  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      setModel(state.model);
      setDeviceColor(state.deviceColor);
      setLayout(state.layout);
      setRotateX(state.rotateX);
      setRotateY(state.rotateY);
      setPerspective(state.perspective);
      setHasShadow(state.hasShadow);
      setIsLandscape(state.isLandscape);
    }
  }, [undo, setModel, setDeviceColor, setLayout, setRotateX, setRotateY, setPerspective, setHasShadow, setIsLandscape]);

  // 重做
  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      setModel(state.model);
      setDeviceColor(state.deviceColor);
      setLayout(state.layout);
      setRotateX(state.rotateX);
      setRotateY(state.rotateY);
      setPerspective(state.perspective);
      setHasShadow(state.hasShadow);
      setIsLandscape(state.isLandscape);
    }
  }, [redo, setModel, setDeviceColor, setLayout, setRotateX, setRotateY, setPerspective, setHasShadow, setIsLandscape]);

  // 图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setScreenshot(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setScreenshot2(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCustomBgImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 拖拽上传
  const handleImageDrop = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => setScreenshot(event.target.result);
    reader.readAsDataURL(file);
  };

  // 导出
  const handleExport = async () => {
    setIsExporting(true);
    const success = await exportImage(previewRef, exportRes, exportRatio?.ratio);
    if (!success) alert('导出失败，请重试');
    setIsExporting(false);
  };

  // 批量导出
  const handleBatchExport = async () => {
    setIsExporting(true);
    const ratiosToExport = EXPORT_RATIOS.filter(r => r.ratio !== null);
    for (const ratio of ratiosToExport) {
      await exportImage(previewRef, exportRes, ratio.ratio);
      await new Promise(r => setTimeout(r, 800));
    }
    setIsExporting(false);
  };

  // 重置所有设置
  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？')) {
      setModel(DEFAULT_CONFIG.model);
      setDeviceColor(DEFAULT_CONFIG.deviceColor);
      setLayout(DEFAULT_CONFIG.layout);
      setFitMode(DEFAULT_CONFIG.fitMode);
      setScale(DEFAULT_CONFIG.scale);
      setPosition({ x: 0, y: 0 });
      setPosition2({ x: 0, y: 0 });
      setMoveMode(false);
      setActiveDevice(1);
      setHasShadow(DEFAULT_CONFIG.hasShadow);
      setRotateX(DEFAULT_CONFIG.rotateX);
      setRotateY(DEFAULT_CONFIG.rotateY);
      setPerspective(DEFAULT_CONFIG.perspective);
      setIsLandscape(DEFAULT_CONFIG.isLandscape);
      setWatermark(DEFAULT_CONFIG.watermark);
      setBackground(BACKGROUNDS[0]);
      setAnnotation(DEFAULT_TEXT_ANNOTATION);
      setCustomBgImage(null);
    }
  };

  // 键盘快捷键
  useKeyboard({
    onExport: handleExport,
    setRotateX,
    setRotateY,
    rotateX,
    rotateY,
  });

  // Ctrl+Z/Y 快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // 模板操作
  const handleSaveTemplate = (name) => {
    saveTemplate(name, {
      model, deviceColor, backgroundId: background.id, layout,
      rotateX, rotateY, perspective, hasShadow, isLandscape
    });
  };

  const handleApplyTemplate = (template) => {
    saveHistory();
    const { config } = template;
    setModel(config.model);
    setDeviceColor(config.deviceColor);
    setLayout(config.layout);
    setRotateX(config.rotateX);
    setRotateY(config.rotateY);
    setPerspective(config.perspective);
    setHasShadow(config.hasShadow);
    if (config.isLandscape !== undefined) setIsLandscape(config.isLandscape);
    const bg = BACKGROUNDS.find(b => b.id === config.backgroundId);
    if (bg) setBackground(bg);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <ControlPanel
        screenshot={screenshot}
        screenshot2={screenshot2}
        onImageUpload={handleImageUpload}
        onImageUpload2={handleImageUpload2}
        onBgImageUpload={handleBgImageUpload}
        model={model}
        setModel={(v) => { saveHistory(); setModel(v); }}
        deviceColor={deviceColor}
        setDeviceColor={(v) => { saveHistory(); setDeviceColor(v); }}
        background={background}
        setBackground={setBackground}
        customBgColor={customBgColor}
        setCustomBgColor={setCustomBgColor}
        customBgImage={customBgImage}
        layout={layout}
        setLayout={(v) => { saveHistory(); setLayout(v); }}
        fitMode={fitMode}
        setFitMode={setFitMode}
        scale={scale}
        setScale={setScale}
        position={position}
        setPosition={setPosition}
        position2={position2}
        setPosition2={setPosition2}
        moveMode={moveMode}
        setMoveMode={setMoveMode}
        activeDevice={activeDevice}
        setActiveDevice={setActiveDevice}
        hasShadow={hasShadow}
        setHasShadow={(v) => { saveHistory(); setHasShadow(v); }}
        exportRes={exportRes}
        setExportRes={setExportRes}
        exportRatio={exportRatio}
        setExportRatio={setExportRatio}
        onExport={handleExport}
        onBatchExport={handleBatchExport}
        isExporting={isExporting}
        rotateX={rotateX}
        setRotateX={(v) => { saveHistory(); setRotateX(v); }}
        rotateY={rotateY}
        setRotateY={(v) => { saveHistory(); setRotateY(v); }}
        perspective={perspective}
        setPerspective={setPerspective}
        annotation={annotation}
        setAnnotation={setAnnotation}
        isEditingText={isEditingText}
        setIsEditingText={setIsEditingText}
        templates={templates}
        onSaveTemplate={handleSaveTemplate}
        onApplyTemplate={handleApplyTemplate}
        onDeleteTemplate={deleteTemplate}
        isLandscape={isLandscape}
        setIsLandscape={(v) => { saveHistory(); setIsLandscape(v); }}
        enableAnimation={enableAnimation}
        setEnableAnimation={setEnableAnimation}
        watermark={watermark}
        setWatermark={setWatermark}
        isDark={isDark}
        toggleDark={toggleDark}
        onReset={handleReset}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <PreviewArea
        ref={previewRef}
        background={background}
        customBgColor={customBgColor}
        customBgImage={customBgImage}
        layout={layout}
        model={model}
        deviceColor={deviceColor}
        screenshot={screenshot}
        screenshot2={screenshot2}
        fitMode={fitMode}
        scale={scale}
        position={position}
        setPosition={setPosition}
        position2={position2}
        setPosition2={setPosition2}
        moveMode={moveMode}
        setMoveMode={setMoveMode}
        activeDevice={activeDevice}
        setActiveDevice={setActiveDevice}
        hasShadow={hasShadow}
        rotateX={rotateX}
        rotateY={rotateY}
        perspective={perspective}
        annotation={annotation}
        setAnnotation={setAnnotation}
        isEditingText={isEditingText}
        exportRatio={exportRatio}
        isLandscape={isLandscape}
        enableAnimation={enableAnimation}
        watermark={watermark}
        onImageDrop={handleImageDrop}
        isDark={isDark}
      />
    </div>
  );
}
