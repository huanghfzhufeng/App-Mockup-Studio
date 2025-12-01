import { useState, useRef, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import { useExport, EXPORT_RATIOS } from './hooks/useExport';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboard } from './hooks/useKeyboard';
import { useTemplates } from './hooks/useTemplates';
import { BACKGROUNDS, DEFAULT_TEXT_ANNOTATION, EXPORT_RATIOS as CONFIG_RATIOS } from './config/constants';

export default function App() {
  // 图片状态
  const [screenshot, setScreenshot] = useState(null);
  const [screenshot2, setScreenshot2] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // 使用本地存储保存配置
  const [model, setModel] = useLocalStorage('mockup-model', 'iphone-16');
  const [deviceColor, setDeviceColor] = useLocalStorage('mockup-color', 'black');
  const [background, setBackground] = useLocalStorage('mockup-bg', BACKGROUNDS[0]);
  const [customBgColor, setCustomBgColor] = useLocalStorage('mockup-custom-bg', '#ffffff');
  const [layout, setLayout] = useLocalStorage('mockup-layout', 'single');
  const [fitMode, setFitMode] = useLocalStorage('mockup-fit', 'cover');
  const [scale, setScale] = useLocalStorage('mockup-scale', 1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasShadow, setHasShadow] = useLocalStorage('mockup-shadow', true);
  const [exportRes, setExportRes] = useLocalStorage('mockup-res', 2);
  const [exportRatio, setExportRatio] = useLocalStorage('mockup-ratio', CONFIG_RATIOS[0]);
  
  // 3D 效果状态
  const [rotateX, setRotateX] = useLocalStorage('mockup-rx', 0);
  const [rotateY, setRotateY] = useLocalStorage('mockup-ry', 0);
  const [perspective, setPerspective] = useLocalStorage('mockup-persp', 1000);

  // 文字标注
  const [annotation, setAnnotation] = useLocalStorage('mockup-annotation', DEFAULT_TEXT_ANNOTATION);
  const [isEditingText, setIsEditingText] = useState(false);

  const previewRef = useRef(null);
  const { exportImage, batchExport } = useExport();
  const { templates, saveTemplate, deleteTemplate } = useTemplates();

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
    const ratiosToExport = CONFIG_RATIOS.filter(r => r.ratio !== null);
    for (const ratio of ratiosToExport) {
      await exportImage(previewRef, exportRes, ratio.ratio);
      await new Promise(r => setTimeout(r, 800));
    }
    setIsExporting(false);
  };

  // 键盘快捷键
  useKeyboard({
    onExport: handleExport,
    setRotateX,
    setRotateY,
    rotateX,
    rotateY,
  });

  // 模板操作
  const handleSaveTemplate = (name) => {
    saveTemplate(name, {
      model,
      deviceColor,
      backgroundId: background.id,
      layout,
      rotateX,
      rotateY,
      perspective,
      hasShadow,
    });
  };

  const handleApplyTemplate = (template) => {
    const { config } = template;
    setModel(config.model);
    setDeviceColor(config.deviceColor);
    setLayout(config.layout);
    setRotateX(config.rotateX);
    setRotateY(config.rotateY);
    setPerspective(config.perspective);
    setHasShadow(config.hasShadow);
    
    // 查找背景
    const bg = BACKGROUNDS.find(b => b.id === config.backgroundId);
    if (bg) setBackground(bg);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col md:flex-row">
      <ControlPanel
        screenshot={screenshot}
        screenshot2={screenshot2}
        onImageUpload={handleImageUpload}
        onImageUpload2={handleImageUpload2}
        model={model}
        setModel={setModel}
        deviceColor={deviceColor}
        setDeviceColor={setDeviceColor}
        background={background}
        setBackground={setBackground}
        customBgColor={customBgColor}
        setCustomBgColor={setCustomBgColor}
        layout={layout}
        setLayout={setLayout}
        fitMode={fitMode}
        setFitMode={setFitMode}
        scale={scale}
        setScale={setScale}
        position={position}
        setPosition={setPosition}
        hasShadow={hasShadow}
        setHasShadow={setHasShadow}
        exportRes={exportRes}
        setExportRes={setExportRes}
        exportRatio={exportRatio}
        setExportRatio={setExportRatio}
        onExport={handleExport}
        onBatchExport={handleBatchExport}
        isExporting={isExporting}
        rotateX={rotateX}
        setRotateX={setRotateX}
        rotateY={rotateY}
        setRotateY={setRotateY}
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
      />
      <PreviewArea
        ref={previewRef}
        background={background}
        customBgColor={customBgColor}
        layout={layout}
        model={model}
        deviceColor={deviceColor}
        screenshot={screenshot}
        screenshot2={screenshot2}
        fitMode={fitMode}
        scale={scale}
        position={position}
        setPosition={setPosition}
        hasShadow={hasShadow}
        rotateX={rotateX}
        rotateY={rotateY}
        perspective={perspective}
        annotation={annotation}
        setAnnotation={setAnnotation}
        isEditingText={isEditingText}
        exportRatio={exportRatio}
      />
    </div>
  );
}
