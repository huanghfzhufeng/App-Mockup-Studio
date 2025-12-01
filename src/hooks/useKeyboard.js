import { useEffect } from 'react';

export function useKeyboard({ onExport, setRotateX, setRotateY, rotateX, rotateY }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+E 导出
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        onExport?.();
      }
      
      // 方向键微调角度
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        const step = e.shiftKey ? 5 : 1;
        
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            setRotateX?.(Math.max(-30, rotateX - step));
            break;
          case 'ArrowDown':
            e.preventDefault();
            setRotateX?.(Math.min(30, rotateX + step));
            break;
          case 'ArrowLeft':
            e.preventDefault();
            setRotateY?.(Math.max(-45, rotateY - step));
            break;
          case 'ArrowRight':
            e.preventDefault();
            setRotateY?.(Math.min(45, rotateY + step));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExport, setRotateX, setRotateY, rotateX, rotateY]);
}
