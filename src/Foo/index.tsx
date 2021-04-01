/**
 * title: 我是测试标题  // demo 标题
 * desc: 我是测试简介，用‘markdown’编写 // demo简介
 * transform true // 捕获fixed 元素，是的改元素相对于demo包裹器定位
 * background: '#f0f0f0' // 修改demo背景色
 * compact: true // 移除所有内边距
 * inline: true // 不会暂时包裹器，直接在文档里嵌入demo
 * debug: true // 在开发环境下展示，且有一个特殊标记
 * iframe: true // 用iframe 渲染demo ，可实现和文档完全隔离，通常用于布局型组件，此时 compact 配置默认为 true
 */

import React from 'react';

export default ({ title }: { title: string }) => (
  <h1 style={{ position: 'fixed', top: 0, left: 0 }}>{title}sdasfsadfsf </h1>
);
