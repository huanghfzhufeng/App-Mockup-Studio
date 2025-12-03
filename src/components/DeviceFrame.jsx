import { memo, useMemo } from 'react';
import { Smartphone, Tablet, Monitor, Globe } from 'lucide-react';
import { DEVICE_MODELS } from '../config/constants';
import { useAppStore } from '../store/useAppStore';

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

// MacBook 组件 - 优化 3D 结构和转轴效果
function MacBookFrame({ config, frameHex, isDarkFrame, image, fitMode, scale, position, hasShadow, rotateX, rotateY, enableAnimation }) {
  const baseWidth = 580;
  const baseDepth = 380;
  const screenWidth = baseWidth;
  const screenHeight = (baseWidth - 20) / config.ratio + 20;
  const baseHeight = 14;
  const screenThickness = 6;
  const openAngle = 110;

  const darkerFrame = isDarkFrame ? '#111' : '#999';

  return (
    <div 
      className={`relative select-none transition-all duration-500 ${enableAnimation ? 'animate-float' : ''}`}
      style={{
        width: `${baseWidth}px`,
        height: `${baseDepth}px`,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${55 + rotateX}deg) rotateY(${rotateY}deg) rotateZ(0deg)`,
        perspective: '2000px',
      }}
    >
      {/* ==================== 键盘底座 (Base) ==================== */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {/* 1. 底座顶面 (C面) */}
        <div 
          className="absolute inset-0"
          style={{
            background: frameHex,
            borderRadius: '4px 4px 18px 18px',
            boxShadow: hasShadow ? `inset 0 1px 0 rgba(255,255,255,${isDarkFrame ? 0.1 : 0.4})` : 'none',
          }}
        >
          {/* 键盘区域 */}
          <div 
            className="absolute rounded-md overflow-hidden"
            style={{
              top: '25px',
              left: '30px',
              right: '30px',
              bottom: '125px',
              background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), inset 0 0 1px rgba(255,255,255,0.05)',
              padding: '8px 6px',
            }}
          >
            {/* Touch Bar / 功能键行 */}
            <div 
              className="flex items-center justify-between mb-2 rounded-sm overflow-hidden"
              style={{
                height: '18px',
                background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)',
                padding: '0 4px',
              }}
            >
              {/* ESC 键 */}
              <div 
                className="h-[12px] w-[28px] rounded-sm flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <span className="text-[5px] text-gray-400 font-medium">esc</span>
              </div>
              {/* Touch Bar 区域 */}
              <div 
                className="flex-1 mx-2 h-[14px] rounded-sm"
                style={{
                  background: 'linear-gradient(90deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
                }}
              />
              {/* 电源/Touch ID */}
              <div 
                className="h-[12px] w-[28px] rounded-sm flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, #1f1f1f 0%, #151515 100%)',
                  boxShadow: '0 1px 0 rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                <div className="w-[8px] h-[8px] rounded-full bg-[#0a0a0a] border border-[#333]" />
              </div>
            </div>
            
            {/* 主键盘区域 */}
            <div className="space-y-[3px]">
              {/* 数字行 */}
              <div className="flex gap-[3px]">
                {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'].map((key, i) => (
                  <div 
                    key={`num-${i}`}
                    className="h-[20px] rounded-[3px] flex items-center justify-center relative"
                    style={{
                      flex: i === 13 ? 1.6 : 1,
                      background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #252525 100%)',
                      boxShadow: '0 2px 0 #151515, 0 3px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-[7px] text-gray-300 font-medium">{key}</span>
                  </div>
                ))}
              </div>
              
              {/* QWERTY 行 */}
              <div className="flex gap-[3px]">
                {['⇥', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'].map((key, i) => (
                  <div 
                    key={`q-${i}`}
                    className="h-[20px] rounded-[3px] flex items-center justify-center"
                    style={{
                      flex: i === 0 ? 1.5 : i === 13 ? 1.5 : 1,
                      background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #252525 100%)',
                      boxShadow: '0 2px 0 #151515, 0 3px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-[7px] text-gray-300 font-medium">{key}</span>
                  </div>
                ))}
              </div>
              
              {/* ASDF 行 */}
              <div className="flex gap-[3px]">
                {['⇪', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", '↵'].map((key, i) => (
                  <div 
                    key={`a-${i}`}
                    className="h-[20px] rounded-[3px] flex items-center justify-center"
                    style={{
                      flex: i === 0 ? 1.8 : i === 12 ? 2.2 : 1,
                      background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #252525 100%)',
                      boxShadow: '0 2px 0 #151515, 0 3px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-[7px] text-gray-300 font-medium">{key}</span>
                  </div>
                ))}
              </div>
              
              {/* ZXCV 行 */}
              <div className="flex gap-[3px]">
                {['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '⇧'].map((key, i) => (
                  <div 
                    key={`z-${i}`}
                    className="h-[20px] rounded-[3px] flex items-center justify-center"
                    style={{
                      flex: i === 0 ? 2.3 : i === 11 ? 2.7 : 1,
                      background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #252525 100%)',
                      boxShadow: '0 2px 0 #151515, 0 3px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-[7px] text-gray-300 font-medium">{key}</span>
                  </div>
                ))}
              </div>
              
              {/* 空格行 */}
              <div className="flex gap-[3px]">
                {['fn', '⌃', '⌥', '⌘'].map((key, i) => (
                  <div 
                    key={`mod-${i}`}
                    className="h-[20px] rounded-[3px] flex items-center justify-center"
                    style={{
                      flex: i === 3 ? 1.3 : 1,
                      background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #252525 100%)',
                      boxShadow: '0 2px 0 #151515, 0 3px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-[6px] text-gray-400 font-medium">{key}</span>
                  </div>
                ))}
                {/* 空格键 */}
                <div 
                  className="h-[20px] rounded-[3px] flex-[5]"
                  style={{
                    background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #252525 100%)',
                    boxShadow: '0 2px 0 #151515, 0 3px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                />
                {['⌘', '⌥', '◀', '▲▼', '▶'].map((key, i) => (
                  <div 
                    key={`mod2-${i}`}
                    className="h-[20px] rounded-[3px] flex items-center justify-center"
                    style={{
                      flex: i === 0 || i === 1 ? 1.3 : 1,
                      background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 40%, #252525 100%)',
                      boxShadow: '0 2px 0 #151515, 0 3px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-[6px] text-gray-400 font-medium">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 触控板 */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 rounded-lg"
            style={{
              bottom: '18px',
              width: '240px',
              height: '95px',
              background: isDarkFrame 
                ? 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)'
                : 'linear-gradient(180deg, #d0d0d0 0%, #c0c0c0 100%)',
              boxShadow: `
                inset 0 0 0 0.5px rgba(${isDarkFrame ? '255,255,255,0.08' : '0,0,0,0.15'}),
                0 0.5px 0 rgba(255,255,255,${isDarkFrame ? 0.03 : 0.3})
              `,
              borderRadius: '8px',
            }}
          />

          {/* 扬声器格栅 */}
          <div className="absolute top-2 left-8 right-8 flex justify-between">
            <div 
              className="w-28 h-1.5 rounded-full"
              style={{
                background: isDarkFrame ? '#0a0a0a' : '#888',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
              }}
            />
            <div 
              className="w-28 h-1.5 rounded-full"
              style={{
                background: isDarkFrame ? '#0a0a0a' : '#888',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
              }}
            />
          </div>
        </div>

        {/* 2. 底座前侧面 (厚度) */}
        <div 
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: `${baseHeight}px`,
            background: `linear-gradient(180deg, ${frameHex} 0%, ${darkerFrame} 100%)`,
            transform: 'rotateX(-90deg)',
            transformOrigin: 'bottom',
            borderRadius: '0 0 12px 12px',
          }}
        />

        {/* 3. 底座左侧面 */}
        <div 
          className="absolute top-0 bottom-0 left-0"
          style={{
            width: `${baseHeight}px`,
            background: darkerFrame,
            transform: 'rotateY(-90deg)',
            transformOrigin: 'left',
          }}
        />

        {/* 4. 底座右侧面 */}
        <div 
          className="absolute top-0 bottom-0 right-0"
          style={{
            width: `${baseHeight}px`,
            background: darkerFrame,
            transform: 'rotateY(90deg)',
            transformOrigin: 'right',
          }}
        />
      </div>

      {/* ==================== 屏幕部分 (Screen) ==================== */}
      <div 
        className="absolute"
        style={{
          width: `${screenWidth}px`,
          height: `${screenHeight}px`,
          top: '-10px',
          left: '0',
          transformStyle: 'preserve-3d',
          transformOrigin: 'bottom center',
          transform: `translate3d(0, -${screenHeight - 10}px, 0) rotateX(${-180 + openAngle}deg)`,
        }}
      >
        {/* 1. 屏幕背面 (A面 - LOGO面) */}
        <div 
          className="absolute inset-0"
          style={{
            background: frameHex,
            borderRadius: '12px 12px 0 0',
            transform: `translateZ(-${screenThickness}px) rotateY(180deg)`,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Apple Logo 模拟 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-20 bg-black rounded-full blur-[1px]" />
        </div>

        {/* 2. 屏幕正面 (B面 - 显示屏) */}
        <div 
          className="absolute inset-0"
          style={{
            background: '#000',
            borderRadius: '12px 12px 0 0',
            transform: 'translateZ(0px)',
            border: `1px solid ${isDarkFrame ? '#333' : '#111'}`,
          }}
        >
          {/* 屏幕内屏 (显示区域) */}
          <div className="absolute left-[8px] right-[8px] top-[8px] bottom-[24px] bg-black overflow-hidden rounded-[4px]">
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
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2c1a3e] to-[#0f0f13]">
                <Monitor size={48} className="mb-2 text-white/20" />
              </div>
            )}

            {/* 屏幕反光/光泽层 */}
            <div 
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
              }}
            />
          </div>

          {/* 屏幕下方的 "MacBook" 字样区域 */}
          <div className="absolute bottom-0 left-0 right-0 h-[24px] flex items-center justify-center">
            <span className="text-[8px] font-medium tracking-widest text-[#555]">MacBook Pro</span>
          </div>

          {/* 摄像头/刘海 */}
          {config.islandType === 'notch' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[18px] bg-black rounded-b-md z-30">
              <div className="absolute top-1/2 right-4 -translate-y-1/2 w-1.5 h-1.5 bg-[#1a1a2e] rounded-full ring-1 ring-[#333]" />
            </div>
          )}
        </div>

        {/* 3. 屏幕侧面 (厚度封闭) */}
        {/* 上侧面 */}
        <div 
          className="absolute top-0 left-0 right-0"
          style={{
            height: `${screenThickness}px`,
            background: darkerFrame,
            transform: 'rotateX(90deg) translateZ(-3px)',
            transformOrigin: 'center',
          }}
        />

        {/* 左侧面 */}
        <div 
          className="absolute top-0 bottom-0 left-0"
          style={{
            width: `${screenThickness}px`,
            background: darkerFrame,
            transform: 'rotateY(-90deg) translateZ(3px)',
            transformOrigin: 'left',
          }}
        />

        {/* 右侧面 */}
        <div 
          className="absolute top-0 bottom-0 right-0"
          style={{
            width: `${screenThickness}px`,
            background: darkerFrame,
            transform: 'rotateY(90deg) translateZ(3px)',
            transformOrigin: 'right',
          }}
        />

        {/* 屏幕在底座上的投影 */}
        {hasShadow && (
          <div 
            className="absolute bottom-[-10px] left-0 right-0 h-[40px] pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
              transform: `rotateX(${180 - openAngle}deg) translateZ(2px)`,
              transformOrigin: 'top',
              filter: 'blur(8px)',
              opacity: 0.8,
            }}
          />
        )}
      </div>

      {/* 物理转轴 (Hinge Cylinder) */}
      <div 
        className="absolute left-0 right-0"
        style={{
          bottom: '0px',
          height: '16px',
          background: '#111',
          transform: 'translateZ(-2px) rotateX(90deg)',
          borderRadius: '8px',
          zIndex: -1,
        }}
      />

      {/* 底部悬浮阴影 */}
      {hasShadow && (
        <div 
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '-60px',
            width: '90%',
            height: '100px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
            transform: 'rotateX(90deg) translateZ(-50px)',
            filter: 'blur(20px)',
            zIndex: -10,
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
  // 获取自定义机型
  const customDevices = useAppStore((state) => state.customDevices);
  const allDevices = useMemo(() => ({ ...DEVICE_MODELS, ...customDevices }), [customDevices]);
  const config = allDevices[model];
  
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
