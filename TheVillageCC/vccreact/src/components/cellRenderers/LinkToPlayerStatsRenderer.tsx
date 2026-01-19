import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

const LinkToPlayerStatsRenderer: React.FC<ICellRendererParams> = (params) => {
  const playerId = params.data?.id;
  const displayValue = params.value;

  if (!playerId || displayValue === null || displayValue === undefined) {
    return <>{displayValue}</>;
  }

  return (
    <a href={`/player/${playerId}`}>
      {displayValue}
    </a>
  );
};

export default LinkToPlayerStatsRenderer;
