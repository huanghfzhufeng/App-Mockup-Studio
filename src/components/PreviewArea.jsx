import { forwardRef, useState, useRef } from 'react';
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
      return { background: isDark ? '#2a2a2a' : '#e5e7eb' };
    }
    if (background.id === 'custom') {
      return { backgroundColor: customBgColor };
    }
    if (background.type === 'image') {
      return { backgroundImage: background.value, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: background.value };
  };

  // 拖拽图片位置
  const handleMouseDown = (e) => {
    if (isEditingText) return;
    // 阻止默认行为，防止选中文字
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    // 考虑预览缩放和图片缩放
    const effectiveScale = scale * previewZoom;
    const dx = (e.clientX - dragStart.current.x) / effectiveScale;
    const dy = (e.clientY - dragStart.current.y) / effectiveScale;
    setPosition({
      x: Math.round(posStart.current.x + dx),
      y: Math.round(posStart.current.y + dy),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 滚轮缩放预览
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setPreviewZoom(prev => Math.max(0.3, Math.min(2, prev + delta)));
    }
  };

  // 拖拽上传
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

  // 计算画布尺寸
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
      className={`flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-10 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-[#e5e5e5]'}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 棋盘格背景 */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>

      {/* 拖拽上传提示 */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-blue-500/20 border-4 border-dashed border-blue-500 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-lg">
            <p className="text-lg font-medium text-blue-600">释放以上传图片</p>
          </div>
        </div>
      )}

      {/* 实际导出画布 */}
      <div 
        ref={ref}
        className={`relative shadow-2xl transition-all duration-500 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 z-0"></div>
            <div className="absolute inset-4 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 z-0 shadow-lg"></div>
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
            className="transition-transform duration-500"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: layout !== 'single' ? 'translateZ(20px)' : 'none'
            }}
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
              className="transition-transform duration-500"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-20px)'
              }}
            >
              <DeviceFrame 
                model={layout === 'mixed' ? 'ipad-pro-13' : secondModel} 
                color={deviceColor} 
                image={secondImage} 
                fitMode={fitMode}
                scale={scale}
                position={position}
                hasShadow={hasShadow}
                rotateX={rotateX}
                rotateY={rotateY - 15}
                isLandscape={layout === 'mixed' ? false : isLandscape}
                enableAnimation={enableAnimation}
              />
            </div>
          )}
        </div>

        {/* 自定义水印 */}
        {watermark.visible && (
          <div 
            className="absolute bottom-6 right-6 font-bold text-xl select-none pointer-events-none"
            style={{ 
              color: isDark ? 'rgba(255,255,255,' + watermark.opacity + ')' : 'rgba(0,0,0,' + watermark.opacity + ')'
            }}
          >
            {watermark.text}
          </div>
        )}
      </div>

      {/* 顶部提示 */}
      <div className={`absolute top-6 right-6 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono shadow-sm border z-20 ${isDark ? 'bg-gray-800/80 text-gray-300 border-gray-700' : 'bg-white/80 text-gray-500 border-white/50'}`}>
        {isDragging ? '拖拽中...' : isEditingText ? '编辑文字' : `缩放: ${Math.round(previewZoom * 100)}%`}
      </div>

      {/* 快捷键提示 */}
      <div className={`absolute bottom-6 left-6 backdrop-blur px-3 py-1.5 rounded-lg text-xs shadow-sm border z-20 ${isDark ? 'bg-gray-800/80 text-gray-400 border-gray-700' : 'bg-white/80 text-gray-500 border-white/50'}`}>
        <span className="opacity-70">Ctrl+滚轮</span> 缩放 | 
        <span className="font-mono"> Ctrl+Z/Y</span> 撤销/重做 |
        <span className="font-mono"> Ctrl+E</span> 导出
      </div>
    </div>
  );
});

PreviewArea.displayName = 'PreviewArea';

export default PreviewArea;
