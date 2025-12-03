import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * 通用拖拽 hook
 * 支持设备拖拽和图片拖拽两种模式
 * 使用 requestAnimationFrame 优化性能
 */
export function useDrag({
  onDeviceDrag,
  onImageDrag,
  onDeviceScale,
  scale = 1,
  previewZoom = 1,
  isEnabled = true,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null); // 'device' | 'image'
  
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const draggingDevice = useRef(1);
  const rafId = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // 清理 RAF
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // 开始拖拽设备
  const handleDeviceMouseDown = useCallback((e, deviceIndex, currentPosition) => {
    if (!isEnabled) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragType('device');
    draggingDevice.current = deviceIndex;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...currentPosition };
  }, [isEnabled]);

  // 开始拖拽图片
  const handleImageMouseDown = useCallback((e, deviceIndex, currentPosition) => {
    if (!isEnabled) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragType('image');
    draggingDevice.current = deviceIndex;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...currentPosition };
  }, [isEnabled]);

  // 使用 RAF 节流的更新函数
  const updatePosition = useCallback(() => {
    const { x, y } = lastMousePos.current;
    const dx = x - dragStart.current.x;
    const dy = y - dragStart.current.y;
    
    if (dragType === 'device') {
      const newPos = {
        x: Math.round(posStart.current.x + dx / previewZoom),
        y: Math.round(posStart.current.y + dy / previewZoom),
      };
      onDeviceDrag?.(draggingDevice.current, newPos);
    } else if (dragType === 'image') {
      const effectiveScale = scale * previewZoom;
      const newPos = {
        x: Math.round(posStart.current.x + dx / effectiveScale),
        y: Math.round(posStart.current.y + dy / effectiveScale),
      };
      onImageDrag?.(draggingDevice.current, newPos);
    }
    
    rafId.current = null;
  }, [dragType, previewZoom, scale, onDeviceDrag, onImageDrag]);

  // 拖拽移动 - 使用 RAF 节流
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !isEnabled) return;
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    // 使用 RAF 节流，避免每次 mousemove 都触发更新
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePosition);
    }
  }, [isDragging, isEnabled, updatePosition]);

  // 结束拖拽
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  // 滚轮缩放设备
  const handleDeviceWheel = useCallback((e, deviceIndex) => {
    if (!isEnabled) return;
    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    onDeviceScale?.(deviceIndex, delta);
  }, [isEnabled, onDeviceScale]);

  return {
    isDragging,
    dragType,
    currentDevice: draggingDevice.current,
    handleDeviceMouseDown,
    handleImageMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDeviceWheel,
  };
}

/**
 * 文件拖放 hook
 */
export function useFileDrop(onFileDrop) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileDrop?.(files[0]);
    }
  }, [onFileDrop]);

  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}

/**
 * 预览缩放 hook
 */
export function usePreviewZoom(initialZoom = 1) {
  const [previewZoom, setPreviewZoom] = useState(initialZoom);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setPreviewZoom(prev => Math.max(0.3, Math.min(2, prev + delta)));
    }
  }, []);

  return {
    previewZoom,
    setPreviewZoom,
    handleWheel,
  };
}
