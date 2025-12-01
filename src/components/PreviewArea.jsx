import { forwardRef } from 'react';
import DeviceFrame from './DeviceFrame';

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
  hasShadow,
  rotateX,
  rotateY,
  perspective
}, ref) => {
  
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

  // 双展示模式下，第二张图默认用第一张
  const secondImage = screenshot2 || screenshot;

  return (
    <div className="flex-1 bg-[#e5e5e5] relative overflow-hidden flex items-center justify-center p-4 md:p-10">
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
        className="relative shadow-2xl transition-all duration-500 overflow-hidden group"
        style={{
          ...getBackgroundStyle(),
          width: 'auto',
          minWidth: layout === 'double' ? '900px' : '600px',
          minHeight: '900px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px',
          perspective: `${perspective}px`,
        }}
      >
        {/* 磨砂玻璃特效层 */}
        {background.type === 'custom-glass' && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 z-0"></div>
            <div className="absolute inset-4 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 z-0 shadow-lg"></div>
          </>
        )}

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

      {/* 顶部工具栏 */}
      <div className="absolute top-6 right-6 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono text-gray-500 shadow-sm border border-white/50 z-20">
        Preview Area
      </div>
    </div>
  );
});

PreviewArea.displayName = 'PreviewArea';

export default PreviewArea;
