import { useState } from 'react';
import {
  Upload, Download, Smartphone, Layout, Palette, Image as ImageIcon,
  Box, RotateCcw, Type, Save, Layers, Ratio, Moon, Sun, RotateCw,
  Sparkles, ImagePlus, ChevronDown, ChevronRight
} from 'lucide-react';
import { BACKGROUNDS, DEVICE_MODELS, PRESET_ANGLES, EXPORT_RATIOS, FONT_STYLES, LAYOUT_MODES } from '../config/constants';

// 可折叠区块组件
function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {Icon && <Icon size={14} className="text-muted-foreground" />}
          {title}
        </div>
        {isOpen ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
      </button>
      {isOpen && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
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

  const brandNames = { apple: 'Apple', google: 'Google Pixel', samsung: 'Samsung' };

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
    <div className="w-full md:w-[360px] border-r border-border h-auto md:h-screen overflow-y-auto flex-shrink-0 z-20 bg-sidebar scrollbar-thin">
      {/* 头部 */}
      <div className="p-4 sticky top-0 z-10 bg-sidebar border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-foreground">
              SnapShell
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">让产品截图更有质感</p>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={toggleDark} 
              className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={onReset} 
              className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" 
              title="重置所有设置"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        
        {/* 撤销/重做 */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className="flex-1 h-8 text-xs rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            ↶ 撤销
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 h-8 text-xs rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            重做 ↷
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {/* 模板 */}
        <Section title="模板" icon={Layers} defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {templates.map(template => (
              <div key={template.id} className="relative group">
                <button
                  onClick={() => onApplyTemplate(template)}
                  className="text-xs h-7 px-2.5 border border-input rounded-md hover:bg-accent hover:border-ring transition-all"
                >
                  {template.name}
                </button>
                {template.isCustom && (
                  <button 
                    onClick={() => onDeleteTemplate(template.id)} 
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowTemplateModal(true)} 
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
          >
            <Save size={10} /> 保存当前为模板
          </button>
          {showTemplateModal && (
            <div className="mt-2 p-3 rounded-lg bg-muted">
              <input 
                type="text" 
                value={newTemplateName} 
                onChange={(e) => setNewTemplateName(e.target.value)} 
                placeholder="模板名称" 
                className="w-full h-8 text-sm px-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-2" 
              />
              <div className="flex gap-2">
                <button onClick={handleSaveTemplate} className="h-7 px-3 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90">保存</button>
                <button onClick={() => setShowTemplateModal(false)} className="h-7 px-3 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">取消</button>
              </div>
            </div>
          )}
        </Section>

        {/* 上传 */}
        <Section title="截图上传" icon={Upload}>
          <div className={`grid gap-2 ${layout === 'double' || layout === 'mixed' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="relative group">
              <input type="file" accept="image/png, image/jpeg" onChange={onImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-input rounded-lg p-3 text-center transition-all group-hover:border-ring group-hover:bg-accent/30">
                {screenshot ? (
                  <div className="relative w-full h-16 rounded overflow-hidden bg-muted">
                    <img src={screenshot} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2 text-muted-foreground">
                    <ImageIcon size={20} className="mb-1" />
                    <span className="text-xs">{layout !== 'single' ? '图片 1' : '点击上传'}</span>
                  </div>
                )}
              </div>
            </div>
            {(layout === 'double' || layout === 'mixed') && (
              <div className="relative group">
                <input type="file" accept="image/png, image/jpeg" onChange={onImageUpload2} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="border-2 border-dashed border-input rounded-lg p-3 text-center transition-all group-hover:border-ring group-hover:bg-accent/30">
                  {screenshot2 ? (
                    <div className="relative w-full h-16 rounded overflow-hidden bg-muted">
                      <img src={screenshot2} alt="Preview 2" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2 text-muted-foreground">
                      <ImageIcon size={20} className="mb-1" />
                      <span className="text-xs">图片 2</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {screenshot && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">填充模式</span>
                <div className="flex rounded-md border border-input overflow-hidden">
                  <button 
                    onClick={() => setFitMode('cover')} 
                    className={`px-3 h-7 text-xs transition-colors ${fitMode === 'cover' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                  >
                    Fill
                  </button>
                  <button 
                    onClick={() => setFitMode('contain')} 
                    className={`px-3 h-7 text-xs transition-colors ${fitMode === 'contain' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                  >
                    Fit
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">缩放</span>
                  <span className="text-foreground font-medium">{(scale * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.05" 
                  value={scale} 
                  onChange={(e) => setScale(parseFloat(e.target.value))} 
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-xs" 
                />
              </div>
              
              {/* 移动模式控制 */}
              <div className={`p-3 rounded-lg border transition-colors ${moveMode ? 'border-ring bg-accent/50' : 'border-input'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">图片位置</span>
                  <button 
                    onClick={() => setMoveMode(!moveMode)}
                    className={`h-7 px-3 text-xs rounded-md transition-all ${moveMode ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  >
                    {moveMode ? '✓ 移动中' : '开启移动'}
                  </button>
                </div>
                
                {(layout === 'double' || layout === 'mixed') && (
                  <div className="flex gap-1.5 mb-3">
                    <button 
                      onClick={() => setActiveDevice(1)}
                      className={`flex-1 h-7 text-xs rounded-md transition-all ${activeDevice === 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    >
                      设备 1
                    </button>
                    <button 
                      onClick={() => setActiveDevice(2)}
                      className={`flex-1 h-7 text-xs rounded-md transition-all ${activeDevice === 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    >
                      设备 2
                    </button>
                  </div>
                )}
                
                {(() => {
                  const currentPos = activeDevice === 1 ? position : position2;
                  const setCurrentPos = activeDevice === 1 ? setPosition : setPosition2;
                  return (
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">X 偏移</span>
                          <span className="text-foreground">{currentPos.x}px</span>
                        </div>
                        <input type="range" min="-150" max="150" step="1" value={currentPos.x} onChange={(e) => setCurrentPos({...currentPos, x: parseInt(e.target.value)})} className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Y 偏移</span>
                          <span className="text-foreground">{currentPos.y}px</span>
                        </div>
                        <input type="range" min="-150" max="150" step="1" value={currentPos.y} onChange={(e) => setCurrentPos({...currentPos, y: parseInt(e.target.value)})} className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
                      </div>
                      <button onClick={() => setCurrentPos({ x: 0, y: 0 })} className="text-xs text-primary hover:underline flex items-center gap-1">
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
            <div key={brand} className="mb-3 last:mb-0">
              <div className="text-xs text-muted-foreground mb-1.5">{brandNames[brand]}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {models.map(({ key, name }) => (
                  <button 
                    key={key} 
                    onClick={() => { setModel(key); setDeviceColor(Object.keys(DEVICE_MODELS[key].frameColor)[0]); }}
                    className={`text-xs h-8 px-2 border rounded-md truncate transition-all ${model === key ? 'border-ring bg-accent text-accent-foreground font-medium' : 'border-input hover:border-ring hover:bg-accent/50'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
            {Object.keys(DEVICE_MODELS[model].frameColor).map((colorKey) => (
              <button 
                key={colorKey} 
                onClick={() => setDeviceColor(colorKey)}
                className={`w-7 h-7 rounded-full border-2 transition-all shadow-xs ${deviceColor === colorKey ? 'border-ring scale-110 ring-2 ring-ring/20' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: DEVICE_MODELS[model].frameColor[colorKey] }} 
                title={colorKey} 
              />
            ))}
          </div>
        </Section>

        {/* 布局 */}
        <Section title="布局设置" icon={Layout}>
          <div className="flex gap-1.5">
            {LAYOUT_MODES.map(mode => (
              <button 
                key={mode.id} 
                onClick={() => setLayout(mode.id)}
                className={`flex-1 h-9 text-xs border rounded-md transition-all ${layout === mode.id ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:border-ring hover:bg-accent/50'}`}
              >
                {mode.icon} {mode.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground">
              <input type="checkbox" checked={hasShadow} onChange={(e) => setHasShadow(e.target.checked)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
              投影
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground">
              <input type="checkbox" checked={isLandscape} onChange={(e) => setIsLandscape(e.target.checked)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
              <RotateCw size={12} /> 横屏
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground">
              <input type="checkbox" checked={enableAnimation} onChange={(e) => setEnableAnimation(e.target.checked)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
              <Sparkles size={12} /> 动画
            </label>
          </div>
        </Section>


        {/* 3D 效果 */}
        <Section title="3D 效果" icon={Box}>
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PRESET_ANGLES.map(preset => (
              <button 
                key={preset.id} 
                onClick={() => applyPreset(preset)}
                className="flex flex-col items-center p-1.5 border border-input rounded-md transition-all hover:border-ring hover:bg-accent/50" 
                title={preset.name}
              >
                <span className="text-base">{preset.icon}</span>
                <span className="text-[9px] text-muted-foreground">{preset.name}</span>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs w-5 text-muted-foreground">X</span>
              <input type="range" min="-30" max="30" value={rotateX} onChange={(e) => setRotateX(parseInt(e.target.value))} className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
              <span className="text-xs w-8 text-right text-foreground">{rotateX}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-5 text-muted-foreground">Y</span>
              <input type="range" min="-45" max="45" value={rotateY} onChange={(e) => setRotateY(parseInt(e.target.value))} className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
              <span className="text-xs w-8 text-right text-foreground">{rotateY}°</span>
            </div>
          </div>
        </Section>

        {/* 文字标注 */}
        <Section title="文字标注" icon={Type} defaultOpen={false}>
          <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground mb-3">
            <input type="checkbox" checked={isEditingText} onChange={(e) => setIsEditingText(e.target.checked)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
            编辑模式（可拖拽）
          </label>
          
          {/* 标题 */}
          <div className="p-3 rounded-lg bg-muted/50 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">标题</span>
              <input type="checkbox" checked={annotation.title.visible} onChange={(e) => updateAnnotation('title', 'visible', e.target.checked)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
            </div>
            {annotation.title.visible && (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={annotation.title.text} 
                  onChange={(e) => updateAnnotation('title', 'text', e.target.value)} 
                  placeholder="输入标题"
                  className="w-full h-8 text-sm px-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" 
                />
                <div className="flex gap-2 flex-wrap">
                  <input 
                    type="number" 
                    value={annotation.title.fontSize} 
                    onChange={(e) => updateAnnotation('title', 'fontSize', parseInt(e.target.value))}
                    className="w-14 h-8 text-xs px-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" 
                    min="12" 
                    max="120" 
                  />
                  <input 
                    type="color" 
                    value={annotation.title.color} 
                    onChange={(e) => updateAnnotation('title', 'color', e.target.value)} 
                    className="w-8 h-8 p-0.5 border border-input rounded-md cursor-pointer" 
                  />
                  <select 
                    value={annotation.title.fontWeight} 
                    onChange={(e) => updateAnnotation('title', 'fontWeight', e.target.value)}
                    className="h-8 text-xs px-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="normal">常规</option>
                    <option value="bold">粗体</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-1">
                  {FONT_STYLES.map(style => (
                    <button 
                      key={style.id} 
                      onClick={() => updateAnnotation('title', 'fontStyle', style.id)}
                      className={`text-xs h-7 px-2 border rounded-md transition-all ${annotation.title.fontStyle === style.id ? 'border-ring bg-accent' : 'border-input hover:border-ring'}`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 副标题 */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">副标题</span>
              <input type="checkbox" checked={annotation.subtitle.visible} onChange={(e) => updateAnnotation('subtitle', 'visible', e.target.checked)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
            </div>
            {annotation.subtitle.visible && (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={annotation.subtitle.text} 
                  onChange={(e) => updateAnnotation('subtitle', 'text', e.target.value)} 
                  placeholder="输入副标题"
                  className="w-full h-8 text-sm px-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" 
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={annotation.subtitle.fontSize} 
                    onChange={(e) => updateAnnotation('subtitle', 'fontSize', parseInt(e.target.value))}
                    className="w-14 h-8 text-xs px-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" 
                    min="12" 
                    max="72" 
                  />
                  <input 
                    type="color" 
                    value={annotation.subtitle.color} 
                    onChange={(e) => updateAnnotation('subtitle', 'color', e.target.value)} 
                    className="w-8 h-8 p-0.5 border border-input rounded-md cursor-pointer" 
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 水印 */}
        <Section title="水印" icon={Type} defaultOpen={false}>
          <div className="p-3 rounded-lg bg-muted/50">
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground mb-2">
              <input type="checkbox" checked={watermark.visible} onChange={(e) => setWatermark({ ...watermark, visible: e.target.checked })} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
              显示水印
            </label>
            {watermark.visible && (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={watermark.text} 
                  onChange={(e) => setWatermark({ ...watermark, text: e.target.value })} 
                  placeholder="水印文字"
                  className="w-full h-8 text-sm px-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" 
                />
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">透明度</span>
                    <span className="text-foreground">{Math.round(watermark.opacity * 100)}%</span>
                  </div>
                  <input type="range" min="0.05" max="0.5" step="0.05" value={watermark.opacity} onChange={(e) => setWatermark({ ...watermark, opacity: parseFloat(e.target.value) })} className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
                </div>
              </div>
            )}
          </div>
        </Section>


        {/* 背景 */}
        <Section title="背景" icon={Palette}>
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {BACKGROUNDS.map(bg => (
              <button 
                key={bg.id} 
                onClick={() => setBackground(bg)}
                className={`w-full aspect-square rounded-lg border-2 overflow-hidden shadow-xs transition-all ${background.id === bg.id ? 'border-ring scale-105' : 'border-transparent hover:border-input'}`}
                style={bg.type === 'solid' || bg.type === 'gradient' ? { background: bg.value } : {}}
              >
                {bg.type === 'custom-glass' && <div className="w-full h-full flex items-center justify-center text-[8px] bg-muted text-muted-foreground">Glass</div>}
              </button>
            ))}
            <button 
              onClick={() => setBackground({ id: 'custom', type: 'solid', value: customBgColor })}
              className={`w-full aspect-square rounded-lg border-2 flex items-center justify-center ${background.id === 'custom' ? 'border-ring' : 'border-input'}`}
            >
              <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: customBgColor }}></div>
            </button>
          </div>
          {background.id === 'custom' && (
            <div className="flex items-center gap-2 mb-2">
              <input type="color" value={customBgColor} onChange={(e) => setCustomBgColor(e.target.value)} className="h-7 w-7 p-0.5 border border-input rounded-md cursor-pointer" />
              <span className="text-xs uppercase text-muted-foreground">{customBgColor}</span>
            </div>
          )}
          <div className="relative">
            <input type="file" accept="image/*" onChange={onBgImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <button className="w-full h-8 text-xs border border-input rounded-md flex items-center justify-center gap-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <ImagePlus size={12} /> {customBgImage ? '更换背景图' : '上传背景图'}
            </button>
          </div>
        </Section>

        {/* 导出 */}
        <Section title="导出" icon={Download}>
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1.5">分辨率</div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(r => (
                <button 
                  key={r} 
                  onClick={() => setExportRes(r)}
                  className={`flex-1 h-8 text-xs border rounded-md transition-all ${exportRes === r ? 'bg-primary text-primary-foreground border-primary font-medium' : 'border-input hover:border-ring hover:bg-accent/50'}`}
                >
                  {r === 1 ? '1080p' : r === 2 ? '2K' : '4K'}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Ratio size={10} /> 比例</div>
            <div className="flex flex-wrap gap-1.5">
              {EXPORT_RATIOS.map(r => (
                <button 
                  key={r.id} 
                  onClick={() => setExportRatio(r)}
                  className={`h-7 px-2.5 text-xs border rounded-md transition-all ${exportRatio.id === r.id ? 'bg-primary text-primary-foreground border-primary font-medium' : 'border-input hover:border-ring hover:bg-accent/50'}`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={onExport} 
            disabled={isExporting}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mb-2"
          >
            {isExporting ? '生成中...' : '下载生成图'} <Download size={14} />
          </button>
          <button 
            onClick={onBatchExport} 
            disabled={isExporting}
            className="w-full h-9 rounded-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none text-xs"
          >
            批量导出（所有比例）
          </button>
        </Section>
      </div>
    </div>
  );
}
