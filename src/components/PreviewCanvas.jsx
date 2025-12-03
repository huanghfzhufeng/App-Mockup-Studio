import { forwardRef, memo, useMemo } from 'react';
import DeviceFrame from './DeviceFrame';
import TextAnnotation from './TextAnnotation';

/**
 * 纯渲染组件 - 只负责展示，不处理交互逻辑
 * 使用 memo 优化，避免不必要的重渲染
 */
const PreviewCanvas = memo(forwardRef(({
  // 背景
  background,
  customBgColor,
  customBgImage,
  isDark,
  
  // 布局
  layout,
  exportRatio,
  
  // 设备配置
  model,
  deviceColor,
  isLandscape,
  hasShadow,
  enableAnimation,
  
  // 3D 效果
  rotateX,
  rotateY,
  perspective,
  
  // 图片
  screenshot,
  screenshot2,
  fitMode,
  scale,
  position,
  position2,
  
  // 设备位置缩放
  devicePosition1,
  devicePosition2,
  deviceScale1,
  deviceScale2,
  
  // 文字标注
  annotation,
  setAnnotation,
  isEditingText,
  watermark,
  
  // 交互状态（用于样式）
  moveMode,
  activeDevice,
  isDragging,
  
  // 缩放
  previewZoom,
  
  // 事件处理（从父组件传入）
  onDeviceMouseDown,
  onDeviceWheel,
  onCanvasMouseDown,
}, ref) => {
  
  // 使用 useMemo 缓存背景样式
  const backgroundStyle = useMemo(() => {
    if (customBgImage) {
      return { backgroundImage: `url(${customBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (background.type === 'custom-glass') {
      return { background: isDark ? 'hsl(0 0% 12%)' : 'hsl(0 0% 96%)' };
    }
    if (background.id === 'custom') {
      return { backgroundColor: customBgColor };
    }
    if (background.type === 'image') {
      return { backgroundImage: background.value, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: background.value };
  }, [customBgImage, background, customBgColor, isDark]);

  // 使用 useMemo 缓存画布尺寸
  const canvasStyle = useMemo(() => {
    const baseWidth = layout === 'double' || layout === 'mixed' ? 900 : 600;
    
    if (exportRatio && exportRatio.ratio) {
      const height = baseWidth / exportRatio.ratio;
      return {
        minWidth: `${baseWidth}px`,
        minHeight: `${Math.max(height, 600)}px`,
      };
    }
    
    return {
      minWidth: `${baseWidth}px`,
      minHeight: '900px',
    };
  }, [layout, exportRatio]);

  const secondImage = screenshot2 || screenshot;

  return (
    <div 
      ref={ref}
      className={`relative shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl ${moveMode && isDragging ? 'cursor-grabbing' : moveMode ? 'cursor-grab' : 'cursor-default'}`}
      style={{
        ...backgroundStyle,
        ...canvasStyle,
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px',
        perspective: `${perspective}px`,
        transform: `scale(${previewZoom})`,
        transformOrigin: 'center center',
      }}
      onMouseDown={onCanvasMouseDown}
    >
      {/* 磨砂玻璃特效层 */}
      {background.type === 'custom-glass' && (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-400/10 to-gray-600/10 z-0" />
          <div className="absolute inset-6 rounded-3xl bg-white/30 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 z-0 shadow-xl" />
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
        {/* 设备 1 */}
        <div 
          className={`transition-all duration-200 ${moveMode ? 'cursor-move' : ''} ${moveMode && activeDevice === 1 ? 'ring-2 ring-foreground/50 ring-offset-4 ring-offset-transparent rounded-[44px]' : ''}`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `translateZ(${layout !== 'single' ? 20 : 0}px) translate(${devicePosition1?.x || 0}px, ${devicePosition1?.y || 0}px) scale(${deviceScale1 || 1})`
          }}
          onMouseDown={(e) => onDeviceMouseDown?.(e, 1)}
          onWheel={(e) => onDeviceWheel?.(e, 1)}
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
        
        {/* 设备 2 */}
        {(layout === 'double' || layout === 'mixed') && (
          <div 
            className={`transition-all duration-200 ${moveMode ? 'cursor-move' : ''} ${moveMode && activeDevice === 2 ? 'ring-2 ring-foreground/50 ring-offset-4 ring-offset-transparent rounded-[44px]' : ''}`}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `translateZ(-20px) translate(${devicePosition2?.x || 0}px, ${devicePosition2?.y || 0}px) scale(${deviceScale2 || 1})`
            }}
            onMouseDown={(e) => onDeviceMouseDown?.(e, 2)}
            onWheel={(e) => onDeviceWheel?.(e, 2)}
          >
            <DeviceFrame 
              model={layout === 'mixed' ? 'ipad-pro-13' : model} 
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
  );
}));

PreviewCanvas.displayName = 'PreviewCanvas';

export default PreviewCanvas;
