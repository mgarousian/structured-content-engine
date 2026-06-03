import React from 'react';

type ImageData = {
  src: string;
  alt: string;
  caption?: string;
};

export default function ImageRenderer({ data }: { data: ImageData }) {
  return (
    <figure dir="rtl" style={{ textAlign: 'right', margin: 0 }}>
      <img
        src={data.src}
        alt={data.alt}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: 16,
          objectFit: 'cover',
        }}
      />
      {data.caption ? (
        <figcaption style={{ marginTop: 10, color: '#475569', fontSize: 15 }}>
          {data.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
