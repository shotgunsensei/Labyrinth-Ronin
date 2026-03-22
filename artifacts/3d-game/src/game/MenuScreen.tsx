interface MenuScreenProps {
  onStart: () => void;
}

export function MenuScreen({ onStart }: MenuScreenProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 70%)',
      zIndex: 20,
      fontFamily: 'monospace',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#00cec9',
          marginBottom: '8px',
          textShadow: '0 0 20px rgba(0,206,201,0.5)',
          letterSpacing: '4px',
        }}>
          LABYRINTH
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#636e72',
          marginBottom: '40px',
          letterSpacing: '6px',
        }}>
          ENDLESS MAZE RUNNER
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left',
          color: '#b2bec3',
          fontSize: '13px',
          lineHeight: '1.8',
        }}>
          <div style={{ color: '#74b9ff', marginBottom: '8px', fontSize: '14px' }}>HOW TO PLAY</div>
          <div><span style={{ color: '#fdcb6e' }}>WASD / Arrow Keys</span> - Move through the maze</div>
          <div><span style={{ color: '#74b9ff' }}>Push blocks</span> - Walk into blue blocks to push them</div>
          <div><span style={{ color: '#fdcb6e' }}>Reach the exit</span> - Find the glowing yellow tile</div>
          <div><span style={{ color: '#e17055' }}>Avoid hazards</span> - Spikes, creatures, and time running out</div>
          <div style={{ marginTop: '12px', color: '#636e72', fontSize: '11px' }}>
            Difficulty increases each level. How far can you go?
          </div>
        </div>

        <button
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #00cec9, #0984e3)',
            border: 'none',
            color: '#fff',
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            letterSpacing: '4px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 0 20px rgba(0,206,201,0.3)',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,206,201,0.5)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,206,201,0.3)';
          }}
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
