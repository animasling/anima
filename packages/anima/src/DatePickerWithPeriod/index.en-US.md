---
group:
  title: DATA_INPUT
  order: 1  
nav:
  title: Components
  path: /components
  order: 1 
---

## 周期时间选择器

选择时间默认为时间范围的结束时间，可以通过`selectDateIsEndTime`设置选择时间为开始时间还是结束时间。

可以通过`defaultValue`设置默认时间，不设置则默认为今天。

可以通过`disableDate`配置不可选择的时间，设置为<b>true</b>，默认为今天之后。

时间周期默认可选天，周，月（自然月或是非自然月），默认是周，选月默认为非自然月(30 天)，可以通过`isNaturalMonth` 设置为自然月。设置时间周期可以通过 `DatePeriodType` 设置值。
| 描述 | 值 | 备注 |
| ---- | ----- | ---------------------- |
| 天 | day | `DatePeriodType.DAY` |
| 周 | week | `DatePeriodType.WEEK` |
| 月 | month | `DatePeriodType.MONTH` |

也可以通过 `datePeriodOptions` 属性来配置日期周期下拉内容。

## DEMO

<code  src="../DatePickerWithPeriod/demo/basic.tsx" title="基本用法" description="基本用法"></code>

<code src="../DatePickerWithPeriod/demo/naturalMonth.tsx" title="设置自然月" description="设置自然月"></code>

<code src="../DatePickerWithPeriod/demo/disableDate.tsx"  title="设置自然月" description="设置自然月"></code>

<code src="../DatePickerWithPeriod/demo/customDatePeriod.tsx"  title="自定义时间周期" description="自定义时间周期"></code>

<code src="../DatePickerWithPeriod/demo/selectDateIsStartTime.tsx"   title="选择时间为开始时间" description="选择时间为开始时间"></code>

<code src="../DatePickerWithPeriod/demo/useInForm.tsx"  title="在 Form 中使用" description="在 Form 中使用"></code>

## API

| 参数                | 说明                                                                             | 类型                                         | 默认值 | 版本  |
| ------------------- | -------------------------------------------------------------------------------- | -------------------------------------------- | ------ | ----- |
| defaultValue        | 默认值                                                                           | `DatePickerWithPeriodValue`                  | -      | 0.01 |
| value               | 值                                                                               | `DatePickerWithPeriodValue`                  | -      | 0.01 |
| isNaturalMonth      | 周期选择月时，增减周期是否为自然月                                               | `boolean`                                    | false  | 0.01 |
| disableDate         | 是否有不可选择的日期(设置为 true, 不可选择日期默认为今天之后),可以设置具体的一天 | `boolean/Moment`                             | false  | 0.01 |
| style               | 布局样式                                                                         | `React.CSSProperties`                        | -      | 0.01 |
| selectDateIsEndTime | 选择时间是否为结束时间                                                           | `boolen`                                     | true   | 0.01 |
| datePeriodOptions   | 自定义日期周期                                                                   | `DatePeriodOptions`                          | -      | 0.01 |
| onChange            | 时间发生变化的回调                                                               | `(value: DatePickerWithPeriodValue) => void` | -      | 0.01 |

## TS

| 名称                      | 值                                                 |
| ------------------------- | -------------------------------------------------- |
| DatePickerWithPeriodValue | `{ dateRange: Moment[]; datePeriod: string;}`      |
| DatePeriodOptions         | `{ value: number; unit: string; label: string }[]` |

[更多技巧](https://d.umijs.org/guide/demo-principle)
