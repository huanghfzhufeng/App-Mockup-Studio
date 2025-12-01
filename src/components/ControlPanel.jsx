import { Upload, Download, Smartphone, Layout, Palette, Image as ImageIcon, Box, RotateCcw } from 'lucide-react';
import { BACKGROUNDS, DEVICE_MODELS, PRESET_ANGLES } from '../config/constants';

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
  onExport,
  isExporting,
  rotateX,
  setRotateX,
  rotateY,
  setRotateY,
  perspective,
  setPerspective
}) {
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

  return (
    <div className="w-full md:w-[360px] bg-white border-r border-gray-200 h-auto md:h-screen overflow-y-auto flex-shrink-0 z-20 shadow-xl">
      <div className="p-6 sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          App Mockup Studio
        </h1>
        <p className="text-xs text-gray-500 mt-1">让产品截图更有质感</p>
      </div>

      <div className="p-6 space-y-8">
        {/* 上传 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Upload size={16} /> 截图上传
          </h3>
          
          <div className={`grid gap-3 ${layout === 'double' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* 第一张图 */}
            <div className="relative group">
              <input 
                type="file" 
                accept="image/png, image/jpeg"
                onChange={onImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition-colors group-hover:border-blue-500 group-hover:bg-blue-50">
                {screenshot ? (
                  <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={screenshot} alt="Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                      更换
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 py-2">
                    <ImageIcon size={24} className="mb-1" />
                    <span className="text-xs">{layout === 'double' ? '图片 1' : '点击上传'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 第二张图 - 仅双展示模式 */}
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
                    <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={screenshot2} alt="Preview 2" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                        更换
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 py-2">
                      <ImageIcon size={24} className="mb-1" />
                      <span className="text-xs">图片 2</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {screenshot && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                <span>填充方式</span>
                <div className="flex bg-gray-200 rounded p-0.5">
                  <button onClick={() => setFitMode('cover')} className={`px-2 py-0.5 rounded ${fitMode === 'cover' ? 'bg-white shadow-sm' : ''}`}>Fill</button>
                  <button onClick={() => setFitMode('contain')} className={`px-2 py-0.5 rounded ${fitMode === 'contain' ? 'bg-white shadow-sm' : ''}`}>Fit</button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500"><span>缩放</span><span>{(scale * 100).toFixed(0)}%</span></div>
                <input type="range" min="0.5" max="2" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500"><span>Y 轴偏移</span><span>{position.y}px</span></div>
                <input type="range" min="-100" max="100" step="1" value={position.y} onChange={(e) => setPosition({...position, y: parseInt(e.target.value)})} className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              </div>
            </div>
          )}
        </section>

        {/* 机型设置 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Smartphone size={16} /> 机型选择
          </h3>
          
          {Object.entries(groupedModels).map(([brand, models]) => (
            <div key={brand} className="mb-3">
              <div className="text-xs text-gray-400 mb-1.5">{brandNames[brand] || brand}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {models.map(({ key, name }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setModel(key);
                      // 切换机型时重置颜色为第一个
                      const firstColor = Object.keys(DEVICE_MODELS[key].frameColor)[0];
                      setDeviceColor(firstColor);
                    }}
                    className={`text-xs py-1.5 px-2 border rounded-lg transition-all truncate ${model === key ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {Object.keys(DEVICE_MODELS[model].frameColor).map((colorKey) => (
              <button
                key={colorKey}
                onClick={() => setDeviceColor(colorKey)}
                className={`w-7 h-7 rounded-full border-2 transition-all shadow-sm ${deviceColor === colorKey ? 'border-blue-500 scale-110 ring-2 ring-blue-100' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: DEVICE_MODELS[model].frameColor[colorKey] }}
                title={colorKey}
              />
            ))}
          </div>
        </section>

        {/* 布局与效果 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Layout size={16} /> 布局与效果
          </h3>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setLayout('single')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs border rounded-lg ${layout === 'single' ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200'}`}>
              <Smartphone size={14} /> 单设备
            </button>
            <button onClick={() => setLayout('double')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs border rounded-lg ${layout === 'double' ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200'}`}>
              <div className="flex"><Smartphone size={14} /><Smartphone size={14} className="-ml-1.5" /></div> 双展示
            </button>
          </div>
          
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={hasShadow} onChange={(e) => setHasShadow(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
            <span>启用设备投影</span>
          </label>
        </section>

        {/* 3D 效果 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Box size={16} /> 3D 效果
          </h3>
          
          {/* 预设角度 */}
          <div className="grid grid-cols-6 gap-1.5 mb-4">
            {PRESET_ANGLES.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="flex flex-col items-center p-1.5 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                title={preset.name}
              >
                <span className="text-lg">{preset.icon}</span>
                <span className="text-[10px] text-gray-500 mt-0.5">{preset.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>X 轴旋转</span>
                <span>{rotateX}°</span>
              </div>
              <input 
                type="range" 
                min="-30" 
                max="30" 
                step="1" 
                value={rotateX} 
                onChange={(e) => setRotateX(parseInt(e.target.value))} 
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Y 轴旋转</span>
                <span>{rotateY}°</span>
              </div>
              <input 
                type="range" 
                min="-45" 
                max="45" 
                step="1" 
                value={rotateY} 
                onChange={(e) => setRotateY(parseInt(e.target.value))} 
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>透视深度</span>
                <span>{perspective}px</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="2000" 
                step="50" 
                value={perspective} 
                onChange={(e) => setPerspective(parseInt(e.target.value))} 
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <button 
              onClick={() => { setRotateX(0); setRotateY(0); setPerspective(1000); }}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <RotateCcw size={12} /> 重置 3D
            </button>
          </div>
        </section>

        {/* 背景 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Palette size={16} /> 背景风格
          </h3>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg.id}
                onClick={() => setBackground(bg)}
                className={`w-full aspect-square rounded-lg border-2 overflow-hidden relative shadow-sm transition-all ${background.id === bg.id ? 'border-blue-600 scale-105' : 'border-transparent hover:border-gray-200'}`}
                style={bg.type !== 'image' && bg.type !== 'custom-glass' ? { background: bg.value } : {}}
              >
                {bg.type === 'image' && <img src={bg.value.replace('url("','').replace('")','')} className="w-full h-full object-cover" alt="bg" />}
                {bg.type === 'custom-glass' && <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">Glass</div>}
              </button>
            ))}
            <button
              onClick={() => setBackground({ id: 'custom', type: 'solid', value: customBgColor })}
              className={`w-full aspect-square rounded-lg border-2 flex items-center justify-center bg-white ${background.id === 'custom' ? 'border-blue-600' : 'border-gray-200'}`}
            >
              <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: customBgColor }}></div>
            </button>
          </div>
          
          {background.id === 'custom' && (
            <div className="flex items-center gap-2">
              <input type="color" value={customBgColor} onChange={(e) => setCustomBgColor(e.target.value)} className="h-8 w-10 p-0 border-0 rounded overflow-hidden cursor-pointer" />
              <span className="text-xs text-gray-500 uppercase">{customBgColor}</span>
            </div>
          )}
        </section>

        {/* 导出设置 */}
        <section className="pb-10">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Download size={16} /> 导出
          </h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(r => (
              <button 
                key={r}
                onClick={() => setExportRes(r)}
                className={`flex-1 py-1.5 text-xs border rounded-md ${exportRes === r ? 'bg-blue-100 text-blue-700 border-blue-200 font-bold' : 'text-gray-600 border-gray-200'}`}
              >
                {r === 1 ? '1080p' : r === 2 ? '2K' : '4K'}
              </button>
            ))}
          </div>
          <button 
            onClick={onExport}
            disabled={isExporting}
            className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isExporting ? '生成中...' : '下载生成图'}
            <Download size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}
