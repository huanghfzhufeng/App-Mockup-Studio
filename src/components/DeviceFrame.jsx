import { Smartphone, Tablet } from 'lucide-react';
import { DEVICE_MODELS } from '../config/constants';

export default function DeviceFrame({ model, color, image, fitMode, position, scale, hasShadow, rotateX = 0, rotateY = 0 }) {
  const config = DEVICE_MODELS[model];
  const frameHex = config.frameColor[color] || Object.values(config.frameColor)[0];
  const isTablet = model.includes('ipad');

  // 根据设备类型调整尺寸
  const baseWidth = isTablet ? 380 : 320;
  const deviceHeight = baseWidth / config.ratio;

  return (
    <div 
      className="relative select-none transition-all duration-300"
      style={{
        width: `${baseWidth}px`, 
        height: `${deviceHeight}px`,
        borderRadius: `${config.cornerRadius}px`,
        backgroundColor: frameHex,
        boxShadow: hasShadow 
          ? `inset 0 0 4px 2px rgba(255,255,255,0.3), inset 0 0 0 1px rgba(0,0,0,0.1), 0 ${25 + rotateX}px ${50 + Math.abs(rotateY)}px -12px rgba(0, 0, 0, 0.5)`
          : 'inset 0 0 4px 2px rgba(255,255,255,0.3), inset 0 0 0 1px rgba(0,0,0,0.1)',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 设备厚度 - 3D 侧边效果 */}
      <div 
        className="absolute inset-0 rounded-[inherit]"
        style={{
          transform: 'translateZ(-8px)',
          backgroundColor: frameHex,
          filter: 'brightness(0.7)',
        }}
      />
      
      {/* 物理按键 - 仅手机显示 */}
      {!isTablet && (
        <>
          <div className="absolute -left-[3px] top-[100px] w-[3px] h-[30px] rounded-l bg-gray-400 opacity-80" style={{ transform: 'translateZ(2px)' }}></div>
          <div className="absolute -left-[3px] top-[150px] w-[3px] h-[50px] rounded-l bg-gray-400 opacity-80" style={{ transform: 'translateZ(2px)' }}></div>
          <div className="absolute -left-[3px] top-[210px] w-[3px] h-[50px] rounded-l bg-gray-400 opacity-80" style={{ transform: 'translateZ(2px)' }}></div>
          <div className="absolute -right-[3px] top-[150px] w-[3px] h-[80px] rounded-r bg-gray-400 opacity-80" style={{ transform: 'translateZ(2px)' }}></div>
        </>
      )}

      {/* iPad 按键 */}
      {isTablet && (
        <>
          <div className="absolute -top-[3px] right-[80px] h-[3px] w-[60px] rounded-t bg-gray-400 opacity-80" style={{ transform: 'translateZ(2px)' }}></div>
          <div className="absolute -right-[3px] top-[60px] w-[3px] h-[40px] rounded-r bg-gray-400 opacity-80" style={{ transform: 'translateZ(2px)' }}></div>
        </>
      )}

      {/* 屏幕区域 */}
      <div 
        className="absolute overflow-hidden bg-black"
        style={{
          top: `${config.bezelWidth}px`,
          left: `${config.bezelWidth}px`,
          right: `${config.bezelWidth}px`,
          bottom: `${config.bezelWidth}px`,
          borderRadius: `${config.screenRadius}px`,
          transform: 'translateZ(1px)',
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
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-gray-900">
            {isTablet ? <Tablet size={48} className="mb-2 opacity-50" /> : <Smartphone size={48} className="mb-2 opacity-50" />}
            <span className="text-xs font-medium opacity-50">Upload Image</span>
          </div>
        )}

        {/* 屏幕高光反射 */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `linear-gradient(${135 + rotateY}deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)`,
          }}
        ></div>
      </div>

      {/* 灵动岛 / 挖孔 */}
      {config.islandType === 'dynamic-island' && (
        <div className="absolute top-[20px] left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ transform: 'translateX(-50%) translateZ(2px)' }}>
          <div 
            className="bg-black rounded-full flex items-center justify-center"
            style={{ width: `${config.islandWidth}px`, height: '28px' }}
          >
            <div className="w-2 h-2 rounded-full bg-[#1a1a1a] ml-16 relative">
              <div className="absolute top-[2px] right-[2px] w-[2px] h-[2px] bg-blue-900 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      )}

      {config.islandType === 'punch-hole' && (
        <div 
          className="absolute top-[16px] left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          style={{ transform: 'translateX(-50%) translateZ(2px)' }}
        >
          <div className="w-3 h-3 rounded-full bg-black border border-gray-800"></div>
        </div>
      )}

      {/* 边框高光 */}
      <div 
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: `linear-gradient(${145 + rotateY}deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`,
          transform: 'translateZ(0.5px)',
        }}
      />
    </div>
  );
}
