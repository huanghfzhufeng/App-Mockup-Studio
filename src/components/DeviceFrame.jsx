import { memo, useMemo } from 'react';
import { Smartphone, Tablet } from 'lucide-react';
import { DEVICE_MODELS } from '../config/constants';

// 判断颜色是否为深色（移到组件外部避免重复创建）
function isFrameDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

const DeviceFrame = memo(function DeviceFrame({ 
  model, 
  color, 
  image, 
  fitMode, 
  position, 
  scale, 
  hasShadow, 
  rotateX = 0, 
  rotateY = 0,
  isLandscape = false,
  enableAnimation = false
}) {
  const config = DEVICE_MODELS[model];
  
  // 使用 useMemo 缓存计算结果
  const { frameHex, isTablet, isDarkFrame, finalWidth, finalHeight, buttonColor, buttonHighlight } = useMemo(() => {
    const hex = config.frameColor[color] || Object.values(config.frameColor)[0];
    const tablet = model.includes('ipad');
    const darkFrame = isFrameDark(hex);
    const baseWidth = tablet ? 380 : 320;
    const deviceHeight = baseWidth / config.ratio;
    
    return {
      frameHex: hex,
      isTablet: tablet,
      isDarkFrame: darkFrame,
      finalWidth: isLandscape ? deviceHeight : baseWidth,
      finalHeight: isLandscape ? baseWidth : deviceHeight,
      buttonColor: darkFrame ? 'rgba(80,80,80,0.9)' : 'rgba(160,160,160,0.9)',
      buttonHighlight: darkFrame ? 'rgba(100,100,100,0.5)' : 'rgba(200,200,200,0.5)',
    };
  }, [model, color, config, isLandscape]);

  return (
    <div 
      className={`relative select-none transition-all duration-500 ${enableAnimation ? 'animate-float' : ''}`}
      style={{
        width: `${finalWidth}px`, 
        height: `${finalHeight}px`,
        borderRadius: `${config.cornerRadius}px`,
        backgroundColor: frameHex,
        boxShadow: hasShadow 
          ? `
            inset 0 1px 1px rgba(255,255,255,0.4),
            inset 0 -1px 1px rgba(0,0,0,0.2),
            0 ${25 + rotateX}px ${50 + Math.abs(rotateY)}px -12px rgba(0, 0, 0, 0.5),
            0 ${10 + rotateX * 0.5}px ${20 + Math.abs(rotateY) * 0.5}px -5px rgba(0, 0, 0, 0.3)
          `
          : `
            inset 0 1px 1px rgba(255,255,255,0.4),
            inset 0 -1px 1px rgba(0,0,0,0.2)
          `,
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 金属边框质感 - 外层 */}
      <div 
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, 
            rgba(255,255,255,${isDarkFrame ? 0.1 : 0.3}) 0%, 
            transparent 3%, 
            transparent 97%, 
            rgba(0,0,0,${isDarkFrame ? 0.2 : 0.1}) 100%
          )`,
          transform: 'translateZ(0.1px)',
        }}
      />

      {/* 设备厚度 - 3D 侧边效果 */}
      <div 
        className="absolute inset-0 rounded-[inherit]"
        style={{
          transform: 'translateZ(-10px)',
          backgroundColor: frameHex,
          filter: 'brightness(0.65)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
        }}
      />

      {/* 中框金属质感 */}
      <div 
        className="absolute inset-[1px] rounded-[inherit] pointer-events-none"
        style={{
          background: `linear-gradient(${90 + rotateY}deg, 
            rgba(255,255,255,${isDarkFrame ? 0.05 : 0.15}) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0,0,0,0.1) 100%
          )`,
          transform: 'translateZ(0.2px)',
        }}
      />
      
      {/* 物理按键 - iPhone 竖屏 */}
      {!isTablet && !isLandscape && (
        <>
          {/* 静音键 */}
          <div 
            className="absolute -left-[2.5px] top-[100px] w-[3px] h-[28px] rounded-l-sm"
            style={{ 
              background: `linear-gradient(90deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset 1px 0 1px rgba(255,255,255,0.2), -1px 0 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
          {/* 音量+ */}
          <div 
            className="absolute -left-[2.5px] top-[145px] w-[3px] h-[45px] rounded-l-sm"
            style={{ 
              background: `linear-gradient(90deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset 1px 0 1px rgba(255,255,255,0.2), -1px 0 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
          {/* 音量- */}
          <div 
            className="absolute -left-[2.5px] top-[200px] w-[3px] h-[45px] rounded-l-sm"
            style={{ 
              background: `linear-gradient(90deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset 1px 0 1px rgba(255,255,255,0.2), -1px 0 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
          {/* 电源键 */}
          <div 
            className="absolute -right-[2.5px] top-[150px] w-[3px] h-[70px] rounded-r-sm"
            style={{ 
              background: `linear-gradient(270deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.2), 1px 0 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
        </>
      )}

      {/* 物理按键 - iPhone 横屏 */}
      {!isTablet && isLandscape && (
        <>
          <div 
            className="absolute -top-[2.5px] left-[100px] h-[3px] w-[28px] rounded-t-sm"
            style={{ 
              background: `linear-gradient(180deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 -1px 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
          <div 
            className="absolute -top-[2.5px] left-[145px] h-[3px] w-[45px] rounded-t-sm"
            style={{ 
              background: `linear-gradient(180deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 -1px 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
          <div 
            className="absolute -bottom-[2.5px] left-[150px] h-[3px] w-[70px] rounded-b-sm"
            style={{ 
              background: `linear-gradient(0deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset 0 -1px 1px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
        </>
      )}

      {/* iPad 按键 */}
      {isTablet && (
        <>
          <div 
            className="absolute -top-[2.5px] right-[80px] h-[3px] w-[55px] rounded-t-sm"
            style={{ 
              background: `linear-gradient(180deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 -1px 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
          <div 
            className="absolute -right-[2.5px] top-[60px] w-[3px] h-[35px] rounded-r-sm"
            style={{ 
              background: `linear-gradient(270deg, ${buttonHighlight}, ${buttonColor})`,
              boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.2), 1px 0 2px rgba(0,0,0,0.3)',
              transform: 'translateZ(3px)' 
            }}
          />
        </>
      )}

      {/* 屏幕区域 */}
      <div 
        className="absolute overflow-hidden transition-all duration-300"
        style={{
          top: `${config.bezelWidth}px`,
          left: `${config.bezelWidth}px`,
          right: `${config.bezelWidth}px`,
          bottom: `${config.bezelWidth}px`,
          borderRadius: `${config.screenRadius}px`,
          transform: 'translateZ(1px)',
          backgroundColor: '#000',
          boxShadow: 'inset 0 0 3px rgba(0,0,0,0.8)',
        }}
      >
        {image ? (
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src={image} 
              alt="Screen" 
              className="absolute w-full h-full transition-transform duration-200"
              style={{
                objectFit: fitMode,
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            {isTablet ? <Tablet size={48} className="mb-2 text-gray-700" /> : <Smartphone size={48} className="mb-2 text-gray-700" />}
            <span className="text-xs font-medium text-gray-600">拖拽或点击上传</span>
          </div>
        )}

        {/* 屏幕玻璃反光效果 */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `linear-gradient(${135 + rotateY}deg, 
              transparent 0%,
              transparent 35%,
              rgba(255,255,255,0.08) 45%,
              rgba(255,255,255,0.12) 50%,
              rgba(255,255,255,0.08) 55%,
              transparent 65%,
              transparent 100%
            )`,
          }}
        />

        {/* 屏幕边缘暗角 */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.15)',
            borderRadius: 'inherit',
          }}
        />
      </div>

      {/* 灵动岛 - 竖屏 */}
      {config.islandType === 'dynamic-island' && !isLandscape && (
        <div 
          className="absolute top-[18px] left-1/2 z-30 pointer-events-none" 
          style={{ transform: 'translateX(-50%) translateZ(2px)' }}
        >
          <div 
            className="bg-black rounded-full flex items-center justify-between px-3 relative overflow-hidden"
            style={{ 
              width: `${config.islandWidth}px`, 
              height: '32px',
              boxShadow: '0 0 0 1px rgba(50,50,50,0.5), inset 0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {/* 前置摄像头 */}
            <div className="w-[10px] h-[10px] rounded-full bg-[#0a0a0a] relative ml-auto mr-2">
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0a0a15]" />
              <div className="absolute top-[2px] right-[2px] w-[3px] h-[3px] bg-[#1e3a5f] rounded-full opacity-80" />
              <div className="absolute bottom-[2px] left-[2px] w-[2px] h-[2px] bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* 灵动岛 - 横屏 */}
      {config.islandType === 'dynamic-island' && isLandscape && (
        <div 
          className="absolute left-[18px] top-1/2 z-30 pointer-events-none" 
          style={{ transform: 'translateY(-50%) translateZ(2px)' }}
        >
          <div 
            className="bg-black rounded-full relative overflow-hidden"
            style={{ 
              width: '32px', 
              height: `${config.islandWidth}px`,
              boxShadow: '0 0 0 1px rgba(50,50,50,0.5), inset 0 1px 2px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}

      {/* 挖孔摄像头 (Android) */}
      {config.islandType === 'punch-hole' && (
        <div 
          className={`absolute z-30 pointer-events-none ${isLandscape ? 'left-[14px] top-1/2' : 'top-[14px] left-1/2'}`}
          style={{ transform: isLandscape ? 'translateY(-50%) translateZ(2px)' : 'translateX(-50%) translateZ(2px)' }}
        >
          <div 
            className="w-[14px] h-[14px] rounded-full bg-[#0a0a0a] relative"
            style={{ boxShadow: '0 0 0 1px rgba(30,30,30,0.8), inset 0 1px 2px rgba(0,0,0,0.8)' }}
          >
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#050510]" />
            <div className="absolute top-[3px] right-[3px] w-[2px] h-[2px] bg-[#1e3a5f] rounded-full opacity-70" />
          </div>
        </div>
      )}

      {/* 边框高光 - 顶部 */}
      <div 
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
        style={{
          background: `linear-gradient(${170 + rotateY}deg, 
            rgba(255,255,255,${isDarkFrame ? 0.15 : 0.35}) 0%, 
            rgba(255,255,255,${isDarkFrame ? 0.05 : 0.1}) 20%,
            transparent 40%,
            transparent 60%,
            rgba(0,0,0,0.1) 80%,
            rgba(0,0,0,${isDarkFrame ? 0.15 : 0.1}) 100%
          )`,
          transform: 'translateZ(0.5px)',
        }}
      />

      {/* 边框内侧高光线 */}
      <div 
        className="absolute inset-[0.5px] rounded-[inherit] pointer-events-none"
        style={{
          border: `0.5px solid rgba(255,255,255,${isDarkFrame ? 0.1 : 0.25})`,
          borderBottomColor: 'transparent',
          borderRightColor: `rgba(255,255,255,${isDarkFrame ? 0.05 : 0.1})`,
          transform: 'translateZ(0.3px)',
        }}
      />
    </div>
  );
});

export default DeviceFrame;
