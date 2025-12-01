import { useState } from 'react';
import { 
  Upload, Download, Smartphone, Layout, Palette, Image as ImageIcon, 
  Box, RotateCcw, Type, Save, Layers, Ratio
} from 'lucide-react';
import { BACKGROUNDS, DEVICE_MODELS, PRESET_ANGLES, EXPORT_RATIOS } from '../config/constants';

export default function ControlPanel({
  screenshot,
  screenshot2,
  onImageUpload,
  onImageUpload2,
  model,
  setModel,
  deviceColor,
  setDeviceColor,
  background,
  setBackground,
  customBgColor,
  setCustomBgColor,
  layout,
  setLayout,
  fitMode,
  setFitMode,
  scale,
  setScale,
  position,
  setPosition,
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
  onDeleteTemplate
}) {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // 按品牌分组机型
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
      [type]: {
        ...annotation[type],
        [field]: value,
      }
    });
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    onSaveTemplate(newTemplateName.trim());
    setNewTemplateName('');
    setShowTemplateModal(false);
  };

  return (
    <div className="w-full md:w-[380px] bg-white border-r border-gray-200 h-auto md:h-screen overflow-y-auto flex-shrink-0 z-20 shadow-xl">
      <div className="p-6 sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          App Mockup Studio
        </h1>
        <p className="text-xs text-gray-500 mt-1">让产品截图更有质感</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* 模板 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Layers size={16} /> 模板
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {templates.map(template => (
              <div key={template.id} className="relative group">
                <button
                  onClick={() => onApplyTemplate(template)}
                  className="text-xs py-1.5 px-2.5 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  {template.name}
                </button>
                {template.isCustom && (
                  <button
                    onClick={() => onDeleteTemplate(template.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Save size={12} /> 保存当前为模板
          </button>
          
          {showTemplateModal && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="模板名称"
                className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded mb-2"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveTemplate} className="text-xs px-3 py-1 bg-blue-600 text-white rounded">保存</button>
                <button onClick={() => setShowTemplateModal(false)} className="text-xs px-3 py-1 bg-gray-200 rounded">取消</button>
              </div>
            </div>
          )}
        </section>

        {/* 上传 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Upload size={16} /> 截图上传
          </h3>
          
          <div className={`grid gap-3 ${layout === 'double' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/png, image/jpeg"
                onChange={onImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition-colors group-hover:border-blue-500 group-hover:bg-blue-50">
                {screenshot ? (
                  <div className="relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={screenshot} alt="Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                      更换
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 py-2">
                    <ImageIcon size={20} className="mb-1" />
                    <span className="text-xs">{layout === 'double' ? '图片 1' : '点击上传'}</span>
                  </div>
                )}
              </div>
            </div>

            {layout === 'double' && (
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg"
                  onChange={onImageUpload2}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition-colors group-hover:border-blue-500 group-hover:bg-blue-50">
                  {screenshot2 ? (
                    <div className="relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={screenshot2} alt="Preview 2" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                        更换
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 py-2">
                      <ImageIcon size={20} className="mb-1" />
                      <span className="text-xs">图片 2</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {screenshot && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                <span>填充</span>
                <div className="flex bg-gray-200 rounded p-0.5">
                  <button onClick={() => setFitMode('cover')} className={`px-2 py-0.5 rounded ${fitMode === 'cover' ? 'bg-white shadow-sm' : ''}`}>Fill</button>
                  <button onClick={() => setFitMode('contain')} className={`px-2 py-0.5 rounded ${fitMode === 'contain' ? 'bg-white shadow-sm' : ''}`}>Fit</button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500"><span>缩放</span><span>{(scale * 100).toFixed(0)}%</span></div>
                <input type="range" min="0.5" max="2" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              </div>
            </div>
          )}
        </section>

        {/* 机型设置 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Smartphone size={16} /> 机型
          </h3>
          
          {Object.entries(groupedModels).map(([brand, models]) => (
            <div key={brand} className="mb-2">
              <div className="text-xs text-gray-400 mb-1">{brandNames[brand] || brand}</div>
              <div className="grid grid-cols-2 gap-1">
                {models.map(({ key, name }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setModel(key);
                      const firstColor = Object.keys(DEVICE_MODELS[key].frameColor)[0];
                      setDeviceColor(firstColor);
                    }}
                    className={`text-xs py-1 px-2 border rounded transition-all truncate ${model === key ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
            {Object.keys(DEVICE_MODELS[model].frameColor).map((colorKey) => (
              <button
                key={colorKey}
                onClick={() => setDeviceColor(colorKey)}
                className={`w-6 h-6 rounded-full border-2 transition-all shadow-sm ${deviceColor === colorKey ? 'border-blue-500 scale-110 ring-2 ring-blue-100' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: DEVICE_MODELS[model].frameColor[colorKey] }}
                title={colorKey}
              />
            ))}
          </div>
        </section>

        {/* 布局 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Layout size={16} /> 布局
          </h3>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setLayout('single')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border rounded-lg ${layout === 'single' ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200'}`}>
              <Smartphone size={12} /> 单设备
            </button>
            <button onClick={() => setLayout('double')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border rounded-lg ${layout === 'double' ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200'}`}>
              <div className="flex"><Smartphone size={12} /><Smartphone size={12} className="-ml-1" /></div> 双展示
            </button>
          </div>
          
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input type="checkbox" checked={hasShadow} onChange={(e) => setHasShadow(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
            <span>设备投影</span>
          </label>
        </section>

        {/* 3D 效果 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Box size={16} /> 3D 效果
          </h3>
          
          <div className="grid grid-cols-6 gap-1 mb-3">
            {PRESET_ANGLES.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="flex flex-col items-center p-1 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-all"
                title={preset.name}
              >
                <span className="text-sm">{preset.icon}</span>
                <span className="text-[9px] text-gray-500">{preset.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-8">X</span>
              <input type="range" min="-30" max="30" step="1" value={rotateX} onChange={(e) => setRotateX(parseInt(e.target.value))} className="flex-1 accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              <span className="text-xs text-gray-500 w-8">{rotateX}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-8">Y</span>
              <input type="range" min="-45" max="45" step="1" value={rotateY} onChange={(e) => setRotateY(parseInt(e.target.value))} className="flex-1 accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              <span className="text-xs text-gray-500 w-8">{rotateY}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-8">深度</span>
              <input type="range" min="500" max="2000" step="50" value={perspective} onChange={(e) => setPerspective(parseInt(e.target.value))} className="flex-1 accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              <span className="text-xs text-gray-500 w-8">{perspective}</span>
            </div>
          </div>
          
          <button 
            onClick={() => { setRotateX(0); setRotateY(0); setPerspective(1000); }}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
          >
            <RotateCcw size={10} /> 重置
          </button>
        </section>

        {/* 文字标注 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Type size={16} /> 文字标注
          </h3>
          
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer mb-3">
            <input 
              type="checkbox" 
              checked={isEditingText} 
              onChange={(e) => setIsEditingText(e.target.checked)} 
              className="rounded text-blue-600 focus:ring-blue-500" 
            />
            <span>编辑模式（可拖拽文字位置）</span>
          </label>

          {/* 标题 */}
          <div className="p-2 bg-gray-50 rounded-lg mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">标题</span>
              <input 
                type="checkbox" 
                checked={annotation.title.visible} 
                onChange={(e) => updateAnnotation('title', 'visible', e.target.checked)}
                className="rounded text-blue-600"
              />
            </div>
            {annotation.title.visible && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={annotation.title.text}
                  onChange={(e) => updateAnnotation('title', 'text', e.target.value)}
                  placeholder="输入标题"
                  className="w-full text-sm px-2 py-1 border border-gray-200 rounded"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={annotation.title.fontSize}
                    onChange={(e) => updateAnnotation('title', 'fontSize', parseInt(e.target.value))}
                    className="w-16 text-xs px-2 py-1 border border-gray-200 rounded"
                    min="12"
                    max="120"
                  />
                  <input
                    type="color"
                    value={annotation.title.color}
                    onChange={(e) => updateAnnotation('title', 'color', e.target.value)}
                    className="w-8 h-7 p-0 border-0 rounded cursor-pointer"
                  />
                  <select
                    value={annotation.title.fontWeight}
                    onChange={(e) => updateAnnotation('title', 'fontWeight', e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-200 rounded"
                  >
                    <option value="normal">常规</option>
                    <option value="bold">粗体</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 副标题 */}
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">副标题</span>
              <input 
                type="checkbox" 
                checked={annotation.subtitle.visible} 
                onChange={(e) => updateAnnotation('subtitle', 'visible', e.target.checked)}
                className="rounded text-blue-600"
              />
            </div>
            {annotation.subtitle.visible && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={annotation.subtitle.text}
                  onChange={(e) => updateAnnotation('subtitle', 'text', e.target.value)}
                  placeholder="输入副标题"
                  className="w-full text-sm px-2 py-1 border border-gray-200 rounded"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={annotation.subtitle.fontSize}
                    onChange={(e) => updateAnnotation('subtitle', 'fontSize', parseInt(e.target.value))}
                    className="w-16 text-xs px-2 py-1 border border-gray-200 rounded"
                    min="12"
                    max="72"
                  />
                  <input
                    type="color"
                    value={annotation.subtitle.color}
                    onChange={(e) => updateAnnotation('subtitle', 'color', e.target.value)}
                    className="w-8 h-7 p-0 border-0 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 背景 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Palette size={16} /> 背景
          </h3>
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg.id}
                onClick={() => setBackground(bg)}
                className={`w-full aspect-square rounded-lg border-2 overflow-hidden relative shadow-sm transition-all ${background.id === bg.id ? 'border-blue-600 scale-105' : 'border-transparent hover:border-gray-200'}`}
                style={bg.type !== 'image' && bg.type !== 'custom-glass' ? { background: bg.value } : {}}
              >
                {bg.type === 'image' && <img src={bg.value.replace('url("','').replace('")','')} className="w-full h-full object-cover" alt="bg" />}
                {bg.type === 'custom-glass' && <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-500">Glass</div>}
              </button>
            ))}
            <button
              onClick={() => setBackground({ id: 'custom', type: 'solid', value: customBgColor })}
              className={`w-full aspect-square rounded-lg border-2 flex items-center justify-center bg-white ${background.id === 'custom' ? 'border-blue-600' : 'border-gray-200'}`}
            >
              <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: customBgColor }}></div>
            </button>
          </div>
          
          {background.id === 'custom' && (
            <div className="flex items-center gap-2">
              <input type="color" value={customBgColor} onChange={(e) => setCustomBgColor(e.target.value)} className="h-7 w-8 p-0 border-0 rounded overflow-hidden cursor-pointer" />
              <span className="text-xs text-gray-500 uppercase">{customBgColor}</span>
            </div>
          )}
        </section>

        {/* 导出设置 */}
        <section className="pb-10">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Download size={16} /> 导出
          </h3>
          
          {/* 分辨率 */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1.5">分辨率</div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(r => (
                <button 
                  key={r}
                  onClick={() => setExportRes(r)}
                  className={`flex-1 py-1 text-xs border rounded ${exportRes === r ? 'bg-blue-100 text-blue-700 border-blue-200 font-bold' : 'text-gray-600 border-gray-200'}`}
                >
                  {r === 1 ? '1080p' : r === 2 ? '2K' : '4K'}
                </button>
              ))}
            </div>
          </div>

          {/* 比例 */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
              <Ratio size={12} /> 导出比例
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EXPORT_RATIOS.map(r => (
                <button 
                  key={r.id}
                  onClick={() => setExportRatio(r)}
                  className={`px-2 py-1 text-xs border rounded ${exportRatio.id === r.id ? 'bg-blue-100 text-blue-700 border-blue-200 font-bold' : 'text-gray-600 border-gray-200'}`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* 导出按钮 */}
          <button 
            onClick={onExport}
            disabled={isExporting}
            className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mb-2"
          >
            {isExporting ? '生成中...' : '下载生成图'}
            <Download size={16} />
          </button>

          {/* 批量导出 */}
          <button 
            onClick={onBatchExport}
            disabled={isExporting}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2 rounded-xl font-medium border border-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
          >
            批量导出（所有比例）
          </button>
        </section>
      </div>
    </div>
  );
}
