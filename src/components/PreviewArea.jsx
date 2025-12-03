import { forwardRef, useCallback } from 'react';
import { Move, Lock, ZoomIn } from 'lucide-react';
import PreviewCanvas from './PreviewCanvas';
import { useDrag, useFileDrop, usePreviewZoom } from '../hooks/useDrag';
import { useAppStore } from '../store/useAppStore';

/**
 * PreviewArea - 负责交互逻辑，渲染委托给 PreviewCanvas
 */
const PreviewArea = forwardRef(({ onImageDrop }, ref) => {
  // 从 store 获取状态
  const {
    // 背景
    background,
    customBgColor,
    customBgImage,
    isDark,
    
    // 布局
    layout,
    
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
    setPosition,
    setPosition2,
    
    // 设备位置缩放
    devicePosition1,
    devicePosition2,
    deviceScale1,
    deviceScale2,
    setDevicePosition1,
    setDevicePosition2,
    setDeviceScale1,
    setDeviceScale2,
    
    // 文字标注
    annotation,
    setAnnotation,
    isEditingText,
    watermark,
    
    // 交互状态
    moveMode,
    setMoveMode,
    activeDevice,
    setActiveDevice,
    
    // 导出
    exportRatio,
  } = useAppStore();

  // 预览缩放
  const { previewZoom, handleWheel: handleZoomWheel } = usePreviewZoom(1);

  // 设备拖拽回调
  const handleDeviceDrag = useCallback((deviceIndex, newPos) => {
    if (deviceIndex === 1) {
      setDevicePosition1(newPos);
    } else {
      setDevicePosition2(newPos);
    }
  }, [setDevicePosition1, setDevicePosition2]);

  // 图片拖拽回调
  const handleImageDrag = useCallback((deviceIndex, newPos) => {
    if (deviceIndex === 1) {
      setPosition(newPos);
    } else {
      setPosition2(newPos);
    }
  }, [setPosition, setPosition2]);

  // 设备缩放回调
  const handleDeviceScale = useCallback((deviceIndex, delta) => {
    if (deviceIndex === 1) {
      setDeviceScale1(Math.max(0.3, Math.min(2, deviceScale1 + delta)));
    } else {
      setDeviceScale2(Math.max(0.3, Math.min(2, deviceScale2 + delta)));
    }
  }, [deviceScale1, deviceScale2, setDeviceScale1, setDeviceScale2]);

  // 拖拽 hook
  const {
    isDragging,
    dragType,
    currentDevice,
    handleDeviceMouseDown: onDeviceDragStart,
    handleMouseMove,
    handleMouseUp,
    handleDeviceWheel,
  } = useDrag({
    onDeviceDrag: handleDeviceDrag,
    onImageDrag: handleImageDrag,
    onDeviceScale: handleDeviceScale,
    scale,
    previewZoom,
    isEnabled: moveMode && !isEditingText,
  });

  // 文件拖放 hook
  const {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileDrop(onImageDrop);

  // 设备点击处理
  const handleDeviceMouseDown = useCallback((e, deviceIndex) => {
    const currentPos = deviceIndex === 1 
      ? (devicePosition1 || { x: 0, y: 0 }) 
      : (devicePosition2 || { x: 0, y: 0 });
    
    setActiveDevice(deviceIndex);
    onDeviceDragStart(e, deviceIndex, currentPos);
  }, [devicePosition1, devicePosition2, setActiveDevice, onDeviceDragStart]);

  // 画布点击处理
  const handleCanvasMouseDown = useCallback((e) => {
    if (isEditingText || !moveMode) return;
    
    const currentPos = activeDevice === 1 ? position : position2;
    // 这里可以扩展为图片拖拽
  }, [isEditingText, moveMode, activeDevice, position, position2]);

  // 滚轮处理
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      handleZoomWheel(e);
    } else if (moveMode) {
      // 在移动模式下，滚轮缩放当前选中的设备
      handleDeviceWheel(e, activeDevice);
    }
  }, [handleZoomWheel, moveMode, handleDeviceWheel, activeDevice]);

  return (
    <div 
      className="flex-1 relative overflow-hidden flex items-center justify-center p-6 md:p-12 bg-secondary/30"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 网格背景 */}
      <div className="absolute inset-0 z-0 grid-pattern" />

      {/* 拖拽上传提示 */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-foreground/5 border-2 border-dashed border-foreground/30 flex items-center justify-center backdrop-blur-sm">
          <div className="glass px-8 py-5 rounded-2xl">
            <p className="text-base font-semibold text-foreground">释放以上传图片</p>
          </div>
        </div>
      )}

      {/* 导出画布 */}
      <PreviewCanvas
        ref={ref}
        // 背景
        background={background}
        customBgColor={customBgColor}
        customBgImage={customBgImage}
        isDark={isDark}
        // 布局
        layout={layout}
        exportRatio={exportRatio}
        // 设备配置
        model={model}
        deviceColor={deviceColor}
        isLandscape={isLandscape}
        hasShadow={hasShadow}
        enableAnimation={enableAnimation}
        // 3D 效果
        rotateX={rotateX}
        rotateY={rotateY}
        perspective={perspective}
        // 图片
        screenshot={screenshot}
        screenshot2={screenshot2}
        fitMode={fitMode}
        scale={scale}
        position={position}
        position2={position2}
        // 设备位置缩放
        devicePosition1={devicePosition1}
        devicePosition2={devicePosition2}
        deviceScale1={deviceScale1}
        deviceScale2={deviceScale2}
        // 文字标注
        annotation={annotation}
        setAnnotation={setAnnotation}
        isEditingText={isEditingText}
        watermark={watermark}
        // 交互状态
        moveMode={moveMode}
        activeDevice={activeDevice}
        isDragging={isDragging}
        // 缩放
        previewZoom={previewZoom}
        // 事件处理
        onDeviceMouseDown={handleDeviceMouseDown}
        onDeviceWheel={handleDeviceWheel}
        onCanvasMouseDown={handleCanvasMouseDown}
      />

      {/* 状态提示 */}
      <div className="absolute top-5 right-5 glass px-4 py-2 rounded-xl text-xs font-medium z-20 flex items-center gap-2">
        <ZoomIn size={12} className="text-muted-foreground" />
        {moveMode && isDragging && dragType === 'device' 
          ? `拖拽设备 ${currentDevice} · ${Math.round((currentDevice === 1 ? deviceScale1 : deviceScale2) * 100)}%` 
          : moveMode 
            ? `移动模式 · 设备 ${activeDevice} · ${Math.round((activeDevice === 1 ? deviceScale1 : deviceScale2) * 100)}%` 
            : isEditingText 
              ? '编辑文字' 
              : `${Math.round(previewZoom * 100)}%`}
      </div>

      {/* 移动模式按钮 */}
      <button
        onClick={() => setMoveMode(!moveMode)}
        className={`
          absolute top-5 left-5 glass px-4 py-2.5 rounded-xl text-sm font-medium z-20 transition-all duration-200 flex items-center gap-2 btn-press
          ${moveMode ? 'bg-foreground text-background border-foreground' : 'hover:bg-accent'}
        `}
      >
        {moveMode ? <Move size={14} /> : <Lock size={14} />}
        {moveMode ? '移动模式' : '锁定'}
      </button>

      {/* 快捷键提示 */}
      <div className="absolute bottom-5 left-5 glass px-4 py-2 rounded-xl text-[11px] z-20 text-muted-foreground font-medium">
        <span className="opacity-60">Ctrl+滚轮</span> 预览缩放 · 
        {moveMode && <><span className="opacity-60">滚轮</span> 设备缩放 · </>}
        <span className="font-mono"> Ctrl+Z/Y</span> 撤销 ·
        <span className="font-mono"> Ctrl+E</span> 导出
      </div>
    </div>
  );
});

PreviewArea.displayName = 'PreviewArea';

export default PreviewArea;
