import React from 'react';
import type { HeroBlockData } from '../../types/blocks';

export default function HeroRenderer({ data }: { data: HeroBlockData }) {
  return (
    <div
      dir="rtl"
      style={{
        position: 'relative',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: data.imageSrc ? `url(${data.imageSrc})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: data.imageSrc ? 'transparent' : '#f0f0f0',
        color: '#fff',
        textAlign: 'right',
        overflow: 'hidden',
      }}
    >
      {data.imageSrc && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 2, padding: '40px', maxWidth: '600px' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            margin: 0,
            paddingBottom: '16px',
          }}
        >
          {data.title}
        </h1>

        {data.subtitle && (
          <p
            style={{
              fontSize: '1.1rem',
              marginBottom: '24px',
              margin: 0,
              paddingBottom: '24px',
              lineHeight: 1.6,
            }}
          >
            {data.subtitle}
          </p>
        )}

        {data.primaryCtaText && data.primaryCtaHref && (
          <a
            href={data.primaryCtaHref}
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
          >
            {data.primaryCtaText}
          </a>
        )}
      </div>
    </div>
  );
}
