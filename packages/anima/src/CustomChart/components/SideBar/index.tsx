import React from 'react';
import { tuple } from '../../utils';
import './index.less';

const Directions = tuple('vertical', 'horizontal');
type PlaceDirection = typeof Directions[number];

interface SideBarProps {
  direction?: PlaceDirection;
  data: React.ReactNode;
  styles?: React.CSSProperties;
}

function SideBar(props: SideBarProps) {
  const { data, direction = Directions[0], styles } = props;
  if (!data) return null;

  const events = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    click: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mouseEnter: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mouseLeave: () => {},
  };

  return (
    <ul className={`${direction} side-bar`} style={styles}>
      {React.Children.map(data, item => {
        return <li>{item}</li>;
      })}
    </ul>
  );
}

export default SideBar;
