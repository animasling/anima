---
title: TestCom
desc: TestCom
nav:
  path: /components
---

上面还有其他内容哦

```tsx | pure
import React from 'react';

interface ITestComProps {
  /**
   * @title 传入的title
   */
  title: string;
}

const TestCom: React.FC<ITestComProps> = ({ title }) => (
  <h1 style={{ position: 'fixed', top: 0, left: 0 }}>{title}</h1>
);

export default TestCom;
```

// type: warnig,info(默认), success, error

<Alert type="info">内部暂时只能编写 HTML</Alert>

#### 标签测试: <Badge>Hello</Badge>

<embed src="./other.zh-CN.md#L12-L14"></embed>
