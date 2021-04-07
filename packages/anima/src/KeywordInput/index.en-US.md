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

| property       | description                                                                     | type                               | default |
| -------------- | ------------------------------------------------------------------------------- | ---------------------------------- | ------- |
| value          | value                                                                           | string                             | -       |
| onChange       | the callback when value changed                                                 | (value: string) => void            | -       |
| onOK           | the callback of OK button on modal                                              | (value: string) => void;           | -       |
| matchRules     | match rule                                                                      | { label: string; value: string }[] | -       |
| showHelpTable  | is show match rule table（it will show when true and matchRules is not empty ） | boolean                            | false   |
| showKeywordTip | is show keyword tip button at the right of the input                            | boolean                            | false   |
| placeholder    | the placeholder of input and textarea on modal                                  | string                             | keyword |
