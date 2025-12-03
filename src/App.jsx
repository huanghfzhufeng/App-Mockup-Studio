import { useRef, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import UploadPanel from './components/UploadPanel';
import { useExport } from './hooks/useExport';
import { useTemplates } from './hooks/useTemplates';
import { useKeyboard } from './hooks/useKeyboard';
import { useImageUpload, readImageFile } from './hooks/useImageUpload';
import { useAppStore } from './store/useAppStore';
import { useToast, ToastContainer } from './components/ui/Toast';
import { EXPORT_RATIOS } from './config/constants';

export default function App() {
  const previewRef = useRef(null);
  const { exportImage } = useExport();
  const { templates, saveTemplate, deleteTemplate } = useTemplates();
  const { toasts, toast, removeToast } = useToast();

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
    setLayout,
    setRotateX,
    setRotateY,
    setPerspective,
    setHasShadow,
    setIsLandscape,
  } = useAppStore();

  // 图片上传处理 - 使用统一的 hook
  const handleImageUpload = useImageUpload(setScreenshot);
  const handleImageUpload2 = useImageUpload(setScreenshot2);
  const handleBgImageUpload = useImageUpload(setCustomBgImage);

  // 拖拽上传
  const handleImageDrop = useCallback((file) => {
    readImageFile(file, setScreenshot);
  }, [setScreenshot]);

  // 导出
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const success = await exportImage(previewRef, exportRes, exportRatio?.ratio);
      if (success) {
        toast.success('导出成功！');
      } else {
        toast.error('导出失败，请重试');
      }
    } catch (err) {
      toast.error('导出出错：' + err.message);
    }
    setIsExporting(false);
  }, [exportImage, exportRes, exportRatio, setIsExporting, toast]);

  // 批量导出
  const handleBatchExport = useCallback(async () => {
    setIsExporting(true);
    const ratiosToExport = EXPORT_RATIOS.filter(r => r.ratio !== null);
    let successCount = 0;
    
    for (const ratio of ratiosToExport) {
      const success = await exportImage(previewRef, exportRes, ratio.ratio);
      if (success) successCount++;
      await new Promise(r => setTimeout(r, 800));
    }
    
    toast.success(`批量导出完成！成功 ${successCount}/${ratiosToExport.length}`);
    setIsExporting(false);
  }, [exportImage, exportRes, setIsExporting, toast]);

  // 模板操作
  const handleSaveTemplate = useCallback((name) => {
    saveTemplate(name, {
      model, deviceColor, backgroundId: background.id, layout,
      rotateX, rotateY, perspective, hasShadow, isLandscape
    });
    toast.success(`模板 "${name}" 已保存`);
  }, [saveTemplate, model, deviceColor, background, layout, rotateX, rotateY, perspective, hasShadow, isLandscape, toast]);

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
    toast.info(`已应用模板 "${template.name}"`);
  }, [saveHistory, setModel, setDeviceColor, setLayout, setRotateX, setRotateY, setPerspective, setHasShadow, setIsLandscape, toast]);

  // 统一的键盘快捷键管理
  useKeyboard({ onExport: handleExport });

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
      
      {/* Toast 通知容器 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
