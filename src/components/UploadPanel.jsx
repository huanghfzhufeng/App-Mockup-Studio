import {
  Upload, Image as ImageIcon, RotateCcw, Move, Zap, Ratio
} from 'lucide-react';
import { EXPORT_RATIOS } from '../config/constants';
import { useAppStore } from '../store/useAppStore';

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

export default function UploadPanel({
  onImageUpload,
  onImageUpload2,
  onExport,
  onBatchExport,
  isExporting
}) {
  // 从 store 获取状态
  const {
    screenshot,
    screenshot2,
    layout,
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
    deviceScale1,
    setDeviceScale1,
    deviceScale2,
    setDeviceScale2,
    exportRes,
    setExportRes,
    exportRatio,
    setExportRatio,
  } = useAppStore();

  const currentPos = activeDevice === 1 ? position : position2;
  const setCurrentPos = activeDevice === 1 ? setPosition : setPosition2;

  return (
    <div className="w-full md:w-[320px] border-l border-border/50 h-auto md:h-screen overflow-y-auto flex-shrink-0 z-20 bg-sidebar scrollbar-thin">
      {/* 头部 */}
      <div className="p-4 sticky top-0 z-10 bg-sidebar/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-2">
          <Upload size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">截图上传</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 上传区域 */}
        <div className={`grid gap-3 ${layout === 'double' || layout === 'mixed' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div className="relative group">
            <input type="file" accept="image/png, image/jpeg" onChange={onImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center transition-all duration-300 group-hover:border-foreground/30 group-hover:bg-accent/30">
              {screenshot ? (
                <div className="relative w-full h-24 rounded-lg overflow-hidden bg-secondary">
                  <img src={screenshot} alt="Preview" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-muted-foreground group-hover:text-foreground transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-accent transition-colors">
                    <ImageIcon size={20} />
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
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-secondary">
                    <img src={screenshot2} alt="Preview 2" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 text-muted-foreground group-hover:text-foreground transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-accent transition-colors">
                      <ImageIcon size={20} />
                    </div>
                    <span className="text-xs font-medium">图片 2</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 图片调整 */}
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
                <span className="text-muted-foreground">图片缩放</span>
                <span className="font-mono font-medium text-foreground">{(scale * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0.5" max="2" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full" />
            </div>
          </div>
        )}

        {/* 设备缩放 */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-foreground">设备缩放</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">设备 1</span>
                <span className="font-mono text-foreground">{Math.round((deviceScale1 || 1) * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.3" 
                max="2" 
                step="0.05" 
                value={deviceScale1 || 1} 
                onChange={(e) => setDeviceScale1(parseFloat(e.target.value))} 
                className="w-full" 
              />
            </div>
            {(layout === 'double' || layout === 'mixed') && (
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">设备 2</span>
                  <span className="font-mono text-foreground">{Math.round((deviceScale2 || 1) * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.3" 
                  max="2" 
                  step="0.05" 
                  value={deviceScale2 || 1} 
                  onChange={(e) => setDeviceScale2(parseFloat(e.target.value))} 
                  className="w-full" 
                />
              </div>
            )}
            <button 
              onClick={() => { setDeviceScale1(1); setDeviceScale2(1); }} 
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={10} /> 重置缩放
            </button>
          </div>
        </div>

        {/* 移动模式 */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${moveMode ? 'border-foreground/30 bg-accent/50' : 'border-border/50 bg-secondary/30'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-foreground flex items-center gap-2">
              <Move size={12} /> 位置调整
            </span>
            <SmallButton active={moveMode} onClick={() => setMoveMode(!moveMode)}>
              {moveMode ? '✓ 移动中' : '开启'}
            </SmallButton>
          </div>
          
          {(layout === 'double' || layout === 'mixed') && (
            <div className="flex gap-2 mb-3">
              <SmallButton active={activeDevice === 1} onClick={() => setActiveDevice(1)} className="flex-1">设备 1</SmallButton>
              <SmallButton active={activeDevice === 2} onClick={() => setActiveDevice(2)} className="flex-1">设备 2</SmallButton>
            </div>
          )}
          
          {moveMode && (
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
          )}
        </div>

        {/* 导出 */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 space-y-4">
          <div>
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
          <div>
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
        </div>

        {/* 导出按钮 */}
        <button 
          onClick={onExport} 
          disabled={isExporting}
          className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none btn-press"
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
      </div>
      
      <div className="h-8"></div>
    </div>
  );
}
