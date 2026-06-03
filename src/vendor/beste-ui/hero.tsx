// @vendor: Beste UI (vendor copy placeholder)
import React from 'react';

export function BesteHero({
  title,
  subtitle,
  imageSrc,
  ctaText,
  ctaHref,
}: {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <div style={{ padding: 24, borderRadius: 8, background: '#f8fafc', textAlign: 'right' }}>
      {imageSrc ? (
        <div style={{ marginBottom: 12 }}>
          <img src={imageSrc} alt="hero" style={{ width: '100%', borderRadius: 8 }} />
        </div>
      ) : null}
      <h1 style={{ margin: 0, fontSize: 28 }}>{title}</h1>
      {subtitle ? <p style={{ marginTop: 8, color: '#4b5563' }}>{subtitle}</p> : null}
      {ctaText ? (
        <div style={{ marginTop: 12 }}>
          <a href={ctaHref || '#'}>
            <button style={{ padding: '8px 12px', borderRadius: 6 }}>{ctaText}</button>
          </a>
        </div>
      ) : null}
    </div>
  );
}
