import html2canvas from 'html2canvas';

// 导出比例配置
export const EXPORT_RATIOS = [
  { id: 'auto', name: '自适应', ratio: null },
  { id: '1:1', name: '1:1', ratio: 1 },
  { id: '3:4', name: '3:4', ratio: 3/4 },
  { id: '4:3', name: '4:3', ratio: 4/3 },
  { id: '9:16', name: '9:16', ratio: 9/16 },
  { id: '16:9', name: '16:9', ratio: 16/9 },
];

export function useExport() {
  const exportImage = async (elementRef, scale = 2, ratio = null) => {
    if (!elementRef.current) return false;

    try {
      const element = elementRef.current;
      
      // 如果有比例要求，临时调整元素尺寸
      let originalStyle = null;
      if (ratio) {
        originalStyle = {
          width: element.style.width,
          height: element.style.height,
          minWidth: element.style.minWidth,
          minHeight: element.style.minHeight,
        };
        
        const currentWidth = element.offsetWidth;
        const newHeight = currentWidth / ratio;
        
        element.style.width = `${currentWidth}px`;
        element.style.height = `${newHeight}px`;
        element.style.minWidth = `${currentWidth}px`;
        element.style.minHeight = `${newHeight}px`;
        
        // 等待重绘
        await new Promise(r => setTimeout(r, 100));
      }

      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      // 恢复原始样式
      if (originalStyle) {
        Object.assign(element.style, originalStyle);
      }

      const link = document.createElement('a');
      link.download = `mockup_export_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 批量导出
  const batchExport = async (elementRef, configs, scale = 2) => {
    const results = [];
    for (const config of configs) {
      const success = await exportImage(elementRef, scale, config.ratio);
      results.push({ config, success });
      // 间隔避免浏览器卡顿
      await new Promise(r => setTimeout(r, 500));
    }
    return results;
  };

  return { exportImage, batchExport };
}
