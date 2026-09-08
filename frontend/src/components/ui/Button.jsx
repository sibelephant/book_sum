import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  as: Tag = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <>
          <span className="spinner spinner-sm" aria-hidden="true" />
          <span className="btn-label">{props.loadingText || 'Working…'}</span>
        </>
      ) : (
        children
      )}
    </Tag>
  );
}