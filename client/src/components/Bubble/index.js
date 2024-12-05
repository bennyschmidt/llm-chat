import React from 'react';
import { useDrag } from 'react-dnd';

import {
  getRandomXYStyle
} from '../../utils';

const Bubble = ({
  id,
  children = '',
  style,
  onClick
}) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'Bubble',
      item: {
        id
      },
      collect: monitor => ({
        opacity: monitor.isDragging() ? .5 : 1
      })
    }),
    []
  );

  return (
    <div
      ref={dragRef}
      id={id}
      className="absolute z-10 bg-gradient-to-t to-[dodgerblue] from-[blue] to-100% max-h-[12rem] rounded-lg p-4 w-[16rem] max-h-[8rem] overflow-hidden rounded-lg cursor-move select-none shadow-lg"
      style={{
        ...(style || getRandomXYStyle()),

        opacity
      }}
      onClick={onClick}
      dangerouslySetInnerHTML={{
        __html: children.replace(/\n/g, '<br />') || '...'
      }}
    />
  );
};

export default Bubble;
