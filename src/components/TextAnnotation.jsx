import { useState, useRef } from 'react';
import { FONT_STYLES } from '../config/constants';

export default function TextAnnotation({ annotation, onChange, isEditing }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e, type) => {
    if (!isEditing) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    startPos.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { ...annotation[type].position };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragType) return;
    
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    
    onChange({
      ...annotation,
      [dragType]: {
        ...annotation[dragType],
        position: {
          x: startOffset.current.x + dx,
          y: startOffset.current.y + dy,
        }
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const getFontStyle = (styleId) => {
    return FONT_STYLES.find(f => f.id === styleId) || FONT_STYLES[0];
  };

  const getTextStyle = (textConfig) => {
    const fontStyle = getFontStyle(textConfig.fontStyle);
    
    return {
      transform: `translate(calc(-50% + ${textConfig.position.x}px), calc(-50% + ${textConfig.position.y}px))`,
      fontSize: `${textConfig.fontSize}px`,
      fontWeight: textConfig.fontWeight,
      color: textConfig.color,
      fontFamily: fontStyle.fontFamily,
      ...fontStyle.style,
    };
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-20"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 标题 */}
      {annotation.title.visible && annotation.title.text && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 select-none whitespace-nowrap ${isEditing ? 'pointer-events-auto cursor-move ring-2 ring-blue-400 ring-offset-2 rounded px-2' : ''}`}
          style={getTextStyle(annotation.title)}
          onMouseDown={(e) => handleMouseDown(e, 'title')}
        >
          {annotation.title.text}
        </div>
      )}

      {/* 副标题 */}
      {annotation.subtitle.visible && annotation.subtitle.text && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 select-none whitespace-nowrap ${isEditing ? 'pointer-events-auto cursor-move ring-2 ring-blue-400 ring-offset-2 rounded px-2' : ''}`}
          style={getTextStyle(annotation.subtitle)}
          onMouseDown={(e) => handleMouseDown(e, 'subtitle')}
        >
          {annotation.subtitle.text}
        </div>
      )}
    </div>
  );
}
