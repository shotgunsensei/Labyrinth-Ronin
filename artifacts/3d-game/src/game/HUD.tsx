import type { GameState } from './useGameState';

interface HUDProps {
  state: GameState;
  onPause: () => void;
}

export function HUD({ state, onPause }: HUDProps) {
  if (state.phase !== 'playing' && state.phase !== 'paused') return null;

  const timerColor = state.timeLeft <= 10 ? '#d63031' : state.timeLeft <= 20 ? '#fdcb6e' : '#00cec9';

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 16px',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '16px',
        backdropFilter: 'blur(4px)',
      }}>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>LEVEL</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#74b9ff' }}>{state.level}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '8px 16px',
          borderRadius: '8px',
          color: timerColor,
          fontFamily: 'monospace',
          fontSize: '28px',
          fontWeight: 'bold',
          backdropFilter: 'blur(4px)',
          transition: 'color 0.3s',
        }}>
          {Math.ceil(state.timeLeft)}s
        </div>
        <button
          onClick={onPause}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#b2bec3',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '14px',
            backdropFilter: 'blur(4px)',
          }}
          title="Pause (ESC)"
        >
          | |
        </button>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 16px',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '16px',
        backdropFilter: 'blur(4px)',
      }}>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>SCORE</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fdcb6e' }}>{state.score}</div>
      </div>
    </div>
  );
}

export function LevelIndicators({ level }: { level: number }) {
  if (level < 2) return null;

  const indicators: { icon: string; label: string; color: string }[] = [];
  if (level >= 2) indicators.push({ icon: '\u25B6', label: 'Walls', color: '#e84393' });
  if (level >= 3) indicators.push({ icon: '\u25B2', label: 'Spikes', color: '#e17055' });
  if (level >= 4) indicators.push({ icon: '\u25C6', label: 'Patrol', color: '#e17055' });
  if (level >= 5) indicators.push({ icon: '\u25A0', label: 'Locked', color: '#636e72' });
  if (level >= 6) indicators.push({ icon: '\u25C6', label: 'Chasers', color: '#d63031' });
  if (level >= 7) indicators.push({ icon: '\u25CB', label: 'Teleport', color: '#6c5ce7' });

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {indicators.map((ind, i) => (
        <div key={i} style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '4px 10px',
          borderRadius: '6px',
          color: ind.color,
          fontFamily: 'monospace',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>{ind.icon}</span> {ind.label}
        </div>
      ))}
    </div>
  );
}
