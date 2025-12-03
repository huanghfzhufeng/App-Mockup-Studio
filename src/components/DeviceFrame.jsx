import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Smartphone, Tablet } from 'lucide-react';
import { DEVICE_MODELS } from '../config/constants';

// 判断颜色是否为深色
function isFrameDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// 按键位置配置（相对于设备高度的比例）
const BUTTON_CONFIG = {
  iphone: {
    portrait: {
      mute: { top: 0.145, height: 0.04 },
      volumeUp: { top: 0.21, height: 0.065 },
      volumeDown: { top: 0.29, height: 0.065 },
      power: { top: 0.217, height: 0.1 },
    },
    landscape: {
      mute: { left: 0.145, width: 0.04 },
      volumeUp: { left: 0.21, width: 0.065 },
      power: { left: 0.217, width: 0.1 },
    },
  },
  ipad: {
    power: { right: 0.21, width: 0.145 },
    volume: { top: 0.12, height: 0.07 },
  },
};

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
    <div
      className={`absolute ${roundedClass}`}
      style={{
        background: `linear-gradient(${gradientDir}, ${buttonHighlight}, ${buttonColor})`,
        boxShadow: shadowDir,
        transform: 'translateZ(3px)',
        ...position,
        ...(isHorizontal ? { width: '3px', height: size } : { height: '3px', width: size }),
      }}
    />
  );
}

DeviceButton.propTypes = {
  position: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['left', 'right', 'top', 'bottom']).isRequired,
  buttonColor: PropTypes.string.isRequired,
  buttonHighlight: PropTypes.string.isRequired,
};


const DeviceFrame = memo(function DeviceFrame({
  model,
  color,
  image,
  fitMode = 'cover',
  position = { x: 0, y: 0 },
  scale = 1,
  hasShadow = true,
  rotateX = 0,
  rotateY = 0,
  isLandscape = false,
  enableAnimation = false,
}) {
  const config = DEVICE_MODELS[model];

  const computed = useMemo(() => {
    const hex = config?.frameColor?.[color] || Object.values(config?.frameColor || {})[0] || '#000000';
    const tablet = model.includes('ipad');
    const darkFrame = isFrameDark(hex);
    const baseWidth = tablet ? 380 : 320;
    const deviceHeight = baseWidth / config.ratio;

    return {
      frameHex: hex,
      isTablet: tablet,
      isDarkFrame: darkFrame,
      baseWidth,
      deviceHeight,
      finalWidth: isLandscape ? deviceHeight : baseWidth,
      finalHeight: isLandscape ? baseWidth : deviceHeight,
      buttonColor: darkFrame ? 'rgba(80,80,80,0.9)' : 'rgba(160,160,160,0.9)',
      buttonHighlight: darkFrame ? 'rgba(100,100,100,0.5)' : 'rgba(200,200,200,0.5)',
    };
  }, [model, color, config, isLandscape]);

  const { frameHex, isTablet, isDarkFrame, finalWidth, finalHeight, buttonColor, buttonHighlight, deviceHeight, baseWidth } = computed;

  // 计算按键位置（基于设备尺寸的相对比例）
  const buttons = useMemo(() => {
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
  }, [isTablet, isLandscape, finalWidth, finalHeight, deviceHeight, baseWidth]);

  if (!config) return <div className="text-red-500">未知设备型号: {model}</div>;

  return (
    <div
      className={`relative select-none transition-all duration-500 ${enableAnimation ? 'animate-float' : ''}`}
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
      }}
    >
      {/* 金属边框质感 */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(255,255,255,${isDarkFrame ? 0.1 : 0.3}) 0%, transparent 3%, transparent 97%, rgba(0,0,0,${isDarkFrame ? 0.2 : 0.1}) 100%)`, transform: 'translateZ(0.1px)' }} />

      {/* 设备厚度 */}
      <div className="absolute inset-0 rounded-[inherit]" style={{ transform: 'translateZ(-10px)', backgroundColor: frameHex, filter: 'brightness(0.65)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)' }} />

      {/* 中框金属质感 */}
      <div className="absolute inset-[1px] rounded-[inherit] pointer-events-none" style={{ background: `linear-gradient(${90 + rotateY}deg, rgba(255,255,255,${isDarkFrame ? 0.05 : 0.15}) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)`, transform: 'translateZ(0.2px)' }} />

      {/* 物理按键 */}
      {Object.entries(buttons).map(([key, btn]) => (
        <DeviceButton key={key} position={btn.position} size={btn.size} direction={btn.direction} buttonColor={buttonColor} buttonHighlight={buttonHighlight} />
      ))}

      {/* 屏幕区域 */}
      <div className="absolute overflow-hidden transition-all duration-300" style={{ top: `${config.bezelWidth}px`, left: `${config.bezelWidth}px`, right: `${config.bezelWidth}px`, bottom: `${config.bezelWidth}px`, borderRadius: `${config.screenRadius}px`, transform: 'translateZ(1px)', backgroundColor: '#000', boxShadow: 'inset 0 0 3px rgba(0,0,0,0.8)' }}>
        {image ? (
          <div className="w-full h-full relative overflow-hidden">
            <img src={image} alt="Screen" className="absolute w-full h-full transition-transform duration-200" style={{ objectFit: fitMode, transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)` }} />
          </div>
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
          <div className="bg-black rounded-full flex items-center justify-between px-3 relative overflow-hidden" style={{ width: `${config.islandWidth}px`, height: '32px', boxShadow: '0 0 0 1px rgba(50,50,50,0.5), inset 0 1px 2px rgba(0,0,0,0.5)' }}>
            <div className="w-[10px] h-[10px] rounded-full bg-[#0a0a0a] relative ml-auto mr-2">
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0a0a15]" />
            </div>
          </div>
        </div>
      )}
      {config.islandType === 'dynamic-island' && isLandscape && (
        <div className="absolute left-[18px] top-1/2 z-30 pointer-events-none" style={{ transform: 'translateY(-50%) translateZ(2px)' }}>
          <div className="bg-black rounded-full relative overflow-hidden" style={{ width: '32px', height: `${config.islandWidth}px`, boxShadow: '0 0 0 1px rgba(50,50,50,0.5), inset 0 1px 2px rgba(0,0,0,0.5)' }} />
        </div>
      )}
      {config.islandType === 'punch-hole' && (
        <div className={`absolute z-30 pointer-events-none ${isLandscape ? 'left-[14px] top-1/2' : 'top-[14px] left-1/2'}`} style={{ transform: isLandscape ? 'translateY(-50%) translateZ(2px)' : 'translateX(-50%) translateZ(2px)' }}>
          <div className="w-[14px] h-[14px] rounded-full bg-[#0a0a0a] relative" style={{ boxShadow: '0 0 0 1px rgba(30,30,30,0.8), inset 0 1px 2px rgba(0,0,0,0.8)' }}>
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#050510]" />
          </div>
        </div>
      )}

      {/* 边框高光 */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden" style={{ background: `linear-gradient(${170 + rotateY}deg, rgba(255,255,255,${isDarkFrame ? 0.15 : 0.35}) 0%, rgba(255,255,255,${isDarkFrame ? 0.05 : 0.1}) 20%, transparent 40%, transparent 60%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,${isDarkFrame ? 0.15 : 0.1}) 100%)`, transform: 'translateZ(0.5px)' }} />
      <div className="absolute inset-[0.5px] rounded-[inherit] pointer-events-none" style={{ border: `0.5px solid rgba(255,255,255,${isDarkFrame ? 0.1 : 0.25})`, borderBottomColor: 'transparent', borderRightColor: `rgba(255,255,255,${isDarkFrame ? 0.05 : 0.1})`, transform: 'translateZ(0.3px)' }} />
    </div>
  );
});

DeviceFrame.propTypes = {
  model: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  image: PropTypes.string,
  fitMode: PropTypes.oneOf(['cover', 'contain']),
  position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  scale: PropTypes.number,
  hasShadow: PropTypes.bool,
  rotateX: PropTypes.number,
  rotateY: PropTypes.number,
  isLandscape: PropTypes.bool,
  enableAnimation: PropTypes.bool,
};

export default DeviceFrame;
