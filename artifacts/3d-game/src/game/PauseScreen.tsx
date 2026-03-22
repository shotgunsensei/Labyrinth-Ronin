interface PauseScreenProps {
  onResume: () => void;
  onSaveAndExit: () => void;
  level: number;
  score: number;
}

export function PauseScreen({ onResume, onSaveAndExit, level, score }: PauseScreenProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,10,0.85)',
      zIndex: 30,
      fontFamily: 'monospace',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        padding: '40px',
        background: 'rgba(20,20,30,0.9)',
        borderRadius: '16px',
        border: '1px solid rgba(255,0,0,0.2)',
      }}>
        <h2 style={{
          fontSize: '32px',
          color: '#ff4444',
          marginBottom: '8px',
          letterSpacing: '4px',
          textShadow: '0 0 20px rgba(255,0,0,0.4)',
        }}>
          PAUSED
        </h2>
        <p style={{ color: '#636e72', fontSize: '12px', marginBottom: '24px', letterSpacing: '2px' }}>
          PROGRESS AUTO-SAVED
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '28px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#636e72' }}>LEVEL</div>
            <div style={{ fontSize: '24px', color: '#74b9ff', fontWeight: 'bold' }}>{level}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#636e72' }}>SCORE</div>
            <div style={{ fontSize: '24px', color: '#fdcb6e', fontWeight: 'bold' }}>{score}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={onResume}
            style={{
              background: 'linear-gradient(135deg, #cc0000, #ff4444)',
              border: 'none',
              color: '#fff',
              padding: '14px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: '3px',
              width: '220px',
              boxShadow: '0 0 15px rgba(255,0,0,0.3)',
            }}
          >
            RESUME
          </button>
          <button
            onClick={onSaveAndExit}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#b2bec3',
              padding: '12px 40px',
              fontSize: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              width: '220px',
            }}
          >
            SAVE & EXIT
          </button>
        </div>

        <p style={{ color: '#4a4a5a', fontSize: '11px', marginTop: '20px' }}>
          Press ESC or P to resume
        </p>
      </div>
    </div>
  );
}
