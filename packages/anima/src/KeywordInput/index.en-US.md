---
title: KeywordInput
desc: KeywordInput base on input
defaultShowCode: true
nav:
  title: Components
  path: /components
  order: 2
group:
  title: 'Input Components'
  path: /input
  order: 2
---

### DEMO

<code src="./demo/basic.tsx" />

### API

#### options

| property       | description                                                         | type                               | default |
| -------------- | ------------------------------------------------------------------- | ---------------------------------- | ------- |
| value          | 值                                                                  | string                             | -       |
| onChange       | 值更改时的回调                                                      | (value: string) => void            | -       |
| onOK           | 点击 model 的确定按钮回调                                           | (value: string) => void;           | -       |
| matchRules     | 匹配规则                                                            | { label: string; value: string }[] | -       |
| showHelpTable  | 是否显示匹配规则 table（当为 true，且 matchRules 不为空时才会显示） | boolean                            | false   |
| showKeywordTip | 输入框右侧是否显示关键字提示按钮                                    | boolean                            | false   |
| placeholder    | input 以及弹框 textarea 输入提示                                    | string                             | 关键字  |
