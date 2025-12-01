import { useState, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import { useExport } from './hooks/useExport';
import { BACKGROUNDS } from './config/constants';

export default function App() {
  const [screenshot, setScreenshot] = useState(null);
  const [screenshot2, setScreenshot2] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // 配置状态
  const [model, setModel] = useState('iphone-16');
  const [deviceColor, setDeviceColor] = useState('black');
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [customBgColor, setCustomBgColor] = useState('#ffffff');
  const [layout, setLayout] = useState('single');
  const [fitMode, setFitMode] = useState('cover');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasShadow, setHasShadow] = useState(true);
  const [exportRes, setExportRes] = useState(2);
  
  // 3D 效果状态
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [perspective, setPerspective] = useState(1000);

  const previewRef = useRef(null);
  const { exportImage } = useExport();

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

  const handleExport = async () => {
    setIsExporting(true);
    const success = await exportImage(previewRef, exportRes);
    if (!success) alert('导出失败，请重试');
    setIsExporting(false);
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
        onExport={handleExport}
        isExporting={isExporting}
        rotateX={rotateX}
        setRotateX={setRotateX}
        rotateY={rotateY}
        setRotateY={setRotateY}
        perspective={perspective}
        setPerspective={setPerspective}
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
        hasShadow={hasShadow}
        rotateX={rotateX}
        rotateY={rotateY}
        perspective={perspective}
      />
    </div>
  );
}
