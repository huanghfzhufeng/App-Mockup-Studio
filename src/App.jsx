import { useRef, useEffect, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import UploadPanel from './components/UploadPanel';
import { useExport } from './hooks/useExport';
import { useTemplates } from './hooks/useTemplates';
import { useAppStore } from './store/useAppStore';
import { EXPORT_RATIOS } from './config/constants';

export default function App() {
  const previewRef = useRef(null);
  const { exportImage } = useExport();
  const { templates, saveTemplate, deleteTemplate } = useTemplates();

  // 从 store 获取状态和方法
  const {
    isDark,
    isExporting,
    setIsExporting,
    exportRes,
    exportRatio,
    setScreenshot,
    setScreenshot2,
    setCustomBgImage,
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistory,
    // 用于模板
    model,
    deviceColor,
    background,
    layout,
    rotateX,
    rotateY,
    perspective,
    hasShadow,
    isLandscape,
    setModel,
    setDeviceColor,
    setBackground,
    setLayout,
    setRotateX,
    setRotateY,
    setPerspective,
    setHasShadow,
    setIsLandscape,
  } = useAppStore();

  // 图片上传处理
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setScreenshot(event.target.result);
      reader.readAsDataURL(file);
    }
  }, [setScreenshot]);

  const handleImageUpload2 = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setScreenshot2(event.target.result);
      reader.readAsDataURL(file);
    }
  }, [setScreenshot2]);

  const handleBgImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCustomBgImage(event.target.result);
      reader.readAsDataURL(file);
    }
  }, [setCustomBgImage]);

  // 拖拽上传
  const handleImageDrop = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => setScreenshot(event.target.result);
    reader.readAsDataURL(file);
  }, [setScreenshot]);

  // 导出
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    const success = await exportImage(previewRef, exportRes, exportRatio?.ratio);
    if (!success) alert('导出失败，请重试');
    setIsExporting(false);
  }, [exportImage, exportRes, exportRatio, setIsExporting]);

  // 批量导出
  const handleBatchExport = useCallback(async () => {
    setIsExporting(true);
    const ratiosToExport = EXPORT_RATIOS.filter(r => r.ratio !== null);
    for (const ratio of ratiosToExport) {
      await exportImage(previewRef, exportRes, ratio.ratio);
      await new Promise(r => setTimeout(r, 800));
    }
    setIsExporting(false);
  }, [exportImage, exportRes, setIsExporting]);

  // 模板操作
  const handleSaveTemplate = useCallback((name) => {
    saveTemplate(name, {
      model, deviceColor, backgroundId: background.id, layout,
      rotateX, rotateY, perspective, hasShadow, isLandscape
    });
  }, [saveTemplate, model, deviceColor, background, layout, rotateX, rotateY, perspective, hasShadow, isLandscape]);

  const handleApplyTemplate = useCallback((template) => {
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
  }, [saveHistory, setModel, setDeviceColor, setLayout, setRotateX, setRotateY, setPerspective, setHasShadow, setIsLandscape]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z 撤销
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y 重做
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      // Ctrl+E 导出
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
      // 方向键调整角度
      if (e.key === 'ArrowLeft') {
        setRotateY(prev => Math.max(-45, prev - 5));
      }
      if (e.key === 'ArrowRight') {
        setRotateY(prev => Math.min(45, prev + 5));
      }
      if (e.key === 'ArrowUp') {
        setRotateX(prev => Math.max(-30, prev - 5));
      }
      if (e.key === 'ArrowDown') {
        setRotateX(prev => Math.min(30, prev + 5));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleExport, setRotateX, setRotateY]);

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <ControlPanel
        onBgImageUpload={handleBgImageUpload}
        templates={templates}
        onSaveTemplate={handleSaveTemplate}
        onApplyTemplate={handleApplyTemplate}
        onDeleteTemplate={deleteTemplate}
      />
      <PreviewArea
        ref={previewRef}
        onImageDrop={handleImageDrop}
      />
      <UploadPanel
        onImageUpload={handleImageUpload}
        onImageUpload2={handleImageUpload2}
        onExport={handleExport}
        onBatchExport={handleBatchExport}
        isExporting={isExporting}
      />
    </div>
  );
}
