import PropTypes from 'prop-types';

/**
 * 通用小按钮组件
 */
export default function SmallButton({ 
  active = false, 
  children, 
  onClick, 
  className = '',
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200 btn-press
        ${active 
          ? 'bg-foreground text-background shadow-md' 
          : 'bg-secondary hover:bg-accent text-foreground border border-border/50 hover:border-border'
        }
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

SmallButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
