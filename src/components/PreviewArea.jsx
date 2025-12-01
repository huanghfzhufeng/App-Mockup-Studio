import { forwardRef, useState, useRef } from 'react';
import { Move, Lock } from 'lucide-react';
import DeviceFrame from './DeviceFrame';
import TextAnnotation from './TextAnnotation';

const PreviewArea = forwardRef(({
  background,
  customBgColor,
  customBgImage,
  layout,
  model,
  model2,
  deviceColor,
  screenshot,
  screenshot2,
  fitMode,
  scale,
  position,
  setPosition,
  position2,
  setPosition2,
  moveMode,
  setMoveMode,
  activeDevice,
  setActiveDevice,
  hasShadow,
  rotateX,
  rotateY,
  perspective,
  annotation,
  setAnnotation,
  isEditingText,
  exportRatio,
  isLandscape,
  enableAnimation,
  watermark,
  onImageDrop,
  isDark
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const getBackgroundStyle = () => {
    if (customBgImage) {
      return { backgroundImage: `url(${customBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (background.type === 'custom-glass') {
      return { background: isDark ? 'hsl(240 10% 10%)' : 'hsl(240 5% 96%)' };
    }
    if (background.id === 'custom') {
      return { backgroundColor: customBgColor };
    }
    if (background.type === 'image') {
      return { backgroundImage: background.value, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: background.value };
  };

  const handleMouseDown = (e, deviceIndex) => {
    if (isEditingText || !moveMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    const currentPos = deviceIndex === 1 ? position : position2;
    posStart.current = { ...currentPos };
    setActiveDevice(deviceIndex);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !moveMode) return;
    const effectiveScale = scale * previewZoom;
    const dx = (e.clientX - dragStart.current.x) / effectiveScale;
    const dy = (e.clientY - dragStart.current.y) / effectiveScale;
    const newPos = {
      x: Math.round(posStart.current.x + dx),
      y: Math.round(posStart.current.y + dy),
    };
    if (activeDevice === 1) {
      setPosition(newPos);
    } else {
      setPosition2(newPos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setPreviewZoom(prev => Math.max(0.3, Math.min(2, prev + delta)));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageDrop?.(files[0]);
    }
  };

  const secondImage = screenshot2 || screenshot;
  const secondModel = model2 || model;

  const getCanvasStyle = () => {
    const baseWidth = layout === 'double' || layout === 'mixed' ? 900 : 600;
    const baseHeight = 900;
    
    if (exportRatio && exportRatio.ratio) {
      const height = baseWidth / exportRatio.ratio;
      return {
        minWidth: `${baseWidth}px`,
        minHeight: `${Math.max(height, 600)}px`,
      };
    }
    
    return {
      minWidth: `${baseWidth}px`,
      minHeight: `${baseHeight}px`,
    };
  };

  return (
    <div 
      className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-10 bg-muted/30"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />

      {/* 拖拽上传提示 */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center">
          <div className="glass px-6 py-4 rounded-xl">
            <p className="text-base font-medium text-primary">释放以上传图片</p>
          </div>
        </div>
      )}

      {/* 导出画布 */}
      <div 
        ref={ref}
        className={`relative shadow-2xl transition-all duration-500 overflow-hidden rounded-lg ${moveMode && isDragging ? 'cursor-grabbing' : moveMode ? 'cursor-grab' : 'cursor-default'}`}
        style={{
          ...getBackgroundStyle(),
          ...getCanvasStyle(),
          width: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px',
          perspective: `${perspective}px`,
          transform: `scale(${previewZoom})`,
          transformOrigin: 'center center',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* 磨砂玻璃特效层 */}
        {background.type === 'custom-glass' && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 z-0" />
            <div className="absolute inset-4 rounded-3xl bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white/50 z-0 shadow-lg" />
          </>
        )}

        {/* 文字标注 */}
        <TextAnnotation 
          annotation={annotation} 
          onChange={setAnnotation}
          isEditing={isEditingText}
        />

        <div 
          className={`relative z-10 flex ${layout === 'double' || layout === 'mixed' ? 'gap-16' : ''} items-center justify-center`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className={`transition-transform duration-500 ${moveMode ? 'cursor-move' : ''} ${moveMode && activeDevice === 1 ? 'ring-2 ring-primary ring-offset-4 ring-offset-transparent rounded-[40px]' : ''}`}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: layout !== 'single' ? 'translateZ(20px)' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 1)}
          >
            <DeviceFrame 
              model={model} 
              color={deviceColor} 
              image={screenshot} 
              fitMode={fitMode}
              scale={scale}
              position={position}
              hasShadow={hasShadow}
              rotateX={rotateX}
              rotateY={layout !== 'single' ? rotateY + 15 : rotateY}
              isLandscape={isLandscape}
              enableAnimation={enableAnimation}
            />
          </div>
          
          {(layout === 'double' || layout === 'mixed') && (
            <div 
              className={`transition-transform duration-500 ${moveMode ? 'cursor-move' : ''} ${moveMode && activeDevice === 2 ? 'ring-2 ring-primary ring-offset-4 ring-offset-transparent rounded-[40px]' : ''}`}
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-20px)'
              }}
              onMouseDown={(e) => handleMouseDown(e, 2)}
            >
              <DeviceFrame 
                model={layout === 'mixed' ? 'ipad-pro-13' : secondModel} 
                color={deviceColor} 
                image={secondImage} 
                fitMode={fitMode}
                scale={scale}
                position={position2}
                hasShadow={hasShadow}
                rotateX={rotateX}
                rotateY={rotateY - 15}
                isLandscape={layout === 'mixed' ? false : isLandscape}
                enableAnimation={enableAnimation}
              />
            </div>
          )}
        </div>

        {/* 水印 */}
        {watermark.visible && (
          <div 
            className="absolute bottom-6 right-6 font-bold text-xl select-none pointer-events-none"
            style={{ 
              color: isDark ? `rgba(255,255,255,${watermark.opacity})` : `rgba(0,0,0,${watermark.opacity})`
            }}
          >
            {watermark.text}
          </div>
        )}
      </div>

      {/* 状态提示 */}
      <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-xs font-medium z-20">
        {moveMode && isDragging ? `拖拽设备 ${activeDevice}` : moveMode ? `移动模式 · 设备 ${activeDevice}` : isEditingText ? '编辑文字' : `${Math.round(previewZoom * 100)}%`}
      </div>

      {/* 移动模式按钮 */}
      <button
        onClick={() => setMoveMode(!moveMode)}
        className={`absolute top-4 left-4 glass px-4 py-2 rounded-lg text-sm font-medium z-20 transition-all flex items-center gap-2 ${
          moveMode 
            ? 'bg-primary text-primary-foreground border-primary' 
            : 'hover:bg-accent'
        }`}
      >
        {moveMode ? <Move size={14} /> : <Lock size={14} />}
        {moveMode ? '移动模式' : '锁定'}
      </button>

      {/* 快捷键提示 */}
      <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-lg text-xs z-20 text-muted-foreground">
        <span className="opacity-70">Ctrl+滚轮</span> 缩放 · 
        <span className="font-mono"> Ctrl+Z/Y</span> 撤销 ·
        <span className="font-mono"> Ctrl+E</span> 导出
      </div>
    </div>
  );
});

PreviewArea.displayName = 'PreviewArea';

export default PreviewArea;
