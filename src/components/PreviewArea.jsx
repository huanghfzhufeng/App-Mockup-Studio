import { forwardRef, useState, useRef } from 'react';
import DeviceFrame from './DeviceFrame';
import TextAnnotation from './TextAnnotation';

const PreviewArea = forwardRef(({
  background,
  customBgColor,
  layout,
  model,
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
  exportRatio
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const getBackgroundStyle = () => {
    if (background.type === 'custom-glass') {
      return { background: '#e5e7eb' };
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
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x) / scale;
    const dy = (e.clientY - dragStart.current.y) / scale;
    setPosition({
      x: posStart.current.x + dx,
      y: posStart.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const secondImage = screenshot2 || screenshot;

  // 计算画布尺寸
  const getCanvasStyle = () => {
    const baseWidth = layout === 'double' ? 900 : 600;
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
      className="flex-1 bg-[#e5e5e5] relative overflow-hidden flex items-center justify-center p-4 md:p-10"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 棋盘格背景 */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>

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
          className={`relative z-10 flex ${layout === 'double' ? 'gap-16' : ''} items-center justify-center`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className="transition-transform duration-500"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: layout === 'double' ? 'translateZ(20px)' : 'none'
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
              rotateY={layout === 'double' ? rotateY + 15 : rotateY}
            />
          </div>
          
          {layout === 'double' && (
            <div 
              className="transition-transform duration-500"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-20px)'
              }}
            >
              <DeviceFrame 
                model={model} 
                color={deviceColor} 
                image={secondImage} 
                fitMode={fitMode}
                scale={scale}
                position={position}
                hasShadow={hasShadow}
                rotateX={rotateX}
                rotateY={rotateY - 15}
              />
            </div>
          )}
        </div>

        {/* 水印 */}
        <div className="absolute bottom-6 right-6 text-black/10 font-bold text-xl select-none pointer-events-none">
          MOCKUP
        </div>
      </div>

      {/* 顶部提示 */}
      <div className="absolute top-6 right-6 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono text-gray-500 shadow-sm border border-white/50 z-20">
        {isDragging ? '拖拽中...' : isEditingText ? '编辑文字中' : '拖拽调整图片位置'}
      </div>

      {/* 快捷键提示 */}
      <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-gray-500 shadow-sm border border-white/50 z-20">
        <span className="opacity-70">快捷键: </span>
        <span className="font-mono">Ctrl+E</span> 导出 | 
        <span className="font-mono"> ←→↑↓</span> 调整角度
      </div>
    </div>
  );
});

PreviewArea.displayName = 'PreviewArea';

export default PreviewArea;
