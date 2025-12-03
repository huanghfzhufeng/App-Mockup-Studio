import { useState, useMemo } from 'react';
import {
  Smartphone, Layout, Palette, Box, RotateCcw, Type, Save, Layers, 
  Moon, Sun, RotateCw, Sparkles, ImagePlus, ChevronDown, Plus, Trash2, Maximize
} from 'lucide-react';
import { BACKGROUNDS, DEVICE_MODELS, PRESET_ANGLES, FONT_STYLES, LAYOUT_MODES } from '../config/constants';
import { useAppStore } from '../store/useAppStore';
import SmallButton from './ui/SmallButton';

// 预设画布尺寸
const CANVAS_PRESETS = [
  { id: 'auto', name: '自适应', width: 600, height: 900, autoFit: true },
  { id: 'instagram', name: 'Instagram', width: 1080, height: 1080, autoFit: false },
  { id: 'instagram-story', name: 'Story', width: 1080, height: 1920, autoFit: false },
  { id: 'twitter', name: 'Twitter', width: 1200, height: 675, autoFit: false },
  { id: 'dribbble', name: 'Dribbble', width: 1600, height: 1200, autoFit: false },
  { id: 'appstore', name: 'App Store', width: 1290, height: 2796, autoFit: false },
];

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

export default function ControlPanel({
  onBgImageUpload,
  templates,
  onSaveTemplate,
  onApplyTemplate,
  onDeleteTemplate,
}) {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    brand: 'custom',
    ratio: 9 / 19.5,
    bezelWidth: 12,
    cornerRadius: 48,
    screenRadius: 40,
    islandType: 'dynamic-island',
    frameColor: '#1c1c1e',
  });

  // 从 store 获取状态
  const {
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
    hasShadow,
    setHasShadow,
    rotateX,
    setRotateX,
    rotateY,
    setRotateY,
    perspective,
    setPerspective,
    applyPreset,
    annotation,
    updateAnnotation,
    isEditingText,
    setIsEditingText,
    isLandscape,
    setIsLandscape,
    enableAnimation,
    setEnableAnimation,
    watermark,
    setWatermark,
    isDark,
    toggleDark,
    resetAll,
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistory,
    canvasSize,
    setCanvasSize,
    customDevices,
    addCustomDevice,
    removeCustomDevice,
    // 画布设备管理
    canvasDevices,
    selectedDeviceId,
    addDeviceToCanvas,
    removeDeviceFromCanvas,
    updateCanvasDevice,
    selectCanvasDevice,
    duplicateCanvasDevice,
    clearAllCanvasDevices,
  } = useAppStore();

  // 合并内置机型和自定义机型
  const allDevices = useMemo(() => {
    return { ...DEVICE_MODELS, ...customDevices };
  }, [customDevices]);

  // 缓存分组后的机型
  const groupedModels = useMemo(() => {
    return Object.entries(allDevices).reduce((acc, [key, config]) => {
      const brand = config.brand || 'other';
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push({ key, ...config });
      return acc;
    }, {});
  }, [allDevices]);

  const brandNames = { 
    apple: 'Apple', 
    google: 'Pixel', 
    samsung: 'Samsung',
    mac: 'MacBook',
    browser: '浏览器',
    custom: '自定义'
  };

  const handleAddDevice = () => {
    if (!newDevice.name.trim()) return;
    const id = `custom-${Date.now()}`;
    addCustomDevice(id, {
      name: newDevice.name,
      brand: 'custom',
      ratio: newDevice.ratio,
      bezelWidth: newDevice.bezelWidth,
      cornerRadius: newDevice.cornerRadius,
      screenRadius: newDevice.screenRadius,
      islandType: newDevice.islandType,
      islandWidth: newDevice.islandType === 'dynamic-island' ? 95 : 0,
      frameColor: { default: newDevice.frameColor },
    });
    setShowAddDeviceModal(false);
    setNewDevice({
      name: '',
      brand: 'custom',
      ratio: 9 / 19.5,
      bezelWidth: 12,
      cornerRadius: 48,
      screenRadius: 40,
      islandType: 'dynamic-island',
      frameColor: '#1c1c1e',
    });
  };

  const handleApplyPreset = (preset) => {
    saveHistory();
    applyPreset(preset);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    onSaveTemplate(newTemplateName.trim());
    setNewTemplateName('');
    setShowTemplateModal(false);
  };

  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？')) {
      resetAll();
    }
  };

  // 带历史记录的 setter
  const withHistory = (setter) => (value) => {
    saveHistory();
    setter(value);
  };

  return (
    <div className="w-full md:w-[320px] border-r border-border/50 h-auto md:h-screen overflow-y-auto flex-shrink-0 z-20 bg-sidebar scrollbar-thin">
      {/* 头部 */}
      <div className="p-4 sticky top-0 z-10 bg-sidebar/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">SnapShell</h1>
            <p className="text-[10px] text-muted-foreground">让产品截图更有质感</p>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={toggleDark} 
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center transition-all duration-200 btn-press"
              title={isDark ? '切换亮色' : '切换暗色'}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button 
              onClick={handleReset} 
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center transition-all duration-200 btn-press" 
              title="重置所有设置"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
        
        {/* 撤销/重做 */}
        <div className="flex gap-2">
          <button 
            onClick={undo} 
            disabled={!canUndo()}
            className="flex-1 h-8 text-xs font-medium rounded-lg bg-secondary hover:bg-accent border border-border/50 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none btn-press"
          >
            ↶ 撤销
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo()}
            className="flex-1 h-8 text-xs font-medium rounded-lg bg-secondary hover:bg-accent border border-border/50 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none btn-press"
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
            <div className="mt-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <input 
                type="text" 
                value={newTemplateName} 
                onChange={(e) => setNewTemplateName(e.target.value)} 
                placeholder="输入模板名称" 
                className="w-full h-8 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30 mb-2" 
              />
              <div className="flex gap-2">
                <button onClick={handleSaveTemplate} className="h-7 px-3 text-xs font-medium bg-foreground text-background rounded-lg btn-press">保存</button>
                <button onClick={() => setShowTemplateModal(false)} className="h-7 px-3 text-xs font-medium bg-secondary rounded-lg btn-press">取消</button>
              </div>
            </div>
          )}
        </Section>

        {/* 机型 */}
        <Section title="机型选择" icon={Smartphone}>
          {Object.entries(groupedModels).map(([brand, models]) => (
            <div key={brand} className="mb-3 last:mb-0">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{brandNames[brand]}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {models.map(({ key, name, isCustom }) => (
                  <div key={key} className="relative group">
                    <button 
                      onClick={() => { saveHistory(); setModel(key); }}
                      className={`
                        w-full text-xs h-8 px-2 rounded-lg truncate transition-all duration-200 btn-press font-medium
                        ${model === key 
                          ? 'bg-foreground text-background shadow-md' 
                          : 'bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20'
                        }
                      `}
                    >
                      {name}
                    </button>
                    {isCustom && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeCustomDevice(key); }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* 添加自定义机型按钮 */}
          <button 
            onClick={() => setShowAddDeviceModal(true)}
            className="w-full h-8 text-xs font-medium rounded-lg bg-secondary hover:bg-accent border border-dashed border-border hover:border-foreground/30 flex items-center justify-center gap-1.5 transition-all duration-200 mt-2"
          >
            <Plus size={12} /> 添加自定义机型
          </button>
          
          {/* 添加机型弹窗 */}
          {showAddDeviceModal && (
            <div className="mt-3 p-3 rounded-xl bg-secondary/50 border border-border/50 space-y-2">
              <input 
                type="text" 
                value={newDevice.name} 
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })} 
                placeholder="机型名称" 
                className="w-full h-8 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">屏幕比例</label>
                  <select 
                    value={newDevice.ratio}
                    onChange={(e) => setNewDevice({ ...newDevice, ratio: parseFloat(e.target.value) })}
                    className="w-full h-8 text-xs px-2 rounded-lg bg-background border border-border"
                  >
                    <option value={9/19.5}>9:19.5 (iPhone)</option>
                    <option value={9/20}>9:20 (Android)</option>
                    <option value={3/4}>3:4 (iPad)</option>
                    <option value={9/16}>9:16 (标准)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">刘海类型</label>
                  <select 
                    value={newDevice.islandType}
                    onChange={(e) => setNewDevice({ ...newDevice, islandType: e.target.value })}
                    className="w-full h-8 text-xs px-2 rounded-lg bg-background border border-border"
                  >
                    <option value="dynamic-island">灵动岛</option>
                    <option value="punch-hole">挖孔</option>
                    <option value="none">无</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">边框宽度</label>
                  <input 
                    type="number" 
                    value={newDevice.bezelWidth}
                    onChange={(e) => setNewDevice({ ...newDevice, bezelWidth: parseInt(e.target.value) })}
                    className="w-full h-8 text-xs px-2 rounded-lg bg-background border border-border"
                    min="4" max="30"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">圆角</label>
                  <input 
                    type="number" 
                    value={newDevice.cornerRadius}
                    onChange={(e) => setNewDevice({ ...newDevice, cornerRadius: parseInt(e.target.value) })}
                    className="w-full h-8 text-xs px-2 rounded-lg bg-background border border-border"
                    min="0" max="60"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">边框颜色</label>
                <input 
                  type="color" 
                  value={newDevice.frameColor}
                  onChange={(e) => setNewDevice({ ...newDevice, frameColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={handleAddDevice} className="h-7 px-3 text-xs font-medium bg-foreground text-background rounded-lg btn-press">添加</button>
                <button onClick={() => setShowAddDeviceModal(false)} className="h-7 px-3 text-xs font-medium bg-secondary rounded-lg btn-press">取消</button>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-full mb-1">颜色</span>
            {allDevices[model]?.frameColor && Object.keys(allDevices[model].frameColor).map((colorKey) => (
              <button 
                key={colorKey} 
                onClick={() => { saveHistory(); setDeviceColor(colorKey); }}
                className={`
                  w-7 h-7 rounded-full transition-all duration-200 btn-press
                  ${deviceColor === colorKey ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'}
                `}
                style={{ backgroundColor: allDevices[model].frameColor[colorKey], boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} 
                title={colorKey} 
              />
            ))}
          </div>
        </Section>

        {/* 画布尺寸 */}
        <Section title="画布尺寸" icon={Maximize} defaultOpen={false}>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {CANVAS_PRESETS.map(preset => (
              <button 
                key={preset.id}
                onClick={() => setCanvasSize({ width: preset.width, height: preset.height, autoFit: preset.autoFit })}
                className={`
                  text-[10px] h-7 px-1.5 rounded-lg truncate transition-all duration-200 btn-press font-medium
                  ${canvasSize?.autoFit === preset.autoFit && (preset.autoFit || (canvasSize?.width === preset.width && canvasSize?.height === preset.height))
                    ? 'bg-foreground text-background shadow-md' 
                    : 'bg-secondary hover:bg-accent border border-border/50'
                  }
                `}
              >
                {preset.name}
              </button>
            ))}
          </div>
          
          {!canvasSize?.autoFit && (
            <div className="space-y-2 p-3 rounded-xl bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-2">
                <span className="text-xs w-8 text-muted-foreground">宽度</span>
                <input 
                  type="number" 
                  value={canvasSize?.width || 600}
                  onChange={(e) => setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) || 600 })}
                  className="flex-1 h-8 text-xs px-2 rounded-lg bg-background border border-border"
                  min="200" max="4000"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8 text-muted-foreground">高度</span>
                <input 
                  type="number" 
                  value={canvasSize?.height || 900}
                  onChange={(e) => setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) || 900 })}
                  className="flex-1 h-8 text-xs px-2 rounded-lg bg-background border border-border"
                  min="200" max="4000"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
              <div className="text-[10px] text-muted-foreground text-center pt-1">
                {canvasSize?.width} × {canvasSize?.height}
              </div>
            </div>
          )}
        </Section>

        {/* 画布设备管理 */}
        <Section title="画布设备" icon={Layers} badge={canvasDevices?.length || 0}>
          {/* 快速添加设备 */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">快速添加</div>
            <div className="grid grid-cols-3 gap-1.5">
              {['iphone-16', 'iphone-15-pro', 'pixel-9-pro', 'galaxy-s24-ultra', 'ipad-pro-13', 'macbook-pro-16'].map(deviceModel => (
                <button
                  key={deviceModel}
                  onClick={() => addDeviceToCanvas(deviceModel)}
                  className="text-[10px] h-7 px-1.5 rounded-lg bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20 transition-all duration-200 btn-press font-medium truncate"
                  title={DEVICE_MODELS[deviceModel]?.name}
                >
                  {DEVICE_MODELS[deviceModel]?.name?.replace('iPhone ', '').replace('Galaxy ', '').replace('MacBook ', '')}
                </button>
              ))}
            </div>
          </div>
          
          {/* 已添加的设备列表 */}
          {canvasDevices?.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">已添加 ({canvasDevices.length})</span>
                <button 
                  onClick={clearAllCanvasDevices}
                  className="text-[10px] text-red-500 hover:text-red-400 transition-colors"
                >
                  清空全部
                </button>
              </div>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {canvasDevices.map((device, index) => {
                  const deviceConfig = allDevices[device.model];
                  return (
                    <div 
                      key={device.id}
                      onClick={() => selectCanvasDevice(device.id)}
                      className={`
                        flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200
                        ${selectedDeviceId === device.id 
                          ? 'bg-foreground/10 border border-foreground/30' 
                          : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-muted-foreground w-4">{index + 1}</span>
                        <span className="text-xs font-medium truncate">{deviceConfig?.name || device.model}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateCanvasDevice(device.id); }}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="复制"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeDeviceFromCanvas(device.id); }}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                          title="删除"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* 选中设备的配置 */}
          {selectedDeviceId && canvasDevices?.find(d => d.id === selectedDeviceId) && (
            <div className="space-y-2 pt-3 border-t border-border/50">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">设备配置</div>
              {(() => {
                const device = canvasDevices.find(d => d.id === selectedDeviceId);
                const deviceConfig = allDevices[device.model];
                return (
                  <div className="space-y-2 p-2 rounded-lg bg-secondary/30">
                    {/* 机型切换 */}
                    <select
                      value={device.model}
                      onChange={(e) => updateCanvasDevice(device.id, { 
                        model: e.target.value,
                        color: Object.keys(allDevices[e.target.value]?.frameColor || {})[0] || 'black'
                      })}
                      className="w-full h-8 text-xs px-2 rounded-lg bg-background border border-border"
                    >
                      {Object.entries(allDevices).map(([key, config]) => (
                        <option key={key} value={key}>{config.name}</option>
                      ))}
                    </select>
                    {/* 颜色选择 */}
                    <div className="flex flex-wrap gap-1.5">
                      {deviceConfig?.frameColor && Object.keys(deviceConfig.frameColor).map((colorKey) => (
                        <button 
                          key={colorKey}
                          onClick={() => updateCanvasDevice(device.id, { color: colorKey })}
                          className={`w-6 h-6 rounded-full transition-all ${device.color === colorKey ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background scale-110' : 'hover:scale-105'}`}
                          style={{ backgroundColor: deviceConfig.frameColor[colorKey] }}
                          title={colorKey}
                        />
                      ))}
                    </div>
                    {/* 缩放 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-8">缩放</span>
                      <input 
                        type="range" 
                        min="0.3" max="2" step="0.1"
                        value={device.scale}
                        onChange={(e) => updateCanvasDevice(device.id, { scale: parseFloat(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-[10px] font-mono w-10 text-right">{Math.round(device.scale * 100)}%</span>
                    </div>
                    {/* 横屏 */}
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={device.isLandscape}
                        onChange={(e) => updateCanvasDevice(device.id, { isLandscape: e.target.checked })}
                      />
                      <span>横屏模式</span>
                    </label>
                  </div>
                );
              })()}
            </div>
          )}
        </Section>

        {/* 布局 */}
        <Section title="布局设置" icon={Layout}>
          <div className="flex gap-1.5">
            {LAYOUT_MODES.map(mode => (
              <SmallButton 
                key={mode.id} 
                active={layout === mode.id}
                onClick={() => withHistory(setLayout)(mode.id)}
                className="flex-1"
              >
                {mode.icon} {mode.name}
              </SmallButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-3">
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground">
              <input type="checkbox" checked={hasShadow} onChange={(e) => withHistory(setHasShadow)(e.target.checked)} />
              <span>投影</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground">
              <input type="checkbox" checked={isLandscape} onChange={(e) => withHistory(setIsLandscape)(e.target.checked)} />
              <RotateCw size={10} className="text-muted-foreground" />
              <span>横屏</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground">
              <input type="checkbox" checked={enableAnimation} onChange={(e) => setEnableAnimation(e.target.checked)} />
              <Sparkles size={10} className="text-muted-foreground" />
              <span>动画</span>
            </label>
          </div>
        </Section>

        {/* 3D 效果 */}
        <Section title="3D 效果" icon={Box}>
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PRESET_ANGLES.map(preset => (
              <button 
                key={preset.id} 
                onClick={() => handleApplyPreset(preset)}
                className="flex flex-col items-center p-1.5 rounded-lg bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20 transition-all duration-200 btn-press group" 
                title={preset.name}
              >
                <span className="text-base">{preset.icon}</span>
                <span className="text-[8px] text-muted-foreground group-hover:text-foreground">{preset.name}</span>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs w-5 text-muted-foreground">X</span>
              <input type="range" min="-30" max="30" value={rotateX} onChange={(e) => setRotateX(parseInt(e.target.value))} className="flex-1" />
              <span className="text-xs w-8 text-right font-mono text-foreground">{rotateX}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-5 text-muted-foreground">Y</span>
              <input type="range" min="-45" max="45" value={rotateY} onChange={(e) => setRotateY(parseInt(e.target.value))} className="flex-1" />
              <span className="text-xs w-8 text-right font-mono text-foreground">{rotateY}°</span>
            </div>
          </div>
        </Section>

        {/* 文字标注 */}
        <Section title="文字标注" icon={Type} defaultOpen={false}>
          <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground mb-3">
            <input type="checkbox" checked={isEditingText} onChange={(e) => setIsEditingText(e.target.checked)} />
            <span>编辑模式（可拖拽文字）</span>
          </label>
          
          {/* 标题 */}
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">标题</span>
              <input type="checkbox" checked={annotation.title.visible} onChange={(e) => updateAnnotation('title', 'visible', e.target.checked)} />
            </div>
            {annotation.title.visible && (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={annotation.title.text} 
                  onChange={(e) => updateAnnotation('title', 'text', e.target.value)} 
                  placeholder="输入标题"
                  className="w-full h-8 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                />
                <div className="flex gap-2 flex-wrap">
                  <input 
                    type="number" 
                    value={annotation.title.fontSize} 
                    onChange={(e) => updateAnnotation('title', 'fontSize', parseInt(e.target.value))}
                    className="w-14 h-8 text-xs px-2 rounded-lg bg-background border border-border" 
                    min="12" max="120" 
                  />
                  <input 
                    type="color" 
                    value={annotation.title.color} 
                    onChange={(e) => updateAnnotation('title', 'color', e.target.value)} 
                    className="w-8 h-8 rounded-lg cursor-pointer" 
                  />
                  <select 
                    value={annotation.title.fontWeight} 
                    onChange={(e) => updateAnnotation('title', 'fontWeight', e.target.value)}
                    className="h-8 text-xs px-2 rounded-lg bg-background border border-border"
                  >
                    <option value="normal">常规</option>
                    <option value="bold">粗体</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-1">
                  {FONT_STYLES.map(style => (
                    <SmallButton 
                      key={style.id} 
                      active={annotation.title.fontStyle === style.id}
                      onClick={() => updateAnnotation('title', 'fontStyle', style.id)}
                      className="text-[10px] h-6 px-2"
                    >
                      {style.name}
                    </SmallButton>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 副标题 */}
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">副标题</span>
              <input type="checkbox" checked={annotation.subtitle.visible} onChange={(e) => updateAnnotation('subtitle', 'visible', e.target.checked)} />
            </div>
            {annotation.subtitle.visible && (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={annotation.subtitle.text} 
                  onChange={(e) => updateAnnotation('subtitle', 'text', e.target.value)} 
                  placeholder="输入副标题"
                  className="w-full h-8 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={annotation.subtitle.fontSize} 
                    onChange={(e) => updateAnnotation('subtitle', 'fontSize', parseInt(e.target.value))}
                    className="w-14 h-8 text-xs px-2 rounded-lg bg-background border border-border" 
                    min="12" max="72" 
                  />
                  <input 
                    type="color" 
                    value={annotation.subtitle.color} 
                    onChange={(e) => updateAnnotation('subtitle', 'color', e.target.value)} 
                    className="w-8 h-8 rounded-lg cursor-pointer" 
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 水印 */}
        <Section title="水印" icon={Type} defaultOpen={false}>
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
            <label className="flex items-center gap-2 text-xs cursor-pointer text-foreground mb-2">
              <input type="checkbox" checked={watermark.visible} onChange={(e) => setWatermark({ ...watermark, visible: e.target.checked })} />
              <span>显示水印</span>
            </label>
            {watermark.visible && (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={watermark.text} 
                  onChange={(e) => setWatermark({ ...watermark, text: e.target.value })} 
                  placeholder="水印文字"
                  className="w-full h-8 text-sm px-3 rounded-lg bg-background border border-border focus:border-foreground/30" 
                />
                <div>
                  <div className="flex justify-between text-xs mb-1">
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
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {BACKGROUNDS.map(bg => (
              <button 
                key={bg.id} 
                onClick={() => setBackground(bg)}
                className={`
                  w-full aspect-square rounded-lg overflow-hidden transition-all duration-200 btn-press
                  ${background.id === bg.id ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background scale-105' : 'hover:scale-105'}
                `}
                style={bg.type === 'solid' || bg.type === 'gradient' ? { background: bg.value, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } : {}}
              >
                {bg.type === 'custom-glass' && <div className="w-full h-full flex items-center justify-center text-[7px] font-medium bg-secondary text-muted-foreground">Glass</div>}
              </button>
            ))}
            <button 
              onClick={() => setBackground({ id: 'custom', type: 'solid', value: customBgColor })}
              className={`
                w-full aspect-square rounded-lg flex items-center justify-center bg-secondary border-2 border-dashed transition-all duration-200 btn-press
                ${background.id === 'custom' ? 'border-foreground' : 'border-border hover:border-foreground/30'}
              `}
            >
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: customBgColor }}></div>
            </button>
          </div>
          {background.id === 'custom' && (
            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-secondary/30">
              <input type="color" value={customBgColor} onChange={(e) => setCustomBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
              <span className="text-xs font-mono uppercase text-muted-foreground">{customBgColor}</span>
            </div>
          )}
          <div className="relative">
            <input type="file" accept="image/*" onChange={onBgImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <button className="w-full h-9 text-xs font-medium rounded-lg bg-secondary hover:bg-accent border border-border/50 hover:border-foreground/20 flex items-center justify-center gap-2 transition-all duration-200">
              <ImagePlus size={12} /> {customBgImage ? '更换背景图' : '上传背景图'}
            </button>
          </div>
        </Section>
      </div>
      
      <div className="h-6"></div>
    </div>
  );
}
