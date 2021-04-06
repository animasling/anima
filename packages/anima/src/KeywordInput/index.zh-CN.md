---
title: KeywordInput 关键字输入
desc: 基于input封装的关键字输入框
nav:
  title: 组件
  path: /components
  order: 2
group:
  title: '输入组件'
  path: /input
  order: 2
---

### 例子

<code src="./demo/basic.tsx" />

### API

#### 参数

| 属性           | 说明                                                                | 类型                               | 默认值 |
| -------------- | ------------------------------------------------------------------- | ---------------------------------- | ------ |
| value          | 值                                                                  | string                             | -      |
| onChange       | 值更改时的回调                                                      | (value: string) => void            | -      |
| onOK           | 点击 model 的确定按钮回调                                           | (value: string) => void;           | -      |
| matchRules     | 匹配规则                                                            | { label: string; value: string }[] | -      |
| showHelpTable  | 是否显示匹配规则 table（当为 true，且 matchRules 不为空时才会显示） | boolean                            | false  |
| showKeywordTip | 输入框右侧是否显示关键字提示按钮                                    | boolean                            | false  |
| placeholder    | input 以及弹框 textarea 输入提示                                    | string                             | 关键字 |
