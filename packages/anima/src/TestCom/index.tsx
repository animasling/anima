import React from 'react';

interface ITestComProps {
  /**
   * @title 传入的title
   * @des 传入的des
   */
  title: string;
  des?: string;
}

const TestCom: React.FC<ITestComProps> = ({ title, des }) => (
  <>
    <div>{title}</div>
    <p>{des}</p>
  </>
);

export default TestCom;
