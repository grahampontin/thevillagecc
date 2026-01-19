import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

const ParameterizedLinkToMatchReportRenderer: React.FC<ICellRendererParams> = (params) => {
  const field = params.colDef?.field;
  const matchId = field ? params.data?.[`${field}MatchId`] : null;
  const displayValue = params.value;

  if (!matchId || displayValue === null || displayValue === undefined) {
    return <>{displayValue}</>;
  }

  return (
    <a href={`/LiveScorecard.aspx?matchId=${matchId}`}>
      {displayValue}
    </a>
  );
};

export default ParameterizedLinkToMatchReportRenderer;
