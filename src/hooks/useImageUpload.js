import { useCallback } from 'react';

/**
 * 图片上传 hook
 * @param {Function} onLoad - 图片加载完成后的回调，接收 base64 数据
 * @returns {Function} 处理文件上传的函数
 */
export function useImageUpload(onLoad) {
  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      console.warn('请选择图片文件');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      onLoad?.(event.target.result);
    };
    reader.onerror = () => {
      console.error('图片读取失败');
    };
    reader.readAsDataURL(file);
  }, [onLoad]);

  return handleUpload;
}

/**
 * 从 File 对象读取图片
 * @param {File} file - 文件对象
 * @param {Function} onLoad - 加载完成回调
 */
export function readImageFile(file, onLoad) {
  if (!file || !file.type.startsWith('image/')) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    onLoad?.(event.target.result);
  };
  reader.readAsDataURL(file);
}
