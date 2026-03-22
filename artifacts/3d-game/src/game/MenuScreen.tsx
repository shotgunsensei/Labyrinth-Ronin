interface MenuScreenProps {
  onStart: () => void;
}

const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

export function MenuScreen({ onStart }: MenuScreenProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1a0a0a 0%, #0a0a0a 70%)',
      zIndex: 20,
      fontFamily: 'monospace',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px',
      }}>
        <img
          src={logoUrl}
          alt="Shotgun Ninjas: Labyrinth Ronin"
          style={{
            width: '280px',
            height: '280px',
            objectFit: 'contain',
            marginBottom: '16px',
            filter: 'drop-shadow(0 0 30px rgba(255,0,0,0.4))',
          }}
        />

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left',
          color: '#b2bec3',
          fontSize: '13px',
          lineHeight: '1.8',
          border: '1px solid rgba(255,0,0,0.1)',
        }}>
          <div style={{ color: '#ff4444', marginBottom: '8px', fontSize: '14px', letterSpacing: '2px' }}>HOW TO PLAY</div>
          <div><span style={{ color: '#ff6b6b' }}>WASD / Arrow Keys</span> - Move through the maze</div>
          <div><span style={{ color: '#cc0000' }}>Push blocks</span> - Walk into blue blocks to push them</div>
          <div><span style={{ color: '#ff6b6b' }}>Reach the exit</span> - Find the glowing yellow tile</div>
          <div><span style={{ color: '#cc0000' }}>Avoid hazards</span> - Spikes, creatures, and time running out</div>
          <div style={{ marginTop: '12px', color: '#636e72', fontSize: '11px' }}>
            Difficulty increases each level. How far can you go?
          </div>
        </div>

        <button
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #cc0000, #ff4444)',
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
            boxShadow: '0 0 20px rgba(255,0,0,0.3)',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(255,0,0,0.5)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(255,0,0,0.3)';
          }}
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
