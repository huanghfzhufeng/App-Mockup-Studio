import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * 统一的键盘快捷键管理 hook
 */
export function useKeyboard({ onExport }) {
  const {
    rotateX,
    rotateY,
    setRotateX,
    setRotateY,
    undo,
    redo,
  } = useAppStore();

  const handleKeyDown = useCallback((e) => {
    // 如果在输入框中，不处理快捷键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Ctrl+E 导出
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      onExport?.();
      return;
    }

    // Ctrl+Z 撤销
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
      return;
    }

    // Ctrl+Y 重做
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redo();
      return;
    }

    // 方向键微调角度（不带修饰键）
    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
      const step = e.shiftKey ? 5 : 1;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setRotateX(Math.max(-30, rotateX - step));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setRotateX(Math.min(30, rotateX + step));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setRotateY(Math.max(-45, rotateY - step));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setRotateY(Math.min(45, rotateY + step));
          break;
      }
    }
  }, [onExport, rotateX, rotateY, setRotateX, setRotateY, undo, redo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
