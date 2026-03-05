import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SearchableSelect from './SearchableSelect';
import ImageCropper from './ImageCropper';
import { getScorecardByMatchId, saveScorecard, getMatchReport, saveMatchReport } from '../api/scorecardsApi';
import { getMatchById } from '../api/fixturesApi';
import { getAllPlayers } from '../api/playersApi';
import {
  MatchScorecardV1,
  MatchReportV1,
  MatchV1,
  PlayerV1,
  BattingEntryV1,
  BowlingEntryV1,
  FoWEntryV1,
  ExtrasV1,
  InningsScoreCardV1,
  MatchConditionsV1,
  FoWPlayerV1,
} from '../api/swaggerTypes';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type DismissalMode =
  | 'NotOut' | 'Bowled' | 'Caught' | 'LBW' | 'RunOut' | 'Stumped'
  | 'HitWicket' | 'DidNotBat' | 'Retired' | 'RetiredHurt' | 'CaughtAndBowled';

const DISMISSAL_MODES: DismissalMode[] = [
  'NotOut', 'Bowled', 'Caught', 'LBW', 'RunOut', 'Stumped',
  'HitWicket', 'DidNotBat', 'Retired', 'RetiredHurt', 'CaughtAndBowled',
];

function formatDismissal(entry: BattingEntryV1): string {
  const mode = entry.modeOfDismissal as DismissalMode | null | undefined;
  switch (mode) {
    case 'NotOut': return 'not out';
    case 'Bowled': return `b ${entry.bowlerName ?? ''}`;
    case 'Caught': return `ct ${entry.fielderName ?? ''} b ${entry.bowlerName ?? ''}`;
    case 'LBW': return `lbw b ${entry.bowlerName ?? ''}`;
    case 'RunOut': return `run out (${entry.fielderName ?? ''})`;
    case 'Stumped': return `st ${entry.fielderName ?? ''} b ${entry.bowlerName ?? ''}`;
    case 'HitWicket': return 'hit wicket';
    case 'DidNotBat': return 'did not bat';
    case 'Retired': return 'retired (out)';
    case 'RetiredHurt': return 'retired hurt';
    case 'CaughtAndBowled': return `c&b ${entry.bowlerName ?? ''}`;
    default: return mode ?? '';
  }
}

function isDismissed(mode: string | null | undefined): boolean {
  return !['NotOut', 'DidNotBat', 'RetiredHurt', null, undefined, ''].includes(mode as string);
}

function playerOptions(players: PlayerV1[]) {
  return players.map(p => ({ value: String(p.playerId), label: `${p.surname}, ${p.firstName}` }));
}

function emptyInnings(): InningsScoreCardV1 {
  return {
    batting: { entries: [], extras: { wides: 0, noBalls: 0, penalties: 0, byes: 0, legByes: 0, total: 0 }, score: 0, wickets: 0 },
    bowling: { entries: [] },
    fow: { entries: [] },
    inningsLength: 0,
  };
}

function emptyScorecard(): MatchScorecardV1 {
  return {
    ourInnings: emptyInnings(),
    theirInnings: emptyInnings(),
    matchConditions: { abandoned: false, captainId: 0, wicketKeeperId: 0, overs: 40, declaration: false, weWonTheToss: false, tossWinnerBatted: true },
  };
}

// ---------------------------------------------------------------------------
// Modal sub-components
// ---------------------------------------------------------------------------

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, onClose, onSave, saving, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg my-4">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
      <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Cancel</button>
        <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm rounded-md bg-villageGreen text-white font-medium hover:bg-green-800 transition disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  </div>
);

function inputCls() {
  return 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen';
}

function labelCls() {
  return 'block text-sm font-medium text-gray-700 mb-1';
}

// ---------------------------------------------------------------------------
// Edit Batsman Modal
// ---------------------------------------------------------------------------

interface EditBatsmanModalProps {
  entry: BattingEntryV1;
  isVcc: boolean;
  players: PlayerV1[];
  onClose: () => void;
  onSave: (updated: BattingEntryV1) => void;
}

const EditBatsmanModal: React.FC<EditBatsmanModalProps> = ({ entry, isVcc, players, onClose, onSave }) => {
  const [form, setForm] = useState<BattingEntryV1>({ ...entry });
  const opts = playerOptions(players);

  const showBowler = ['Bowled', 'Caught', 'LBW', 'Stumped', 'CaughtAndBowled'].includes(form.modeOfDismissal ?? '');
  const showFielder = ['Caught', 'RunOut', 'Stumped'].includes(form.modeOfDismissal ?? '');

  return (
    <ModalWrapper title={isVcc ? 'Edit VCC Batsman' : 'Edit Opposition Batsman'} onClose={onClose} onSave={() => onSave(form)}>
      {!isVcc && (
        <div>
          <label className={labelCls()} htmlFor="bat-name">Player Name</label>
          <input id="bat-name" type="text" value={form.playerName ?? ''} onChange={e => setForm(f => ({ ...f, playerName: e.target.value }))} className={inputCls()} />
        </div>
      )}
      {isVcc && (
        <div>
          <label className={labelCls()} htmlFor="bat-player">Player</label>
          <SearchableSelect
            id="bat-player"
            value={form.playerId ? String(form.playerId) : ''}
            onChange={v => {
              const p = players.find(pl => String(pl.playerId) === v);
              setForm(f => ({ ...f, playerId: p?.playerId ?? 0, playerName: p ? `${p.firstName} ${p.surname}` : '' }));
            }}
            options={opts}
            placeholder="— Select player —"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls()} htmlFor="bat-runs">Runs</label>
          <input id="bat-runs" type="number" min={0} value={form.runs ?? 0} onChange={e => setForm(f => ({ ...f, runs: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="bat-balls">Balls Faced</label>
          <input id="bat-balls" type="number" min={0} value={form.ballsFaced ?? 0} onChange={e => setForm(f => ({ ...f, ballsFaced: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="bat-fours">Fours</label>
          <input id="bat-fours" type="number" min={0} value={form.fours ?? 0} onChange={e => setForm(f => ({ ...f, fours: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="bat-sixes">Sixes</label>
          <input id="bat-sixes" type="number" min={0} value={form.sixes ?? 0} onChange={e => setForm(f => ({ ...f, sixes: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
      </div>
      <div>
        <label className={labelCls()} htmlFor="bat-mode">Mode of Dismissal</label>
        <select id="bat-mode" value={form.modeOfDismissal ?? 'NotOut'} onChange={e => setForm(f => ({ ...f, modeOfDismissal: e.target.value as DismissalMode }))} className={inputCls()}>
          {DISMISSAL_MODES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      {showBowler && (
        <div>
          <label className={labelCls()} htmlFor="bat-bowler">{isVcc ? 'Bowler (Opposition)' : 'Bowler (VCC)'}</label>
          {isVcc ? (
            <input id="bat-bowler" type="text" value={form.bowlerName ?? ''} onChange={e => setForm(f => ({ ...f, bowlerName: e.target.value }))} className={inputCls()} />
          ) : (
            <SearchableSelect
              id="bat-bowler"
              value={form.bowlerId ? String(form.bowlerId) : ''}
              onChange={v => {
                const p = players.find(pl => String(pl.playerId) === v);
                setForm(f => ({ ...f, bowlerId: p?.playerId ?? 0, bowlerName: p ? `${p.firstName} ${p.surname}` : '' }));
              }}
              options={opts}
              placeholder="— Select bowler —"
            />
          )}
        </div>
      )}
      {showFielder && (
        <div>
          <label className={labelCls()} htmlFor="bat-fielder">{isVcc ? 'Fielder (Opposition)' : 'Fielder (VCC)'}</label>
          {isVcc ? (
            <input id="bat-fielder" type="text" value={form.fielderName ?? ''} onChange={e => setForm(f => ({ ...f, fielderName: e.target.value }))} className={inputCls()} />
          ) : (
            <SearchableSelect
              id="bat-fielder"
              value={form.fielderId ? String(form.fielderId) : ''}
              onChange={v => {
                const p = players.find(pl => String(pl.playerId) === v);
                setForm(f => ({ ...f, fielderId: p?.playerId ?? 0, fielderName: p ? `${p.firstName} ${p.surname}` : '' }));
              }}
              options={opts}
              placeholder="— Select fielder —"
            />
          )}
        </div>
      )}
    </ModalWrapper>
  );
};

// ---------------------------------------------------------------------------
// Edit Bowler Modal
// ---------------------------------------------------------------------------

interface EditBowlerModalProps {
  entry: BowlingEntryV1;
  isVcc: boolean;
  players: PlayerV1[];
  onClose: () => void;
  onSave: (updated: BowlingEntryV1) => void;
}

const EditBowlerModal: React.FC<EditBowlerModalProps> = ({ entry, isVcc, players, onClose, onSave }) => {
  const [form, setForm] = useState<BowlingEntryV1>({ ...entry });
  const opts = playerOptions(players);

  return (
    <ModalWrapper title={isVcc ? 'Edit VCC Bowler' : 'Edit Opposition Bowler'} onClose={onClose} onSave={() => onSave(form)}>
      {isVcc ? (
        <div>
          <label className={labelCls()} htmlFor="bowl-player">Player</label>
          <SearchableSelect
            id="bowl-player"
            value={form.playerId ? String(form.playerId) : ''}
            onChange={v => {
              const p = players.find(pl => String(pl.playerId) === v);
              setForm(f => ({ ...f, playerId: p?.playerId ?? 0, playerName: p ? `${p.firstName} ${p.surname}` : '' }));
            }}
            options={opts}
            placeholder="— Select player —"
          />
        </div>
      ) : (
        <div>
          <label className={labelCls()} htmlFor="bowl-name">Bowler Name</label>
          <input id="bowl-name" type="text" value={form.playerName ?? ''} onChange={e => setForm(f => ({ ...f, playerName: e.target.value }))} className={inputCls()} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls()} htmlFor="bowl-overs">Overs</label>
          <input id="bowl-overs" type="number" step="0.1" min={0} value={form.overs ?? 0} onChange={e => setForm(f => ({ ...f, overs: parseFloat(e.target.value) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="bowl-maidens">Maidens</label>
          <input id="bowl-maidens" type="number" min={0} value={form.maidens ?? 0} onChange={e => setForm(f => ({ ...f, maidens: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="bowl-runs">Runs</label>
          <input id="bowl-runs" type="number" min={0} value={form.runs ?? 0} onChange={e => setForm(f => ({ ...f, runs: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="bowl-wickets">Wickets</label>
          <input id="bowl-wickets" type="number" min={0} value={form.wickets ?? 0} onChange={e => setForm(f => ({ ...f, wickets: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
      </div>
    </ModalWrapper>
  );
};

// ---------------------------------------------------------------------------
// Edit FoW Modal
// ---------------------------------------------------------------------------

interface EditFoWModalProps {
  entry: FoWEntryV1;
  battingEntries: BattingEntryV1[];
  isVcc: boolean;
  onClose: () => void;
  onSave: (updated: FoWEntryV1) => void;
}

const EditFoWModal: React.FC<EditFoWModalProps> = ({ entry, battingEntries, onClose, onSave }) => {
  const [form, setForm] = useState<FoWEntryV1>({ ...entry, outgoingPlayer: { ...entry.outgoingPlayer }, notOutPlayer: { ...entry.notOutPlayer } });

  const playerOpts = battingEntries.map((b, idx) => ({
    value: String(b.playerId ?? idx),
    label: b.playerName ?? `Batsman ${(b.battingAt ?? idx) + 1}`,
  }));

  const setOutgoing = (field: keyof FoWPlayerV1, value: string | number) =>
    setForm(f => ({ ...f, outgoingPlayer: { ...(f.outgoingPlayer ?? {}), [field]: value } }));
  const setNotOut = (field: keyof FoWPlayerV1, value: string | number) =>
    setForm(f => ({ ...f, notOutPlayer: { ...(f.notOutPlayer ?? {}), [field]: value } }));

  return (
    <ModalWrapper title={`Edit FoW — Wicket ${entry.wicket ?? ''}`} onClose={onClose} onSave={() => onSave(form)}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls()} htmlFor="fow-wicket">Wicket #</label>
          <input id="fow-wicket" type="number" min={1} value={form.wicket ?? ''} onChange={e => setForm(f => ({ ...f, wicket: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="fow-score">Score</label>
          <input id="fow-score" type="number" min={0} value={form.score ?? 0} onChange={e => setForm(f => ({ ...f, score: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="fow-overs">Overs</label>
          <input id="fow-overs" type="number" step="0.1" min={0} value={form.overs ?? 0} onChange={e => setForm(f => ({ ...f, overs: parseFloat(e.target.value) || 0 }))} className={inputCls()} />
        </div>
        <div>
          <label className={labelCls()} htmlFor="fow-partnership">Partnership</label>
          <input id="fow-partnership" type="number" min={0} value={form.partnership ?? 0} onChange={e => setForm(f => ({ ...f, partnership: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
        </div>
      </div>
      <div>
        <label className={labelCls()} htmlFor="fow-out">Out Batsman</label>
        <select id="fow-out" value={playerOpts.find(o => o.label === form.outgoingPlayer?.name)?.value ?? ''} onChange={e => {
          const b = battingEntries.find((_, i) => String(_.playerId ?? i) === e.target.value);
          if (b) setOutgoing('name', b.playerName ?? '');
        }} className={inputCls()}>
          <option value="">— Select —</option>
          {playerOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls()} htmlFor="fow-out-score">Out Batsman Score</label>
        <input id="fow-out-score" type="number" min={0} value={form.outgoingPlayer?.score ?? 0} onChange={e => setOutgoing('score', parseInt(e.target.value, 10) || 0)} className={inputCls()} />
      </div>
      <div>
        <label className={labelCls()} htmlFor="fow-notout">Not Out Batsman</label>
        <select id="fow-notout" value={playerOpts.find(o => o.label === form.notOutPlayer?.name)?.value ?? ''} onChange={e => {
          const b = battingEntries.find((_, i) => String(_.playerId ?? i) === e.target.value);
          if (b) setNotOut('name', b.playerName ?? '');
        }} className={inputCls()}>
          <option value="">— Select —</option>
          {playerOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls()} htmlFor="fow-notout-score">Not Out Batsman Score</label>
        <input id="fow-notout-score" type="number" min={0} value={form.notOutPlayer?.score ?? 0} onChange={e => setNotOut('score', parseInt(e.target.value, 10) || 0)} className={inputCls()} />
      </div>
    </ModalWrapper>
  );
};

// ---------------------------------------------------------------------------
// Edit Extras Modal
// ---------------------------------------------------------------------------

interface EditExtrasModalProps {
  extras: ExtrasV1;
  onClose: () => void;
  onSave: (updated: ExtrasV1) => void;
}

const EditExtrasModal: React.FC<EditExtrasModalProps> = ({ extras, onClose, onSave }) => {
  const [form, setForm] = useState<ExtrasV1>({ ...extras });
  const total = (form.wides ?? 0) + (form.noBalls ?? 0) + (form.byes ?? 0) + (form.legByes ?? 0) + (form.penalties ?? 0);

  return (
    <ModalWrapper title="Edit Extras" onClose={onClose} onSave={() => onSave({ ...form, total })}>
      <div className="grid grid-cols-2 gap-3">
        {(['wides', 'noBalls', 'byes', 'legByes', 'penalties'] as (keyof ExtrasV1)[]).map(field => (
          <div key={field}>
            <label className={labelCls()} htmlFor={`extras-${field}`}>{field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</label>
            <input id={`extras-${field}`} type="number" min={0} value={(form[field] as number) ?? 0} onChange={e => setForm(f => ({ ...f, [field]: parseInt(e.target.value, 10) || 0 }))} className={inputCls()} />
          </div>
        ))}
        <div>
          <label className={labelCls()}>Total (auto)</label>
          <input type="number" value={total} readOnly className={`${inputCls()} bg-gray-50`} />
        </div>
      </div>
    </ModalWrapper>
  );
};

// ---------------------------------------------------------------------------
// Edit Overs Modal
// ---------------------------------------------------------------------------

interface EditOversModalProps {
  inningsLength: number;
  onClose: () => void;
  onSave: (overs: number) => void;
}

const EditOversModal: React.FC<EditOversModalProps> = ({ inningsLength, onClose, onSave }) => {
  const [overs, setOvers] = useState(inningsLength);
  return (
    <ModalWrapper title="Edit Innings Overs" onClose={onClose} onSave={() => onSave(overs)}>
      <div>
        <label className={labelCls()} htmlFor="overs-played">Overs Played</label>
        <input id="overs-played" type="number" step="0.1" min={0} value={overs} onChange={e => setOvers(parseFloat(e.target.value) || 0)} className={inputCls()} />
      </div>
    </ModalWrapper>
  );
};

// ---------------------------------------------------------------------------
// Batting Table
// ---------------------------------------------------------------------------

interface BattingTableProps {
  entries: BattingEntryV1[];
  isVcc: boolean;
  players: PlayerV1[];
  onEditEntry: (idx: number) => void;
  onDeleteEntry: (idx: number) => void;
  onAddEntry: () => void;
  extras: ExtrasV1 | undefined;
  inningsLength: number | undefined;
  onEditExtras: () => void;
  onEditOvers: () => void;
}

const BattingTable: React.FC<BattingTableProps> = ({
  entries, isVcc, onEditEntry, onDeleteEntry, onAddEntry, extras, inningsLength, onEditExtras, onEditOvers,
}) => {
  const totalRuns = (entries.reduce((sum, e) => sum + (e.runs ?? 0), 0)) + (extras?.total ?? 0);
  const wickets = entries.filter(e => isDismissed(e.modeOfDismissal)).length;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-2 py-2 font-medium text-gray-600">Batsman</th>
              <th className="px-2 py-2 font-medium text-gray-600">Dismissal</th>
              <th className="px-2 py-2 font-medium text-gray-600 text-right">R</th>
              <th className="px-2 py-2 font-medium text-gray-600 text-right">B</th>
              <th className="px-2 py-2 font-medium text-gray-600 text-right">4s</th>
              <th className="px-2 py-2 font-medium text-gray-600 text-right">6s</th>
              <th className="px-2 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((e, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-2 py-2">{e.playerName ?? '—'}</td>
                <td className="px-2 py-2 text-gray-500">{formatDismissal(e)}</td>
                <td className="px-2 py-2 text-right">{e.runs ?? 0}</td>
                <td className="px-2 py-2 text-right">{e.ballsFaced ?? 0}</td>
                <td className="px-2 py-2 text-right">{e.fours ?? 0}</td>
                <td className="px-2 py-2 text-right">{e.sixes ?? 0}</td>
                <td className="px-2 py-2 flex gap-1 justify-end">
                  <button onClick={() => onEditEntry(idx)} className="text-gray-400 hover:text-villageGreen" aria-label="Edit batsman">
                    <span className="material-symbols-outlined text-[18px] leading-none">edit</span>
                  </button>
                  <button onClick={() => onDeleteEntry(idx)} className="text-gray-400 hover:text-red-600" aria-label="Delete batsman">
                    <span className="material-symbols-outlined text-[18px] leading-none">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex items-center justify-between px-2">
        <button onClick={onAddEntry} className="text-sm text-villageGreen hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] leading-none">add</span> Add batsman
        </button>
      </div>
      {/* Extras */}
      <div className="mt-3 border-t border-gray-100 pt-2 px-2 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Extras: W {extras?.wides ?? 0}, NB {extras?.noBalls ?? 0}, B {extras?.byes ?? 0}, LB {extras?.legByes ?? 0}, P {extras?.penalties ?? 0} = <strong>{extras?.total ?? 0}</strong>
        </span>
        <button onClick={onEditExtras} className="text-gray-400 hover:text-villageGreen" aria-label="Edit extras">
          <span className="material-symbols-outlined text-[18px] leading-none">edit</span>
        </button>
      </div>
      {/* Total / overs */}
      <div className="mt-1 px-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          Total: {totalRuns}/{wickets} ({inningsLength ?? 0} overs)
        </span>
        <button onClick={onEditOvers} className="text-gray-400 hover:text-villageGreen" aria-label="Edit overs">
          <span className="material-symbols-outlined text-[18px] leading-none">edit</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Bowling Table
// ---------------------------------------------------------------------------

interface BowlingTableProps {
  entries: BowlingEntryV1[];
  isVcc: boolean;
  players: PlayerV1[];
  onEditEntry: (idx: number) => void;
  onDeleteEntry: (idx: number) => void;
  onAddEntry: () => void;
}

const BowlingTable: React.FC<BowlingTableProps> = ({ entries, onEditEntry, onDeleteEntry, onAddEntry }) => (
  <div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-2 py-2 font-medium text-gray-600">Bowler</th>
            <th className="px-2 py-2 font-medium text-gray-600 text-right">O</th>
            <th className="px-2 py-2 font-medium text-gray-600 text-right">M</th>
            <th className="px-2 py-2 font-medium text-gray-600 text-right">R</th>
            <th className="px-2 py-2 font-medium text-gray-600 text-right">W</th>
            <th className="px-2 py-2 w-16"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((e, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-2 py-2">{e.playerName ?? '—'}</td>
              <td className="px-2 py-2 text-right">{e.overs ?? 0}</td>
              <td className="px-2 py-2 text-right">{e.maidens ?? 0}</td>
              <td className="px-2 py-2 text-right">{e.runs ?? 0}</td>
              <td className="px-2 py-2 text-right">{e.wickets ?? 0}</td>
              <td className="px-2 py-2 flex gap-1 justify-end">
                <button onClick={() => onEditEntry(idx)} className="text-gray-400 hover:text-villageGreen" aria-label="Edit bowler">
                  <span className="material-symbols-outlined text-[18px] leading-none">edit</span>
                </button>
                <button onClick={() => onDeleteEntry(idx)} className="text-gray-400 hover:text-red-600" aria-label="Delete bowler">
                  <span className="material-symbols-outlined text-[18px] leading-none">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-2 px-2">
      <button onClick={onAddEntry} className="text-sm text-villageGreen hover:underline flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px] leading-none">add</span> Add bowler
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// FoW Table
// ---------------------------------------------------------------------------

interface FoWTableProps {
  entries: FoWEntryV1[];
  onEditEntry: (idx: number) => void;
  onDeleteEntry: (idx: number) => void;
  onAddEntry: () => void;
}

const FoWTable: React.FC<FoWTableProps> = ({ entries, onEditEntry, onDeleteEntry, onAddEntry }) => (
  <div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-2 py-2 font-medium text-gray-600">Wkt</th>
            <th className="px-2 py-2 font-medium text-gray-600 text-right">Score</th>
            <th className="px-2 py-2 font-medium text-gray-600 text-right">Overs</th>
            <th className="px-2 py-2 font-medium text-gray-600 text-right">P'ship</th>
            <th className="px-2 py-2 font-medium text-gray-600">Out</th>
            <th className="px-2 py-2 font-medium text-gray-600">Not Out</th>
            <th className="px-2 py-2 w-16"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((e, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-2 py-2">{e.wicket ?? idx + 1}</td>
              <td className="px-2 py-2 text-right">{e.score ?? 0}</td>
              <td className="px-2 py-2 text-right">{e.overs ?? 0}</td>
              <td className="px-2 py-2 text-right">{e.partnership ?? 0}</td>
              <td className="px-2 py-2">{e.outgoingPlayer?.name ?? '—'}</td>
              <td className="px-2 py-2">{e.notOutPlayer?.name ?? '—'}</td>
              <td className="px-2 py-2 flex gap-1 justify-end">
                <button onClick={() => onEditEntry(idx)} className="text-gray-400 hover:text-villageGreen" aria-label="Edit FoW">
                  <span className="material-symbols-outlined text-[18px] leading-none">edit</span>
                </button>
                <button onClick={() => onDeleteEntry(idx)} className="text-gray-400 hover:text-red-600" aria-label="Delete FoW">
                  <span className="material-symbols-outlined text-[18px] leading-none">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-2 px-2">
      <button onClick={onAddEntry} className="text-sm text-villageGreen hover:underline flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px] leading-none">add</span> Add FoW entry
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Modal state type
// ---------------------------------------------------------------------------

type ModalState =
  | { kind: 'none' }
  | { kind: 'batsman'; innings: 'home' | 'away'; idx: number | null }
  | { kind: 'bowler'; innings: 'home' | 'away'; idx: number | null }
  | { kind: 'fow'; innings: 'home' | 'away'; idx: number | null }
  | { kind: 'extras'; innings: 'home' | 'away' }
  | { kind: 'overs'; innings: 'home' | 'away' }
  | { kind: 'matchReport' };

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const AdminEditScorecard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const numericMatchId = parseInt(matchId ?? '0', 10);

  const [scorecard, setScorecard] = useState<MatchScorecardV1 | null>(null);
  const [match, setMatch] = useState<MatchV1 | null>(null);
  const [players, setPlayers] = useState<PlayerV1[]>([]);
  const [matchReport, setMatchReport] = useState<MatchReportV1>({});
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [savingReport, setSavingReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'conditions' | 'home' | 'away'>('conditions');
  const [activeHomeSubTab, setActiveHomeSubTab] = useState<'batting' | 'bowling' | 'fow'>('batting');
  const [activeAwaySubTab, setActiveAwaySubTab] = useState<'batting' | 'bowling' | 'fow'>('batting');
  const [modal, setModal] = useState<ModalState>({ kind: 'none' });

  const loadData = useCallback(async () => {
    if (!numericMatchId) return;
    try {
      setIsLoading(true);
      const [matchData, playersData, sc, report] = await Promise.all([
        getMatchById(numericMatchId),
        getAllPlayers(),
        getScorecardByMatchId(numericMatchId).catch(() => emptyScorecard()),
        getMatchReport(numericMatchId).catch(() => ({})),
      ]);
      playersData.sort((a, b) => (a.surname ?? '').localeCompare(b.surname ?? ''));
      setMatch(matchData);
      setPlayers(playersData);
      setScorecard(sc ?? emptyScorecard());
      setMatchReport(report ?? {});
    } catch (err) {
      console.error('Failed to load scorecard data', err);
      setErrorMsg('Failed to load match data.');
    } finally {
      setIsLoading(false);
    }
  }, [numericMatchId]);

  useEffect(() => { loadData(); }, [loadData]);

  // -------------------------------------------------------------------------
  // Save
  // -------------------------------------------------------------------------

  const handleSave = async () => {
    if (!scorecard) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const saved = await saveScorecard(numericMatchId, scorecard);
      setScorecard(saved);
      setSuccessMsg('Scorecard saved successfully.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMatchReport = async () => {
    setSavingReport(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await saveMatchReport(numericMatchId, matchReport);
      setSuccessMsg('Match report saved successfully.');
      setModal({ kind: 'none' });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSavingReport(false);
    }
  };

  // -------------------------------------------------------------------------
  // Conditions helpers
  // -------------------------------------------------------------------------

  const setConditions = (update: Partial<MatchConditionsV1>) => {
    setScorecard(sc => sc ? { ...sc, matchConditions: { ...(sc.matchConditions ?? {}), ...update } } : sc);
  };

  // -------------------------------------------------------------------------
  // Innings mutation helpers
  // -------------------------------------------------------------------------

  const getInnings = (side: 'home' | 'away'): InningsScoreCardV1 =>
    (side === 'home' ? scorecard?.ourInnings : scorecard?.theirInnings) ?? emptyInnings();

  const setInnings = (side: 'home' | 'away', update: Partial<InningsScoreCardV1>) => {
    setScorecard(sc => {
      if (!sc) return sc;
      if (side === 'home') return { ...sc, ourInnings: { ...(sc.ourInnings ?? emptyInnings()), ...update } };
      return { ...sc, theirInnings: { ...(sc.theirInnings ?? emptyInnings()), ...update } };
    });
  };

  // Batting
  const updateBatting = (side: 'home' | 'away', entries: BattingEntryV1[]) => {
    const inn = getInnings(side);
    setInnings(side, { batting: { ...(inn.batting ?? {}), entries } });
  };

  const deleteBatting = (side: 'home' | 'away', idx: number) => {
    const entries = [...(getInnings(side).batting?.entries ?? [])];
    entries.splice(idx, 1);
    updateBatting(side, entries);
  };

  const saveBatsman = (side: 'home' | 'away', idx: number | null, updated: BattingEntryV1) => {
    const entries = [...(getInnings(side).batting?.entries ?? [])];
    if (idx === null) entries.push(updated);
    else entries[idx] = updated;
    updateBatting(side, entries);
    setModal({ kind: 'none' });
  };

  const saveExtras = (side: 'home' | 'away', extras: ExtrasV1) => {
    const inn = getInnings(side);
    setInnings(side, { batting: { ...(inn.batting ?? {}), extras } });
    setModal({ kind: 'none' });
  };

  const saveOvers = (side: 'home' | 'away', overs: number) => {
    setInnings(side, { inningsLength: overs });
    setModal({ kind: 'none' });
  };

  // Bowling
  const updateBowling = (side: 'home' | 'away', entries: BowlingEntryV1[]) => {
    const inn = getInnings(side);
    setInnings(side, { bowling: { ...(inn.bowling ?? {}), entries } });
  };

  const deleteBowling = (side: 'home' | 'away', idx: number) => {
    const entries = [...(getInnings(side).bowling?.entries ?? [])];
    entries.splice(idx, 1);
    updateBowling(side, entries);
  };

  const saveBowler = (side: 'home' | 'away', idx: number | null, updated: BowlingEntryV1) => {
    const entries = [...(getInnings(side).bowling?.entries ?? [])];
    if (idx === null) entries.push(updated);
    else entries[idx] = updated;
    updateBowling(side, entries);
    setModal({ kind: 'none' });
  };

  // FoW
  const updateFow = (side: 'home' | 'away', entries: FoWEntryV1[]) => {
    const inn = getInnings(side);
    setInnings(side, { fow: { ...(inn.fow ?? {}), entries } });
  };

  const deleteFow = (side: 'home' | 'away', idx: number) => {
    const entries = [...(getInnings(side).fow?.entries ?? [])];
    entries.splice(idx, 1);
    updateFow(side, entries);
  };

  const saveFow = (side: 'home' | 'away', idx: number | null, updated: FoWEntryV1) => {
    const entries = [...(getInnings(side).fow?.entries ?? [])];
    if (idx === null) entries.push(updated);
    else entries[idx] = updated;
    updateFow(side, entries);
    setModal({ kind: 'none' });
  };

  // -------------------------------------------------------------------------
  // Modal helpers
  // -------------------------------------------------------------------------

  const newBatsman = (side: 'home' | 'away'): BattingEntryV1 => ({
    playerId: 0, playerName: '', runs: 0, ballsFaced: 0, fours: 0, sixes: 0,
    modeOfDismissal: 'NotOut', bowlerId: 0, bowlerName: '', fielderId: 0, fielderName: '',
    battingAt: (getInnings(side).batting?.entries?.length ?? 0) + 1,
  });

  const newBowler = (): BowlingEntryV1 => ({ playerId: 0, playerName: '', overs: 0, maidens: 0, runs: 0, wickets: 0 });

  const newFow = (side: 'home' | 'away'): FoWEntryV1 => ({
    wicket: (getInnings(side).fow?.entries?.length ?? 0) + 1,
    score: 0, overs: 0, partnership: 0,
    outgoingPlayer: { id: 0, name: '', battingAt: 0, score: 0 },
    notOutPlayer: { id: 0, name: '', battingAt: 0, score: 0 },
  });

  // -------------------------------------------------------------------------
  // Render modal
  // -------------------------------------------------------------------------

  const renderModal = () => {
    if (modal.kind === 'none') return null;
    if (!scorecard) return null;

    if (modal.kind === 'batsman') {
      const side = modal.innings;
      const isVcc = side === 'home';
      const entries = getInnings(side).batting?.entries ?? [];
      const entry = modal.idx !== null ? entries[modal.idx] : newBatsman(side);
      return (
        <EditBatsmanModal
          entry={entry}
          isVcc={isVcc}
          players={players}
          onClose={() => setModal({ kind: 'none' })}
          onSave={updated => saveBatsman(side, modal.idx, updated)}
        />
      );
    }

    if (modal.kind === 'bowler') {
      const side = modal.innings;
      const isVcc = side === 'away'; // VCC bowl in away/their innings
      const entries = getInnings(side).bowling?.entries ?? [];
      const entry = modal.idx !== null ? entries[modal.idx] : newBowler();
      return (
        <EditBowlerModal
          entry={entry}
          isVcc={isVcc}
          players={players}
          onClose={() => setModal({ kind: 'none' })}
          onSave={updated => saveBowler(side, modal.idx, updated)}
        />
      );
    }

    if (modal.kind === 'fow') {
      const side = modal.innings;
      const entries = getInnings(side).fow?.entries ?? [];
      const entry = modal.idx !== null ? entries[modal.idx] : newFow(side);
      const battingEntries = getInnings(side).batting?.entries ?? [];
      return (
        <EditFoWModal
          entry={entry}
          battingEntries={battingEntries}
          isVcc={side === 'home'}
          onClose={() => setModal({ kind: 'none' })}
          onSave={updated => saveFow(side, modal.idx, updated)}
        />
      );
    }

    if (modal.kind === 'extras') {
      const side = modal.innings;
      const extras = getInnings(side).batting?.extras ?? { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 0 };
      return (
        <EditExtrasModal
          extras={extras}
          onClose={() => setModal({ kind: 'none' })}
          onSave={updated => saveExtras(side, updated)}
        />
      );
    }

    if (modal.kind === 'overs') {
      const side = modal.innings;
      return (
        <EditOversModal
          inningsLength={getInnings(side).inningsLength ?? 0}
          onClose={() => setModal({ kind: 'none' })}
          onSave={overs => saveOvers(side, overs)}
        />
      );
    }

    if (modal.kind === 'matchReport') {
      return (
        <ModalWrapper
          title="Match Report"
          onClose={() => setModal({ kind: 'none' })}
          onSave={handleSaveMatchReport}
          saving={savingReport}
        >
          <div>
            <label className={labelCls()} htmlFor="report-conditions">Conditions</label>
            <textarea
              id="report-conditions"
              rows={3}
              placeholder="Weather, pitch, you know…"
              value={matchReport.conditions ?? ''}
              onChange={e => setMatchReport(r => ({ ...r, conditions: e.target.value }))}
              className={inputCls()}
            />
          </div>
          <div>
            <label className={labelCls()} htmlFor="report-text">Report</label>
            <textarea
              id="report-text"
              rows={8}
              placeholder="Prey tell, what did happen?"
              value={matchReport.report ?? ''}
              onChange={e => setMatchReport(r => ({ ...r, report: e.target.value }))}
              className={inputCls()}
            />
          </div>
          <div>
            <label className={labelCls()} htmlFor="report-image">Photo (optional)</label>
            <input
              id="report-image"
              type="file"
              accept="image/*"
              className="text-sm text-gray-600"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                  const result = ev.target?.result;
                  if (typeof result === 'string') {
                    setCropSource(result);
                  }
                };
                reader.onerror = () => setErrorMsg('Failed to read image file.');
                reader.readAsDataURL(file);
              }}
            />
            {matchReport.base64EncodedImage && (
              <img
                src={matchReport.base64EncodedImage}
                alt="Match report"
                className="mt-2 max-w-full rounded"
                style={{ maxHeight: 200 }}
              />
            )}
          </div>
        </ModalWrapper>
      );
    }

    return null;
  };

  // -------------------------------------------------------------------------
  // Tab content
  // -------------------------------------------------------------------------

  const renderInningsTab = (side: 'home' | 'away') => {
    const subTab = side === 'home' ? activeHomeSubTab : activeAwaySubTab;
    const isVccBatting = side === 'home';
    const isVccBowling = side === 'away';
    const inn = getInnings(side);
    const battingEntries = inn.batting?.entries ?? [];
    const bowlingEntries = inn.bowling?.entries ?? [];
    const fowEntries = inn.fow?.entries ?? [];

    return (
      <div>
        {subTab === 'batting' && (
          <BattingTable
            entries={battingEntries}
            isVcc={isVccBatting}
            players={players}
            onEditEntry={idx => setModal({ kind: 'batsman', innings: side, idx })}
            onDeleteEntry={idx => deleteBatting(side, idx)}
            onAddEntry={() => setModal({ kind: 'batsman', innings: side, idx: null })}
            extras={inn.batting?.extras}
            inningsLength={inn.inningsLength}
            onEditExtras={() => setModal({ kind: 'extras', innings: side })}
            onEditOvers={() => setModal({ kind: 'overs', innings: side })}
          />
        )}

        {subTab === 'bowling' && (
          <BowlingTable
            entries={bowlingEntries}
            isVcc={isVccBowling}
            players={players}
            onEditEntry={idx => setModal({ kind: 'bowler', innings: side, idx })}
            onDeleteEntry={idx => deleteBowling(side, idx)}
            onAddEntry={() => setModal({ kind: 'bowler', innings: side, idx: null })}
          />
        )}

        {subTab === 'fow' && (
          <FoWTable
            entries={fowEntries}
            onEditEntry={idx => setModal({ kind: 'fow', innings: side, idx })}
            onDeleteEntry={idx => deleteFow(side, idx)}
            onAddEntry={() => setModal({ kind: 'fow', innings: side, idx: null })}
          />
        )}
      </div>
    );
  };

  const renderConditionsTab = () => {
    const c: MatchConditionsV1 = scorecard?.matchConditions ?? {};
    const opts = playerOptions(players);
    return (
      <div className="space-y-4 max-w-lg">
        <div className="flex items-center gap-3">
          <input
            id="cond-abandoned"
            type="checkbox"
            checked={c.abandoned ?? false}
            onChange={e => setConditions({ abandoned: e.target.checked })}
            className="h-4 w-4 text-villageGreen border-gray-300 rounded"
          />
          <label htmlFor="cond-abandoned" className="text-sm font-medium text-gray-700">Abandoned</label>
        </div>
        {!c.declaration && (
          <div>
            <label className={labelCls()} htmlFor="cond-overs">Overs</label>
            <input id="cond-overs" type="number" min={1} value={c.overs ?? 40} onChange={e => setConditions({ overs: parseInt(e.target.value, 10) || 40 })} className={inputCls()} />
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            id="cond-declaration"
            type="checkbox"
            checked={c.declaration ?? false}
            onChange={e => setConditions({ declaration: e.target.checked })}
            className="h-4 w-4 text-villageGreen border-gray-300 rounded"
          />
          <label htmlFor="cond-declaration" className="text-sm font-medium text-gray-700">Declaration</label>
        </div>
        <div>
          <label className={labelCls()} htmlFor="cond-toss">Toss Winner</label>
          <select id="cond-toss" value={c.weWonTheToss ? 'we' : 'they'} onChange={e => setConditions({ weWonTheToss: e.target.value === 'we' })} className={inputCls()}>
            <option value="we">We</option>
            <option value="they">They</option>
          </select>
        </div>
        <div>
          <label className={labelCls()} htmlFor="cond-toss-bat">Decided To</label>
          <select id="cond-toss-bat" value={c.tossWinnerBatted ? 'bat' : 'bowl'} onChange={e => setConditions({ tossWinnerBatted: e.target.value === 'bat' })} className={inputCls()}>
            <option value="bat">Bat</option>
            <option value="bowl">Bowl</option>
          </select>
        </div>
        <div>
          <label className={labelCls()} htmlFor="cond-captain">Captain</label>
          <SearchableSelect
            id="cond-captain"
            value={c.captainId ? String(c.captainId) : ''}
            onChange={v => setConditions({ captainId: parseInt(v, 10) || 0 })}
            options={opts}
            placeholder="— Select captain —"
          />
        </div>
        <div>
          <label className={labelCls()} htmlFor="cond-keeper">Wicket Keeper</label>
          <SearchableSelect
            id="cond-keeper"
            value={c.wicketKeeperId ? String(c.wicketKeeperId) : ''}
            onChange={v => setConditions({ wicketKeeperId: parseInt(v, 10) || 0 })}
            options={opts}
            placeholder="— Select wicket keeper —"
          />
        </div>
        <div className="pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setModal({ kind: 'matchReport' })}
            className="flex items-center gap-2 text-sm text-villageGreen hover:underline font-medium"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">description</span>
            Create / Edit Match Report
          </button>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const matchTitle = match
    ? `vs ${match.opposition?.name ?? '—'} (${match.date ? match.date.slice(0, 10) : '—'})`
    : `Match #${numericMatchId}`;

  const activeSubTab = activeTab === 'home' ? activeHomeSubTab : activeAwaySubTab;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-villageText">
      {/* Fixed top navbar */}
      <div className="flex-none bg-villageGreen text-white flex items-center h-14 px-2 shadow-md z-20">
        <Link to="/admin/scorecards" className="flex items-center justify-center w-10 h-10" aria-label="Back to Scorecards">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-sm font-semibold tracking-wide truncate px-1">{matchTitle}</h1>
        <button
          onClick={handleSave}
          disabled={saving || isLoading}
          aria-label="Save scorecard"
          className="flex items-center justify-center w-10 h-10 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[22px]">{saving ? 'hourglass_empty' : 'cloud_upload'}</span>
        </button>
      </div>

      {/* Fixed secondary tab bar — main sections */}
      <div className="flex-none bg-white border-b border-gray-200 flex z-10">
        {(['conditions', 'home', 'away'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition ${activeTab === tab ? 'border-villageGreen text-villageGreen' : 'border-transparent text-gray-500'}`}
          >
            {tab === 'conditions' ? 'Conditions' : tab === 'home' ? 'Village CC' : 'Opposition'}
          </button>
        ))}
      </div>

      {/* Notification banners */}
      {errorMsg && (
        <div className="flex-none px-4 py-2 text-red-600 text-xs bg-red-50 border-b border-red-200">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="flex-none px-4 py-2 text-green-700 text-xs bg-green-50 border-b border-green-200">{successMsg}</div>
      )}

      {/* Scrollable content */}
      <div className={`flex-1 overflow-y-auto ${activeTab !== 'conditions' ? 'pb-14' : ''}`}>
        {isLoading ? (
          <div className="px-4 pt-4 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="px-4 py-4">
            {activeTab === 'conditions' && renderConditionsTab()}
            {activeTab === 'home' && renderInningsTab('home')}
            {activeTab === 'away' && renderInningsTab('away')}
          </div>
        )}
      </div>

      {/* Fixed bottom tab bar — innings sub-tabs (hidden on Conditions tab) */}
      {activeTab !== 'conditions' && (
        <div className="flex-none fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-20">
          {(['batting', 'bowling', 'fow'] as const).map(t => {
            const isActive = activeSubTab === t;
            const setSubTab = activeTab === 'home'
              ? () => setActiveHomeSubTab(t)
              : () => setActiveAwaySubTab(t);
            return (
              <button
                key={t}
                onClick={setSubTab}
                className={`flex-1 flex flex-col items-center justify-center py-2 text-[10px] font-medium border-t-2 transition ${isActive ? 'border-villageGreen text-villageGreen' : 'border-transparent text-gray-500'}`}
              >
                <span className="material-symbols-outlined text-[20px] leading-none mb-0.5">
                  {t === 'batting' ? 'sports_cricket' : t === 'bowling' ? 'sports_handball' : 'people'}
                </span>
                {t === 'fow' ? "P'ships & FoW" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>
      )}

      {renderModal()}

      {cropSource && (
        <ImageCropper
          src={cropSource}
          onCrop={dataUrl => {
            setMatchReport(r => ({ ...r, base64EncodedImage: dataUrl }));
            setCropSource(null);
          }}
          onCancel={() => setCropSource(null)}
        />
      )}
    </div>
  );
};

export default AdminEditScorecard;
