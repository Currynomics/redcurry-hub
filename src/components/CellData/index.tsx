import React from 'react';
import { Props } from 'payload/components/views/Cell';

const Cell: React.FC<Props> = (props) => {
  const { cellData } = props;
  console.log("cellData: ", cellData)

  if (!cellData) return null;

  return (
    <div
      className={`chip`}
      style={{ backgroundColor: cellData as string }}
    >
    </div>
  )
}

export default Cell;