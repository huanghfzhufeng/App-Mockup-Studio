import { useState } from 'react';
import {
  Upload, Download, Smartphone, Layout, Palette, Image as ImageIcon,
  Box, RotateCcw, Type, Save, Layers, Ratio, Moon, Sun, RotateCw,
  Sparkles, ImagePlus, ChevronDown, ChevronRight, Zap
} from 'lucide-react';
import { BACKGROUNDS, DEVICE_MODELS, PRESET_ANGLES, EXPORT_RATIOS, FONT_STYLES, LAYOUT_MODES } from '../config/constants';

// 可折叠区块组件
function Section({ title, icon: Icon, children, defaultOpen = true, badge }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-all duration-200 group"
      >
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
              <Icon size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          )}
          <span className="text-sm font-medium text-foreground">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-foreground text-background rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={14} className="text-muted-foreground" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}

// 小按钮组件
function SmallButton({ active, children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200 btn-press
        ${active 
          ? 'bg-foreground text-background shadow-md' 
          : 'bg-secondary hover:bg-accent text-foreground border border-border/50 hover:border-border'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default function ControlPanel({
  screenshot,
  screenshot2,
  onImageUpload,
  onImageUpload2,
  onBgImageUpload,
  model,
  setModel,
  deviceColor,
  setDeviceColor,
  background,
  setBackground,
  customBgColor,
  setCustomBgColor,
  customBgImage,
  layout,
  setLayout,
  fitMode,
  setFitMode,
  scale,
  setScale,
  position,
  setPosition,
  position2,
  setPosition2,
  moveMode,
  setMoveMode,
  activeDevice,
  setActiveDevice,
  hasShadow,
  setHasShadow,
  exportRes,
  setExportRes,
  exportRatio,
  setExportRatio,
  onExport,
  onBatchExport,
  isExporting,
  rotateX,
  setRotateX,
  rotateY,
  setRotateY,
  perspective,
  setPerspective,
  annotation,
  setAnnotation,
  isEditingText,
  setIsEditingText,
  templates,
  onSaveTemplate,
  onApplyTemplate,
  onDeleteTemplate,
  isLandscape,
  setIsLandscape,
  enableAnimation,
  setEnableAnimation,
  watermark,
  setWatermark,
  isDark,
  toggleDark,
  onReset,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const groupedModels = Object.entries(DEVICE_MODELS).reduce((acc, [key, config]) => {
    const brand = config.brand || 'other';
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push({ key, ...config });
    return acc;
  }, {});

  const brandNames = { apple: 'Apple', google: 'Pixel', samsung: 'Samsung' };

  const applyPreset = (preset) => {
    setRotateX(preset.rotateX);
    setRotateY(preset.rotateY);
    setPerspective(preset.perspective);
  };

  const updateAnnotation = (type, field, value) => {
    setAnnotation({
      ...annotation,
      [type]: { ...annotation[type], [field]: value }
    });
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    onSaveTemplate(newTemplateName.trim());
    setNewTemplateName('');
    setShowTemplateModal(false);
  };

  return (
    <div className="w-full md:w-[380px] border-r border-border/50 h-auto md:h-screen overflow-y-auto flex-shrink-0 z-20 bg-sidebar scrollbar-thin">
      {/* 头部 */}
      <div className="p-5 sticky top-0 z-10 bg-sidebar/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              SnapShell
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">让产品截图更有质感</p>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={toggleDark} 
              className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center transition-all duration-200 btn-press"
              title={isDark ? '切换亮色' : '切换暗色'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={onReset} 
              className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center transition-all duration-200 btn-press" 
              title="重置所有设置"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        
        {/* 撤销/重做 */}
        <div className="flex gap-2">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className="flex-1 h-9 text-xs font-medium rounded-xl bg-secondary hover:bg-accent border border-border/50 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none btn-press"
          >
            ↶ 撤销
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 h-9 text-xs font-medium rounded-xl bg-secondary hover:bg-accent border border-border/50 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none btn-press"
          >
            重做 ↷
          </button>
        </div>
      </div>

      <div>
        {/* 模板 */}
        <Section title="模板预设" icon={Layers} defaultOpen={false} badge={templates.length}>
          <div className="flex flex-wrap gap-2">
            {templates.map(template => (
              <div key={template.id} className="relative group">
                <button
                  onClick={() => onApplyTemplate(template)}
                  className="h-8 px-3 text-xs font-medium bg-secondary hover:bg-accent rounded-lg border border-border/50 hover:border-foreground/20 transition-all duration-200 btn-press"
                >
                  {template.name}
                </button>
                {template.isCustom && (
                  <button 
                    onClick={() => onDeleteTemplate(template.id)} 
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowTemplateModal(true)} 
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mt-2 transition-colors"
          >
            <Save size={12} /> 保存当前配置为模板
          </button>
          {showTemplateModal && (
            <div className="mt-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <input 
                type="text" 
                value={newTemplateName} 
                onChange={(e) => setNewTemplateName(e.target.value)} 
                placeholder="输入模板名称" 
                className="w-full h-9 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30 mb-3" 
              />
              <div className="flex gap-2">
                <button onClick={handleSaveTemplate} className="h-8 px-4 text-xs font-medium bg-foreground text-background rounded-lg btn-press">保存</button>
                <button onClick={() => setShowTemplateModal(false)} className="h-8 px-4 text-xs font-medium bg-secondary rounded-lg btn-press">取消</button>
              </div>
            </div>
          )}
        </Section>

        {/* 上传 */}
        <Section title="截图上传" icon={Upload}>
          <div className={`grid gap-3 ${layout === 'double' || layout === 'mixed' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="relative group">
              <input type="file" accept="image/png, image/jpeg" onChange={onImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center transition-all duration-300 group-hover:border-foreground/30 group-hover:bg-accent/30">
                {screenshot ? (
                  <div className="relative w-full h-20 rounded-lg overflow-hidden bg-secondary">
                    <img src={screenshot} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-3 text-muted-foreground group-hover:text-foreground transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-accent transition-colors">
                      <ImageIcon size={18} />
                    </div>
                    <span className="text-xs font-medium">{layout !== 'single' ? '图片 1' : '点击上传'}</span>
                  </div>
                )}
              </div>
            </div>
            {(layout === 'double' || layout === 'mixed') && (
              <div className="relative group">
                <input type="file" accept="image/png, image/jpeg" onChange={onImageUpload2} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center transition-all duration-300 group-hover:border-foreground/30 group-hover:bg-accent/30">
                  {screenshot2 ? (
                    <div className="relative w-full h-20 rounded-lg overflow-hidden bg-secondary">
                      <img src={screenshot2} alt="Preview 2" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-3 text-muted-foreground group-hover:text-foreground transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-accent transition-colors">
                        <ImageIcon size={18} />
                      </div>
                      <span className="text-xs font-medium">图片 2</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {screenshot && (
            <div className="space-y-4 p-4 rounded-xl bg-secondary/30 border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">填充模式</span>
                <div className="flex rounded-lg overflow-hidden border border-border/50">
                  <SmallButton active={fitMode === 'cover'} onClick={() => setFitMode('cover')} className="rounded-none rounded-l-lg border-0">Fill</SmallButton>
                  <SmallButton active={fitMode === 'contain'} onClick={() => setFitMode('contain')} className="rounded-none rounded-r-lg border-0">Fit</SmallButton>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">缩放</span>
                  <span className="font-mono font-medium text-foreground">{(scale * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0.5" max="2" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full" />
              </div>
              
              {/* 移动模式控制 */}
              <div className={`p-4 rounded-xl border transition-all duration-300 ${moveMode ? 'border-foreground/30 bg-accent/50' : 'border-border/50 bg-secondary/30'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-foreground">图片位置</span>
                  <SmallButton active={moveMode} onClick={() => setMoveMode(!moveMode)}>
                    {moveMode ? '✓ 移动中' : '开启移动'}
                  </SmallButton>
                </div>
                
                {(layout === 'double' || layout === 'mixed') && (
                  <div className="flex gap-2 mb-3">
                    <SmallButton active={activeDevice === 1} onClick={() => setActiveDevice(1)} className="flex-1">设备 1</SmallButton>
                    <SmallButton active={activeDevice === 2} onClick={() => setActiveDevice(2)} className="flex-1">设备 2</SmallButton>
                  </div>
                )}
                
                {(() => {
                  const currentPos = activeDevice === 1 ? position : position2;
                  const setCurrentPos = activeDevice === 1 ? setPosition : setPosition2;
                  return (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">X 偏移</span>
                          <span className="font-mono text-foreground">{currentPos.x}px</span>
                        </div>
                        <input type="range" min="-150" max="150" step="1" value={currentPos.x} onChange={(e) => setCurrentPos({...currentPos, x: parseInt(e.target.value)})} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Y 偏移</span>
                          <span className="font-mono text-foreground">{currentPos.y}px</span>
                        </div>
                        <input type="range" min="-150" max="150" step="1" value={currentPos.y} onChange={(e) => setCurrentPos({...currentPos, y: parseInt(e.target.value)})} className="w-full" />
                      </div>
                      <button onClick={() => setCurrentPos({ x: 0, y: 0 })} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                        <RotateCcw size={10} /> 重置位置
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </Section>

        {/* 机型 */}
        <Section title="机型选择" icon={Smartphone}>
          {Object.entries(groupedModels).map(([brand, models]) => (
            <div key={brand} className="mb-4 last:mb-0">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{brandNames[brand]}</div>
              <div className="grid grid-cols-2 gap-2">
                {models.map(({ key, name }) => (
                  <button 
                    key={key} 
                    onClick={() => { setModel(key); setDeviceColor(Object.keys(DEVICE_MODELS[key].frameColor)[0]); }}
                    className={`
                      text-xs h-9 px-3 rounded-lg truncate transition-all duration-200 btn-press font-medium
                      ${model === key 
                        ? 'bg-foreground text-background shadow-md' 
                        : 'bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20'
                      }
                    `}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-full mb-1">颜色</span>
            {Object.keys(DEVICE_MODELS[model].frameColor).map((colorKey) => (
              <button 
                key={colorKey} 
                onClick={() => setDeviceColor(colorKey)}
                className={`
                  w-8 h-8 rounded-full transition-all duration-200 btn-press
                  ${deviceColor === colorKey ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'}
                `}
                style={{ backgroundColor: DEVICE_MODELS[model].frameColor[colorKey], boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} 
                title={colorKey} 
              />
            ))}
          </div>
        </Section>

        {/* 布局 */}
        <Section title="布局设置" icon={Layout}>
          <div className="flex gap-2">
            {LAYOUT_MODES.map(mode => (
              <SmallButton 
                key={mode.id} 
                active={layout === mode.id}
                onClick={() => setLayout(mode.id)}
                className="flex-1"
              >
                {mode.icon} {mode.name}
              </SmallButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-3">
            <label className="flex items-center gap-2.5 text-xs cursor-pointer text-foreground group">
              <input type="checkbox" checked={hasShadow} onChange={(e) => setHasShadow(e.target.checked)} />
              <span className="group-hover:text-foreground transition-colors">投影效果</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs cursor-pointer text-foreground group">
              <input type="checkbox" checked={isLandscape} onChange={(e) => setIsLandscape(e.target.checked)} />
              <RotateCw size={12} className="text-muted-foreground" />
              <span className="group-hover:text-foreground transition-colors">横屏</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs cursor-pointer text-foreground group">
              <input type="checkbox" checked={enableAnimation} onChange={(e) => setEnableAnimation(e.target.checked)} />
              <Sparkles size={12} className="text-muted-foreground" />
              <span className="group-hover:text-foreground transition-colors">悬浮动画</span>
            </label>
          </div>
        </Section>

        {/* 3D 效果 */}
        <Section title="3D 效果" icon={Box}>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {PRESET_ANGLES.map(preset => (
              <button 
                key={preset.id} 
                onClick={() => applyPreset(preset)}
                className="flex flex-col items-center p-2 rounded-xl bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20 transition-all duration-200 btn-press group" 
                title={preset.name}
              >
                <span className="text-lg mb-0.5">{preset.icon}</span>
                <span className="text-[9px] text-muted-foreground group-hover:text-foreground transition-colors">{preset.name}</span>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs w-6 text-muted-foreground font-medium">X</span>
              <input type="range" min="-30" max="30" value={rotateX} onChange={(e) => setRotateX(parseInt(e.target.value))} className="flex-1" />
              <span className="text-xs w-10 text-right font-mono text-foreground">{rotateX}°</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs w-6 text-muted-foreground font-medium">Y</span>
              <input type="range" min="-45" max="45" value={rotateY} onChange={(e) => setRotateY(parseInt(e.target.value))} className="flex-1" />
              <span className="text-xs w-10 text-right font-mono text-foreground">{rotateY}°</span>
            </div>
          </div>
        </Section>


        {/* 文字标注 */}
        <Section title="文字标注" icon={Type} defaultOpen={false}>
          <label className="flex items-center gap-2.5 text-xs cursor-pointer text-foreground mb-4">
            <input type="checkbox" checked={isEditingText} onChange={(e) => setIsEditingText(e.target.checked)} />
            <span>编辑模式（可拖拽文字）</span>
          </label>
          
          {/* 标题 */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-foreground">标题</span>
              <input type="checkbox" checked={annotation.title.visible} onChange={(e) => updateAnnotation('title', 'visible', e.target.checked)} />
            </div>
            {annotation.title.visible && (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={annotation.title.text} 
                  onChange={(e) => updateAnnotation('title', 'text', e.target.value)} 
                  placeholder="输入标题文字"
                  className="w-full h-9 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                />
                <div className="flex gap-2 flex-wrap">
                  <input 
                    type="number" 
                    value={annotation.title.fontSize} 
                    onChange={(e) => updateAnnotation('title', 'fontSize', parseInt(e.target.value))}
                    className="w-16 h-9 text-xs px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                    min="12" 
                    max="120" 
                  />
                  <input 
                    type="color" 
                    value={annotation.title.color} 
                    onChange={(e) => updateAnnotation('title', 'color', e.target.value)} 
                    className="w-9 h-9 rounded-lg cursor-pointer" 
                  />
                  <select 
                    value={annotation.title.fontWeight} 
                    onChange={(e) => updateAnnotation('title', 'fontWeight', e.target.value)}
                    className="h-9 text-xs px-3 rounded-lg bg-background border border-border focus:border-foreground/30"
                  >
                    <option value="normal">常规</option>
                    <option value="bold">粗体</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FONT_STYLES.map(style => (
                    <SmallButton 
                      key={style.id} 
                      active={annotation.title.fontStyle === style.id}
                      onClick={() => updateAnnotation('title', 'fontStyle', style.id)}
                    >
                      {style.name}
                    </SmallButton>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 副标题 */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-foreground">副标题</span>
              <input type="checkbox" checked={annotation.subtitle.visible} onChange={(e) => updateAnnotation('subtitle', 'visible', e.target.checked)} />
            </div>
            {annotation.subtitle.visible && (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={annotation.subtitle.text} 
                  onChange={(e) => updateAnnotation('subtitle', 'text', e.target.value)} 
                  placeholder="输入副标题文字"
                  className="w-full h-9 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={annotation.subtitle.fontSize} 
                    onChange={(e) => updateAnnotation('subtitle', 'fontSize', parseInt(e.target.value))}
                    className="w-16 h-9 text-xs px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                    min="12" 
                    max="72" 
                  />
                  <input 
                    type="color" 
                    value={annotation.subtitle.color} 
                    onChange={(e) => updateAnnotation('subtitle', 'color', e.target.value)} 
                    className="w-9 h-9 rounded-lg cursor-pointer" 
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 水印 */}
        <Section title="水印" icon={Type} defaultOpen={false}>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
            <label className="flex items-center gap-2.5 text-xs cursor-pointer text-foreground mb-3">
              <input type="checkbox" checked={watermark.visible} onChange={(e) => setWatermark({ ...watermark, visible: e.target.checked })} />
              <span>显示水印</span>
            </label>
            {watermark.visible && (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={watermark.text} 
                  onChange={(e) => setWatermark({ ...watermark, text: e.target.value })} 
                  placeholder="水印文字"
                  className="w-full h-9 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                />
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">透明度</span>
                    <span className="font-mono text-foreground">{Math.round(watermark.opacity * 100)}%</span>
                  </div>
                  <input type="range" min="0.05" max="0.5" step="0.05" value={watermark.opacity} onChange={(e) => setWatermark({ ...watermark, opacity: parseFloat(e.target.value) })} className="w-full" />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 背景 */}
        <Section title="背景" icon={Palette}>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {BACKGROUNDS.map(bg => (
              <button 
                key={bg.id} 
                onClick={() => setBackground(bg)}
                className={`
                  w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 btn-press
                  ${background.id === bg.id ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105' : 'hover:scale-105'}
                `}
                style={bg.type === 'solid' || bg.type === 'gradient' ? { background: bg.value, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {}}
              >
                {bg.type === 'custom-glass' && <div className="w-full h-full flex items-center justify-center text-[8px] font-medium bg-secondary text-muted-foreground">Glass</div>}
              </button>
            ))}
            <button 
              onClick={() => setBackground({ id: 'custom', type: 'solid', value: customBgColor })}
              className={`
                w-full aspect-square rounded-xl flex items-center justify-center bg-secondary border-2 border-dashed transition-all duration-200 btn-press
                ${background.id === 'custom' ? 'border-foreground' : 'border-border hover:border-foreground/30'}
              `}
            >
              <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: customBgColor }}></div>
            </button>
          </div>
          {background.id === 'custom' && (
            <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-secondary/30">
              <input type="color" value={customBgColor} onChange={(e) => setCustomBgColor(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer" />
              <span className="text-xs font-mono uppercase text-muted-foreground">{customBgColor}</span>
            </div>
          )}
          <div className="relative">
            <input type="file" accept="image/*" onChange={onBgImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <button className="w-full h-10 text-xs font-medium rounded-xl bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20 flex items-center justify-center gap-2 transition-all duration-200">
              <ImagePlus size={14} /> {customBgImage ? '更换背景图片' : '上传背景图片'}
            </button>
          </div>
        </Section>

        {/* 导出 */}
        <Section title="导出" icon={Download}>
          <div className="mb-4">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">分辨率</div>
            <div className="flex gap-2">
              {[1, 2, 3].map(r => (
                <SmallButton 
                  key={r} 
                  active={exportRes === r}
                  onClick={() => setExportRes(r)}
                  className="flex-1"
                >
                  {r === 1 ? '1080p' : r === 2 ? '2K' : '4K'}
                </SmallButton>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Ratio size={10} /> 导出比例
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPORT_RATIOS.map(r => (
                <SmallButton 
                  key={r.id} 
                  active={exportRatio.id === r.id}
                  onClick={() => setExportRatio(r)}
                >
                  {r.name}
                </SmallButton>
              ))}
            </div>
          </div>
          <button 
            onClick={onExport} 
            disabled={isExporting}
            className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none btn-press mb-3"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                生成中...
              </>
            ) : (
              <>
                <Zap size={16} /> 下载生成图
              </>
            )}
          </button>
          <button 
            onClick={onBatchExport} 
            disabled={isExporting}
            className="w-full h-10 rounded-xl font-medium bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none text-xs btn-press"
          >
            批量导出（所有比例）
          </button>
        </Section>
      </div>
      
      {/* 底部留白 */}
      <div className="h-8"></div>
    </div>
  );
}
