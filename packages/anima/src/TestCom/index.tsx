import React from 'react';

export default ({ title }: { title: string }) => (
  <h1 style={{ position: 'fixed', top: 0, left: 0 }}>{title}</h1>
);
