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
