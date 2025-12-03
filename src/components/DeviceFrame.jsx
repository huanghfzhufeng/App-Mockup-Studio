import { memo, useMemo } from 'react';
import { Smartphone, Tablet, Monitor, Globe } from 'lucide-react';
import { DEVICE_MODELS } from '../config/constants';

// 判断颜色是否为深色
function isFrameDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

// 按键组件
function DeviceButton({ position, size, direction, buttonColor, buttonHighlight }) {
  const isHorizontal = direction === 'left' || direction === 'right';
  const gradientDir = direction === 'left' ? '90deg' : direction === 'right' ? '270deg' : direction === 'top' ? '180deg' : '0deg';
  const shadowDir = direction === 'left'
    ? 'inset 1px 0 1px rgba(255,255,255,0.2), -1px 0 2px rgba(0,0,0,0.3)'
    : direction === 'right'
    ? 'inset -1px 0 1px rgba(255,255,255,0.2), 1px 0 2px rgba(0,0,0,0.3)'
    : direction === 'top'
    ? 'inset 0 1px 1px rgba(255,255,255,0.2), 0 -1px 2px rgba(0,0,0,0.3)'
    : 'inset 0 -1px 1px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.3)';
  const roundedClass = direction === 'left' ? 'rounded-l-sm' : direction === 'right' ? 'rounded-r-sm' : direction === 'top' ? 'rounded-t-sm' : 'rounded-b-sm';

  return (
    <div className={`absolute ${roundedClass}`} style={{
      background: `linear-gradient(${gradientDir}, ${buttonHighlight}, ${buttonColor})`,
      boxShadow: shadowDir,
      transform: 'translateZ(3px)',
      ...position,
      ...(isHorizontal ? { width: '3px', height: size } : { height: '3px', width: size }),
    }} />
  );
}

// MacBook 组件 - 更真实的设计
function MacBookFrame({ config, frameHex, isDarkFrame, image, fitMode, scale, position, hasShadow, rotateX, rotateY, enableAnimation }) {
  const screenWidth = 560;
  const screenHeight = screenWidth / config.ratio;
  const bezelSize = 8;
  const bottomBezel = 24; // 底部边框更宽（放logo的地方）
  const lidThickness = 8;
  const baseHeight = 10;
  const hingeHeight = 6;

  // 颜色计算
  const darkerFrame = isDarkFrame ? '#0a0a0a' : '#b8b8b8';
  const lighterFrame = isDarkFrame ? '#3a3a3a' : '#e8e8e8';

  return (
    <div 
      className={`relative select-none transition-all duration-500 ${enableAnimation ? 'animate-float' : ''}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        perspective: '1200px',
      }}
    >
      {/* ===== 屏幕盖（上半部分）===== */}
      <div 
        className="relative"
        style={{
          width: `${screenWidth + bezelSize * 2}px`,
          height: `${screenHeight + bezelSize + bottomBezel}px`,
          background: `linear-gradient(180deg, ${lighterFrame} 0%, ${frameHex} 3%, ${frameHex} 97%, ${darkerFrame} 100%)`,
          borderRadius: '12px 12px 2px 2px',
          boxShadow: hasShadow 
            ? `
              inset 0 1px 0 rgba(255,255,255,${isDarkFrame ? 0.1 : 0.4}),
              inset 0 -1px 0 rgba(0,0,0,0.2),
              0 ${15 + rotateX}px ${35 + Math.abs(rotateY)}px -8px rgba(0,0,0,0.45)
            `
            : `inset 0 1px 0 rgba(255,255,255,${isDarkFrame ? 0.1 : 0.3})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 屏幕外框金属质感 */}
        <div 
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: `linear-gradient(${100 + rotateY}deg, rgba(255,255,255,${isDarkFrame ? 0.08 : 0.2}) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)`,
          }}
        />

        {/* 黑色屏幕边框（内部） */}
        <div 
          className="absolute bg-black"
          style={{
            top: `${bezelSize - 2}px`,
            left: `${bezelSize - 2}px`,
            right: `${bezelSize - 2}px`,
            bottom: `${bottomBezel - 2}px`,
            borderRadius: '6px',
            boxShadow: 'inset 0 0 0 2px #1a1a1a',
          }}
        >
          {/* 实际屏幕内容 */}
          <div 
            className="absolute overflow-hidden"
            style={{
              top: '2px',
              left: '2px',
              right: '2px',
              bottom: '2px',
              borderRadius: '4px',
              backgroundColor: '#000',
            }}
          >
            {image ? (
              <img 
                src={image} 
                alt="Screen" 
                className="w-full h-full"
                style={{ 
                  objectFit: fitMode, 
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)` 
                }} 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
                <Monitor size={40} className="mb-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-500">拖拽或点击上传</span>
              </div>
            )}
            
            {/* 屏幕玻璃反光 */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(${130 + rotateY}deg, 
                  transparent 0%, 
                  transparent 40%,
                  rgba(255,255,255,0.03) 45%,
                  rgba(255,255,255,0.06) 50%,
                  rgba(255,255,255,0.03) 55%,
                  transparent 60%,
                  transparent 100%
                )`,
              }}
            />
          </div>

          {/* Notch 刘海 */}
          {config.islandType === 'notch' && (
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{
                width: `${config.notchWidth}px`,
                height: '18px',
                background: '#000',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {/* 摄像头 */}
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-[#2a3a4a] to-[#1a1a25]" />
                <div className="absolute top-[1px] right-[1px] w-[1px] h-[1px] bg-[#3a5a7a] rounded-full" />
              </div>
              {/* 指示灯 */}
              <div className="absolute top-[7px] left-1/2 translate-x-[15px] w-[3px] h-[3px] rounded-full bg-[#0a0a0a]" />
            </div>
          )}
        </div>

        {/* 底部 Logo 区域 */}
        <div 
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
          style={{ height: `${bottomBezel}px` }}
        >
          {/* Apple Logo 或品牌标识 */}
          <div 
            className="text-[10px] font-medium tracking-wider"
            style={{ color: isDarkFrame ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)' }}
          >
            MacBook
          </div>
        </div>

        {/* 屏幕盖厚度（3D效果） */}
        <div 
          className="absolute left-0 right-0 -bottom-[1px]"
          style={{
            height: `${lidThickness}px`,
            background: `linear-gradient(180deg, ${frameHex} 0%, ${darkerFrame} 100%)`,
            borderRadius: '0 0 2px 2px',
            transform: 'translateZ(-2px)',
          }}
        />
      </div>

      {/* ===== 转轴部分 ===== */}
      <div 
        className="relative mx-auto"
        style={{
          width: `${screenWidth * 0.95}px`,
          height: `${hingeHeight}px`,
          background: `linear-gradient(180deg, ${darkerFrame} 0%, ${isDarkFrame ? '#1a1a1a' : '#a0a0a0'} 50%, ${darkerFrame} 100%)`,
          borderRadius: '0 0 2px 2px',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {/* 转轴高光 */}
        <div 
          className="absolute inset-x-0 top-0 h-[1px]"
          style={{ background: `rgba(255,255,255,${isDarkFrame ? 0.05 : 0.2})` }}
        />
      </div>

      {/* ===== 底座（键盘部分）===== */}
      <div 
        className="relative mx-auto"
        style={{
          width: `${screenWidth + bezelSize * 2 + 20}px`,
          height: `${baseHeight}px`,
          background: `linear-gradient(180deg, ${frameHex} 0%, ${darkerFrame} 100%)`,
          borderRadius: '0 0 8px 8px / 0 0 4px 4px',
          boxShadow: hasShadow 
            ? `0 ${4 + rotateX * 0.3}px ${12 + Math.abs(rotateY) * 0.3}px -2px rgba(0,0,0,0.3)`
            : 'none',
        }}
      >
        {/* 底座前缘凹槽（开盖用） */}
        <div 
          className="absolute top-[2px] left-1/2 -translate-x-1/2 w-16 h-[3px] rounded-full"
          style={{ 
            background: isDarkFrame ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)',
            boxShadow: `inset 0 1px 1px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,${isDarkFrame ? 0.05 : 0.2})`,
          }}
        />
        
        {/* 底座金属质感 */}
        <div 
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.1) 100%)`,
          }}
        />

        {/* 橡胶脚垫指示 */}
        <div className="absolute bottom-[1px] left-[15%] w-[8px] h-[2px] rounded-full bg-black/20" />
        <div className="absolute bottom-[1px] right-[15%] w-[8px] h-[2px] rounded-full bg-black/20" />
      </div>

      {/* 底部投影 */}
      {hasShadow && (
        <div 
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '-8px',
            width: '85%',
            height: '12px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
        />
      )}
    </div>
  );
}

// 浏览器窗口组件
function BrowserFrame({ config, frameHex, isDarkFrame, image, fitMode, scale, position, hasShadow, rotateX, rotateY, enableAnimation }) {
  const width = 600;
  const height = width / config.ratio;
  const toolbarHeight = config.browserStyle === 'minimal' ? 32 : 40;

  const renderToolbar = () => {
    switch (config.browserStyle) {
      case 'chrome':
        return (
          <div className="flex items-center h-full px-3 gap-2" style={{ backgroundColor: isDarkFrame ? '#202124' : '#dee1e6' }}>
            {/* 窗口按钮 */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            {/* 标签栏 */}
            <div className="flex-1 flex items-center ml-2">
              <div className="h-7 px-3 rounded-t-lg flex items-center gap-2" style={{ backgroundColor: isDarkFrame ? '#35363a' : '#fff' }}>
                <Globe size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500">New Tab</span>
              </div>
            </div>
          </div>
        );
      case 'safari':
        return (
          <div className="flex items-center h-full px-3" style={{ backgroundColor: isDarkFrame ? '#2d2d2d' : '#f5f5f7' }}>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-6 w-64 rounded-md flex items-center justify-center gap-2" style={{ backgroundColor: isDarkFrame ? '#1c1c1e' : '#e8e8e8' }}>
                <Globe size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400">example.com</span>
              </div>
            </div>
            <div className="w-16" />
          </div>
        );
      case 'arc':
        return (
          <div className="flex items-center h-full px-3" style={{ background: `linear-gradient(90deg, ${frameHex}, ${isDarkFrame ? '#4a3f6b' : '#e8e4f0'})` }}>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-6 px-4 rounded-full flex items-center gap-2 bg-white/20 backdrop-blur-sm">
                <span className="text-xs text-white/80">example.com</span>
              </div>
            </div>
          </div>
        );
      case 'minimal':
      default:
        return (
          <div className="flex items-center h-full px-3" style={{ backgroundColor: isDarkFrame ? '#1a1a1a' : '#f0f0f0' }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative select-none transition-all duration-500 ${enableAnimation ? 'animate-float' : ''}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${config.cornerRadius}px`,
        backgroundColor: frameHex,
        boxShadow: hasShadow ? `0 ${20 + rotateX}px ${50 + Math.abs(rotateY)}px -15px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.1)` : '0 0 0 1px rgba(0,0,0,0.1)',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}>
      {/* 工具栏 */}
      <div style={{ height: `${toolbarHeight}px` }}>
        {renderToolbar()}
      </div>

      {/* 内容区域 */}
      <div className="relative overflow-hidden" style={{ height: `calc(100% - ${toolbarHeight}px)`, backgroundColor: '#fff' }}>
        {image ? (
          <img src={image} alt="Screen" className="w-full h-full" style={{ objectFit: fitMode, transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)` }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white">
            <Globe size={48} className="mb-2 text-gray-300" />
            <span className="text-xs font-medium text-gray-400">拖拽或点击上传</span>
          </div>
        )}
      </div>
    </div>
  );
}


// 手机/平板组件
function PhoneFrame({ config, frameHex, isDarkFrame, isTablet, image, fitMode, scale, position, hasShadow, rotateX, rotateY, isLandscape, enableAnimation, finalWidth, finalHeight, buttons, buttonColor, buttonHighlight }) {
  return (
    <div className={`relative select-none transition-all duration-500 ${enableAnimation ? 'animate-float' : ''}`}
      style={{
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
        borderRadius: `${config.cornerRadius}px`,
        backgroundColor: frameHex,
        boxShadow: hasShadow
          ? `inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.2), 0 ${25 + rotateX}px ${50 + Math.abs(rotateY)}px -12px rgba(0,0,0,0.5), 0 ${10 + rotateX * 0.5}px ${20 + Math.abs(rotateY) * 0.5}px -5px rgba(0,0,0,0.3)`
          : 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.2)',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}>
      {/* 金属边框质感 */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(255,255,255,${isDarkFrame ? 0.1 : 0.3}) 0%, transparent 3%, transparent 97%, rgba(0,0,0,${isDarkFrame ? 0.2 : 0.1}) 100%)`, transform: 'translateZ(0.1px)' }} />
      <div className="absolute inset-0 rounded-[inherit]" style={{ transform: 'translateZ(-10px)', backgroundColor: frameHex, filter: 'brightness(0.65)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)' }} />
      <div className="absolute inset-[1px] rounded-[inherit] pointer-events-none" style={{ background: `linear-gradient(${90 + rotateY}deg, rgba(255,255,255,${isDarkFrame ? 0.05 : 0.15}) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)`, transform: 'translateZ(0.2px)' }} />

      {/* 物理按键 */}
      {buttons && Object.entries(buttons).map(([key, btn]) => (
        <DeviceButton key={key} position={btn.position} size={btn.size} direction={btn.direction} buttonColor={buttonColor} buttonHighlight={buttonHighlight} />
      ))}

      {/* 屏幕区域 */}
      <div className="absolute overflow-hidden transition-all duration-300" style={{ top: `${config.bezelWidth}px`, left: `${config.bezelWidth}px`, right: `${config.bezelWidth}px`, bottom: `${config.bezelWidth}px`, borderRadius: `${config.screenRadius}px`, transform: 'translateZ(1px)', backgroundColor: '#000', boxShadow: 'inset 0 0 3px rgba(0,0,0,0.8)' }}>
        {image ? (
          <img src={image} alt="Screen" className="w-full h-full" style={{ objectFit: fitMode, transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)` }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            {isTablet ? <Tablet size={48} className="mb-2 text-gray-700" /> : <Smartphone size={48} className="mb-2 text-gray-700" />}
            <span className="text-xs font-medium text-gray-600">拖拽或点击上传</span>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none z-20" style={{ background: `linear-gradient(${135 + rotateY}deg, transparent 0%, transparent 35%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent 65%, transparent 100%)` }} />
        <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.15)', borderRadius: 'inherit' }} />
      </div>

      {/* 灵动岛 */}
      {config.islandType === 'dynamic-island' && !isLandscape && (
        <div className="absolute top-[18px] left-1/2 z-30 pointer-events-none" style={{ transform: 'translateX(-50%) translateZ(2px)' }}>
          <div className="bg-black rounded-full flex items-center px-3" style={{ width: `${config.islandWidth}px`, height: '32px', boxShadow: '0 0 0 1px rgba(50,50,50,0.5)' }}>
            <div className="w-[10px] h-[10px] rounded-full bg-[#0a0a0a] ml-auto mr-2">
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0a0a15]" />
            </div>
          </div>
        </div>
      )}
      {config.islandType === 'dynamic-island' && isLandscape && (
        <div className="absolute left-[18px] top-1/2 z-30 pointer-events-none" style={{ transform: 'translateY(-50%) translateZ(2px)' }}>
          <div className="bg-black rounded-full" style={{ width: '32px', height: `${config.islandWidth}px`, boxShadow: '0 0 0 1px rgba(50,50,50,0.5)' }} />
        </div>
      )}
      {config.islandType === 'punch-hole' && (
        <div className={`absolute z-30 pointer-events-none ${isLandscape ? 'left-[14px] top-1/2' : 'top-[14px] left-1/2'}`} style={{ transform: isLandscape ? 'translateY(-50%) translateZ(2px)' : 'translateX(-50%) translateZ(2px)' }}>
          <div className="w-[14px] h-[14px] rounded-full bg-[#0a0a0a]" style={{ boxShadow: '0 0 0 1px rgba(30,30,30,0.8)' }}>
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#050510]" />
          </div>
        </div>
      )}

      {/* 边框高光 */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden" style={{ background: `linear-gradient(${170 + rotateY}deg, rgba(255,255,255,${isDarkFrame ? 0.15 : 0.35}) 0%, rgba(255,255,255,${isDarkFrame ? 0.05 : 0.1}) 20%, transparent 40%, transparent 60%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,${isDarkFrame ? 0.15 : 0.1}) 100%)`, transform: 'translateZ(0.5px)' }} />
      <div className="absolute inset-[0.5px] rounded-[inherit] pointer-events-none" style={{ border: `0.5px solid rgba(255,255,255,${isDarkFrame ? 0.1 : 0.25})`, borderBottomColor: 'transparent', borderRightColor: `rgba(255,255,255,${isDarkFrame ? 0.05 : 0.1})`, transform: 'translateZ(0.3px)' }} />
    </div>
  );
}

// 按键配置
const BUTTON_CONFIG = {
  iphone: {
    portrait: { mute: { top: 0.145, height: 0.04 }, volumeUp: { top: 0.21, height: 0.065 }, volumeDown: { top: 0.29, height: 0.065 }, power: { top: 0.217, height: 0.1 } },
    landscape: { mute: { left: 0.145, width: 0.04 }, volumeUp: { left: 0.21, width: 0.065 }, power: { left: 0.217, width: 0.1 } },
  },
  ipad: { power: { right: 0.21, width: 0.145 }, volume: { top: 0.12, height: 0.07 } },
};

// 主组件
const DeviceFrame = memo(function DeviceFrame({ model, color, image, fitMode = 'cover', position = { x: 0, y: 0 }, scale = 1, hasShadow = true, rotateX = 0, rotateY = 0, isLandscape = false, enableAnimation = false }) {
  const config = DEVICE_MODELS[model];
  
  const computed = useMemo(() => {
    if (!config) return null;
    const hex = config.frameColor?.[color] || Object.values(config.frameColor || {})[0] || '#000000';
    const darkFrame = isFrameDark(hex);
    const isTablet = model.includes('ipad');
    const baseWidth = config.deviceType === 'laptop' ? 580 : config.deviceType === 'browser' ? 600 : isTablet ? 380 : 320;
    const deviceHeight = baseWidth / config.ratio;

    return {
      frameHex: hex,
      isDarkFrame: darkFrame,
      isTablet,
      baseWidth,
      deviceHeight,
      finalWidth: isLandscape && !config.deviceType ? deviceHeight : baseWidth,
      finalHeight: isLandscape && !config.deviceType ? baseWidth : deviceHeight,
      buttonColor: darkFrame ? 'rgba(80,80,80,0.9)' : 'rgba(160,160,160,0.9)',
      buttonHighlight: darkFrame ? 'rgba(100,100,100,0.5)' : 'rgba(200,200,200,0.5)',
    };
  }, [model, color, config, isLandscape]);

  const buttons = useMemo(() => {
    if (!computed || config?.deviceType) return null;
    const { isTablet, finalWidth, finalHeight, deviceHeight, baseWidth } = computed;
    
    if (isTablet) {
      const cfg = BUTTON_CONFIG.ipad;
      return {
        power: { position: { top: '-2.5px', right: `${cfg.power.right * finalWidth}px` }, size: `${cfg.power.width * finalWidth}px`, direction: 'top' },
        volume: { position: { right: '-2.5px', top: `${cfg.volume.top * finalHeight}px` }, size: `${cfg.volume.height * finalHeight}px`, direction: 'right' },
      };
    }

    const height = isLandscape ? baseWidth : deviceHeight;
    const width = isLandscape ? deviceHeight : baseWidth;

    if (isLandscape) {
      const cfg = BUTTON_CONFIG.iphone.landscape;
      return {
        mute: { position: { top: '-2.5px', left: `${cfg.mute.left * width}px` }, size: `${cfg.mute.width * width}px`, direction: 'top' },
        volumeUp: { position: { top: '-2.5px', left: `${cfg.volumeUp.left * width}px` }, size: `${cfg.volumeUp.width * width}px`, direction: 'top' },
        power: { position: { bottom: '-2.5px', left: `${cfg.power.left * width}px` }, size: `${cfg.power.width * width}px`, direction: 'bottom' },
      };
    }

    const cfg = BUTTON_CONFIG.iphone.portrait;
    return {
      mute: { position: { left: '-2.5px', top: `${cfg.mute.top * height}px` }, size: `${cfg.mute.height * height}px`, direction: 'left' },
      volumeUp: { position: { left: '-2.5px', top: `${cfg.volumeUp.top * height}px` }, size: `${cfg.volumeUp.height * height}px`, direction: 'left' },
      volumeDown: { position: { left: '-2.5px', top: `${cfg.volumeDown.top * height}px` }, size: `${cfg.volumeDown.height * height}px`, direction: 'left' },
      power: { position: { right: '-2.5px', top: `${cfg.power.top * height}px` }, size: `${cfg.power.height * height}px`, direction: 'right' },
    };
  }, [computed, config, isLandscape]);

  if (!config || !computed) return <div className="text-red-500 p-4">未知设备型号: {model}</div>;

  const { frameHex, isDarkFrame, isTablet, finalWidth, finalHeight, buttonColor, buttonHighlight } = computed;
  const commonProps = { config, frameHex, isDarkFrame, image, fitMode, scale, position, hasShadow, rotateX, rotateY, enableAnimation };

  // 根据设备类型渲染不同组件
  if (config.deviceType === 'laptop') {
    return <MacBookFrame {...commonProps} />;
  }
  if (config.deviceType === 'browser') {
    return <BrowserFrame {...commonProps} />;
  }
  return <PhoneFrame {...commonProps} isTablet={isTablet} isLandscape={isLandscape} finalWidth={finalWidth} finalHeight={finalHeight} buttons={buttons} buttonColor={buttonColor} buttonHighlight={buttonHighlight} />;
});

export default DeviceFrame;
