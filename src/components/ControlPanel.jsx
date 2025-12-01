import { useState } from 'react';
import {
  Upload, Download, Smartphone, Layout, Palette, Image as ImageIcon,
  Box, RotateCcw, Type, Save, Layers, Ratio, Moon, Sun, RotateCw,
  Sparkles, ImagePlus
} from 'lucide-react';
import { BACKGROUNDS, DEVICE_MODELS, PRESET_ANGLES, EXPORT_RATIOS, FONT_STYLES, LAYOUT_MODES } from '../config/constants';

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
    <div className={`w-full md:w-[380px] border-r h-auto md:h-screen overflow-y-auto flex-shrink-0 z-20 shadow-xl transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* 头部 */}
      <div className={`p-4 sticky top-0 backdrop-blur z-10 border-b ${isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              App Mockup Studio
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>让产品截图更有质感</p>
          </div>
          <div className="flex gap-1">
            <button onClick={toggleDark} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={onReset} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`} title="重置所有设置">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        
        {/* 撤销/重做 */}
        <div className="flex gap-1 mt-2">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className={`flex-1 py-1 text-xs rounded transition-colors disabled:opacity-40 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            ↶ 撤销
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex-1 py-1 text-xs rounded transition-colors disabled:opacity-40 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            重做 ↷
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* 模板 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Layers size={14} /> 模板
          </h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {templates.map(template => (
              <div key={template.id} className="relative group">
                <button
                  onClick={() => onApplyTemplate(template)}
                  className={`text-xs py-1 px-2 border rounded-lg transition-all ${isDark ? 'border-gray-600 hover:border-blue-400 hover:bg-blue-900/30' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'}`}
                >
                  {template.name}
                </button>
                {template.isCustom && (
                  <button onClick={() => onDeleteTemplate(template.id)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100">×</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setShowTemplateModal(true)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Save size={10} /> 保存模板
          </button>
          {showTemplateModal && (
            <div className={`mt-2 p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <input type="text" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder="模板名称" className={`w-full text-sm px-2 py-1 border rounded mb-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} />
              <div className="flex gap-2">
                <button onClick={handleSaveTemplate} className="text-xs px-3 py-1 bg-blue-600 text-white rounded">保存</button>
                <button onClick={() => setShowTemplateModal(false)} className={`text-xs px-3 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>取消</button>
              </div>
            </div>
          )}
        </section>

        {/* 上传 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Upload size={14} /> 截图上传
          </h3>
          <div className={`grid gap-2 ${layout === 'double' || layout === 'mixed' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="relative group">
              <input type="file" accept="image/png, image/jpeg" onChange={onImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${isDark ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-50'}`}>
                {screenshot ? (
                  <div className={`relative w-full h-16 rounded overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <img src={screenshot} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className={`flex flex-col items-center py-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <ImageIcon size={18} className="mb-1" />
                    <span className="text-xs">{layout !== 'single' ? '图片 1' : '点击上传'}</span>
                  </div>
                )}
              </div>
            </div>
            {(layout === 'double' || layout === 'mixed') && (
              <div className="relative group">
                <input type="file" accept="image/png, image/jpeg" onChange={onImageUpload2} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${isDark ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-50'}`}>
                  {screenshot2 ? (
                    <div className={`relative w-full h-16 rounded overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <img src={screenshot2} alt="Preview 2" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className={`flex flex-col items-center py-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <ImageIcon size={18} className="mb-1" />
                      <span className="text-xs">图片 2</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {screenshot && (
            <div className={`mt-2 p-2 rounded-lg space-y-2 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>填充</span>
                <div className={`flex rounded p-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <button onClick={() => setFitMode('cover')} className={`px-2 py-0.5 rounded text-xs ${fitMode === 'cover' ? (isDark ? 'bg-gray-600 text-white' : 'bg-white shadow-sm') : ''}`}>Fill</button>
                  <button onClick={() => setFitMode('contain')} className={`px-2 py-0.5 rounded text-xs ${fitMode === 'contain' ? (isDark ? 'bg-gray-600 text-white' : 'bg-white shadow-sm') : ''}`}>Fit</button>
                </div>
              </div>
              <div>
                <div className={`flex justify-between text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><span>缩放</span><span>{(scale * 100).toFixed(0)}%</span></div>
                <input type="range" min="0.5" max="2" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-blue-600 h-1 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          )}
        </section>

        {/* 机型 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Smartphone size={14} /> 机型
          </h3>
          {Object.entries(groupedModels).map(([brand, models]) => (
            <div key={brand} className="mb-2">
              <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{brandNames[brand]}</div>
              <div className="grid grid-cols-2 gap-1">
                {models.map(({ key, name }) => (
                  <button key={key} onClick={() => { setModel(key); setDeviceColor(Object.keys(DEVICE_MODELS[key].frameColor)[0]); }}
                    className={`text-xs py-1 px-2 border rounded truncate transition-all ${model === key ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : (isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300')}`}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className={`flex flex-wrap gap-1 mt-2 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            {Object.keys(DEVICE_MODELS[model].frameColor).map((colorKey) => (
              <button key={colorKey} onClick={() => setDeviceColor(colorKey)}
                className={`w-6 h-6 rounded-full border-2 transition-all shadow-sm ${deviceColor === colorKey ? 'border-blue-500 scale-110 ring-2 ring-blue-100' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: DEVICE_MODELS[model].frameColor[colorKey] }} title={colorKey} />
            ))}
          </div>
        </section>

        {/* 布局 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Layout size={14} /> 布局
          </h3>
          <div className="flex gap-1 mb-2">
            {LAYOUT_MODES.map(mode => (
              <button key={mode.id} onClick={() => setLayout(mode.id)}
                className={`flex-1 py-1.5 text-xs border rounded-lg transition-all ${layout === mode.id ? 'bg-gray-800 text-white border-gray-800' : (isDark ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600')}`}>
                {mode.icon} {mode.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <label className={`flex items-center gap-1.5 text-xs cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <input type="checkbox" checked={hasShadow} onChange={(e) => setHasShadow(e.target.checked)} className="rounded text-blue-600" />
              投影
            </label>
            <label className={`flex items-center gap-1.5 text-xs cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <input type="checkbox" checked={isLandscape} onChange={(e) => setIsLandscape(e.target.checked)} className="rounded text-blue-600" />
              <RotateCw size={12} /> 横屏
            </label>
            <label className={`flex items-center gap-1.5 text-xs cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <input type="checkbox" checked={enableAnimation} onChange={(e) => setEnableAnimation(e.target.checked)} className="rounded text-blue-600" />
              <Sparkles size={12} /> 动画
            </label>
          </div>
        </section>

        {/* 3D 效果 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Box size={14} /> 3D 效果
          </h3>
          <div className="grid grid-cols-6 gap-1 mb-2">
            {PRESET_ANGLES.map(preset => (
              <button key={preset.id} onClick={() => applyPreset(preset)}
                className={`flex flex-col items-center p-1 border rounded transition-all ${isDark ? 'border-gray-600 hover:border-blue-400' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'}`} title={preset.name}>
                <span className="text-sm">{preset.icon}</span>
                <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{preset.name}</span>
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs w-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>X</span>
              <input type="range" min="-30" max="30" value={rotateX} onChange={(e) => setRotateX(parseInt(e.target.value))} className="flex-1 accent-blue-600 h-1 rounded-lg appearance-none cursor-pointer" />
              <span className={`text-xs w-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{rotateX}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs w-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Y</span>
              <input type="range" min="-45" max="45" value={rotateY} onChange={(e) => setRotateY(parseInt(e.target.value))} className="flex-1 accent-blue-600 h-1 rounded-lg appearance-none cursor-pointer" />
              <span className={`text-xs w-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{rotateY}°</span>
            </div>
          </div>
        </section>

        {/* 文字标注 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Type size={14} /> 文字标注
          </h3>
          <label className={`flex items-center gap-2 text-xs cursor-pointer mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <input type="checkbox" checked={isEditingText} onChange={(e) => setIsEditingText(e.target.checked)} className="rounded text-blue-600" />
            编辑模式（可拖拽）
          </label>
          {/* 标题 */}
          <div className={`p-2 rounded-lg mb-2 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>标题</span>
              <input type="checkbox" checked={annotation.title.visible} onChange={(e) => updateAnnotation('title', 'visible', e.target.checked)} className="rounded text-blue-600" />
            </div>
            {annotation.title.visible && (
              <div className="space-y-1.5">
                <input type="text" value={annotation.title.text} onChange={(e) => updateAnnotation('title', 'text', e.target.value)} placeholder="输入标题"
                  className={`w-full text-sm px-2 py-1 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} />
                <div className="flex gap-1.5 flex-wrap">
                  <input type="number" value={annotation.title.fontSize} onChange={(e) => updateAnnotation('title', 'fontSize', parseInt(e.target.value))}
                    className={`w-12 text-xs px-1.5 py-1 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} min="12" max="120" />
                  <input type="color" value={annotation.title.color} onChange={(e) => updateAnnotation('title', 'color', e.target.value)} className="w-7 h-7 p-0 border-0 rounded cursor-pointer" />
                  <select value={annotation.title.fontWeight} onChange={(e) => updateAnnotation('title', 'fontWeight', e.target.value)}
                    className={`text-xs px-1 py-1 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}>
                    <option value="normal">常规</option>
                    <option value="bold">粗体</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-1">
                  {FONT_STYLES.map(style => (
                    <button key={style.id} onClick={() => updateAnnotation('title', 'fontStyle', style.id)}
                      className={`text-xs px-1.5 py-0.5 border rounded ${annotation.title.fontStyle === style.id ? 'border-blue-500 bg-blue-50 text-blue-700' : (isDark ? 'border-gray-600' : 'border-gray-200')}`}>
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 副标题 */}
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>副标题</span>
              <input type="checkbox" checked={annotation.subtitle.visible} onChange={(e) => updateAnnotation('subtitle', 'visible', e.target.checked)} className="rounded text-blue-600" />
            </div>
            {annotation.subtitle.visible && (
              <div className="space-y-1.5">
                <input type="text" value={annotation.subtitle.text} onChange={(e) => updateAnnotation('subtitle', 'text', e.target.value)} placeholder="输入副标题"
                  className={`w-full text-sm px-2 py-1 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} />
                <div className="flex gap-1.5">
                  <input type="number" value={annotation.subtitle.fontSize} onChange={(e) => updateAnnotation('subtitle', 'fontSize', parseInt(e.target.value))}
                    className={`w-12 text-xs px-1.5 py-1 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} min="12" max="72" />
                  <input type="color" value={annotation.subtitle.color} onChange={(e) => updateAnnotation('subtitle', 'color', e.target.value)} className="w-7 h-7 p-0 border-0 rounded cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 水印 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Type size={14} /> 水印
          </h3>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <label className={`flex items-center gap-2 text-xs cursor-pointer mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <input type="checkbox" checked={watermark.visible} onChange={(e) => setWatermark({ ...watermark, visible: e.target.checked })} className="rounded text-blue-600" />
              显示水印
            </label>
            {watermark.visible && (
              <div className="space-y-2">
                <input type="text" value={watermark.text} onChange={(e) => setWatermark({ ...watermark, text: e.target.value })} placeholder="水印文字"
                  className={`w-full text-sm px-2 py-1 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`} />
                <div>
                  <div className={`flex justify-between text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><span>透明度</span><span>{Math.round(watermark.opacity * 100)}%</span></div>
                  <input type="range" min="0.05" max="0.5" step="0.05" value={watermark.opacity} onChange={(e) => setWatermark({ ...watermark, opacity: parseFloat(e.target.value) })} className="w-full accent-blue-600 h-1 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 背景 */}
        <section>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Palette size={14} /> 背景
          </h3>
          <div className="grid grid-cols-6 gap-1 mb-2">
            {BACKGROUNDS.map(bg => (
              <button key={bg.id} onClick={() => setBackground(bg)}
                className={`w-full aspect-square rounded-lg border-2 overflow-hidden shadow-sm transition-all ${background.id === bg.id ? 'border-blue-600 scale-105' : 'border-transparent hover:border-gray-300'}`}
                style={bg.type === 'solid' || bg.type === 'gradient' ? { background: bg.value } : {}}>
                {bg.type === 'custom-glass' && <div className={`w-full h-full flex items-center justify-center text-[8px] ${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>Glass</div>}
              </button>
            ))}
            <button onClick={() => setBackground({ id: 'custom', type: 'solid', value: customBgColor })}
              className={`w-full aspect-square rounded-lg border-2 flex items-center justify-center ${background.id === 'custom' ? 'border-blue-600' : (isDark ? 'border-gray-600' : 'border-gray-200')}`}>
              <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: customBgColor }}></div>
            </button>
          </div>
          {background.id === 'custom' && (
            <div className="flex items-center gap-2 mb-2">
              <input type="color" value={customBgColor} onChange={(e) => setCustomBgColor(e.target.value)} className="h-6 w-6 p-0 border-0 rounded cursor-pointer" />
              <span className={`text-xs uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{customBgColor}</span>
            </div>
          )}
          {/* 自定义背景图 */}
          <div className="relative">
            <input type="file" accept="image/*" onChange={onBgImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <button className={`w-full py-1.5 text-xs border rounded-lg flex items-center justify-center gap-1 ${isDark ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              <ImagePlus size={12} /> {customBgImage ? '更换背景图' : '上传背景图'}
            </button>
          </div>
        </section>

        {/* 导出 */}
        <section className="pb-8">
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            <Download size={14} /> 导出
          </h3>
          <div className="mb-2">
            <div className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>分辨率</div>
            <div className="flex gap-1">
              {[1, 2, 3].map(r => (
                <button key={r} onClick={() => setExportRes(r)}
                  className={`flex-1 py-1 text-xs border rounded ${exportRes === r ? 'bg-blue-100 text-blue-700 border-blue-200 font-bold' : (isDark ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600')}`}>
                  {r === 1 ? '1080p' : r === 2 ? '2K' : '4K'}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <div className={`text-xs mb-1 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><Ratio size={10} /> 比例</div>
            <div className="flex flex-wrap gap-1">
              {EXPORT_RATIOS.map(r => (
                <button key={r.id} onClick={() => setExportRatio(r)}
                  className={`px-2 py-0.5 text-xs border rounded ${exportRatio.id === r.id ? 'bg-blue-100 text-blue-700 border-blue-200 font-bold' : (isDark ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600')}`}>
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onExport} disabled={isExporting}
            className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mb-2">
            {isExporting ? '生成中...' : '下载生成图'} <Download size={14} />
          </button>
          <button onClick={onBatchExport} disabled={isExporting}
            className={`w-full py-1.5 rounded-xl font-medium border transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-xs ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
            批量导出（所有比例）
          </button>
        </section>
      </div>
    </div>
  );
}
