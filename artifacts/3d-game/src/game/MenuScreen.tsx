import { CyberBackground } from './CyberBackground';
import { hasSavedGame } from './useGameState';

interface MenuScreenProps {
  onStart: () => void;
  onResume: () => void;
  onShowLeaderboard: () => void;
}

const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

export function MenuScreen({ onStart, onResume, onShowLeaderboard }: MenuScreenProps) {
  const hasSave = hasSavedGame();

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'radial-gradient(ellipse at center, #1a0a0a 0%, #050505 70%)',
      zIndex: 20,
      fontFamily: 'monospace',
      overflow: 'auto',
    }}>
      <CyberBackground />
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '90%',
        padding: '24px 20px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <img
          src={logoUrl}
          alt="Shotgun Ninjas: Labyrinth Ronin"
          style={{
            width: 'min(280px, 60vw)',
            height: 'auto',
            maxHeight: '35vh',
            objectFit: 'contain',
            marginBottom: '16px',
            filter: 'drop-shadow(0 0 30px rgba(255,0,0,0.4))',
          }}
        />

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'left',
          color: '#b2bec3',
          fontSize: '13px',
          lineHeight: '1.8',
          border: '1px solid rgba(255,0,0,0.1)',
          width: '100%',
          maxWidth: '440px',
        }}>
          <div style={{ color: '#ff4444', marginBottom: '8px', fontSize: '14px', letterSpacing: '2px' }}>HOW TO PLAY</div>
          <div><span style={{ color: '#ff6b6b' }}>WASD / Arrow Keys</span> - Move through the maze</div>
          <div><span style={{ color: '#cc0000' }}>Push blocks</span> - Walk into blue blocks to push them</div>
          <div><span style={{ color: '#ff6b6b' }}>Reach the exit</span> - Find the glowing yellow tile</div>
          <div><span style={{ color: '#cc0000' }}>Avoid hazards</span> - Spikes, creatures, and time running out</div>
          <div><span style={{ color: '#ff6b6b' }}>ESC / P</span> - Pause & auto-save</div>
          <div style={{ marginTop: '12px', color: '#636e72', fontSize: '11px' }}>
            Difficulty increases each level. How far can you go?
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
          {hasSave && (
            <button
              onClick={onResume}
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
                width: '100%',
                boxShadow: '0 0 20px rgba(255,0,0,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
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
              CONTINUE
            </button>
          )}

          <button
            onClick={onStart}
            style={{
              background: hasSave ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #cc0000, #ff4444)',
              border: hasSave ? '1px solid rgba(255,255,255,0.15)' : 'none',
              color: '#fff',
              padding: '16px 48px',
              fontSize: hasSave ? '14px' : '18px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: hasSave ? '3px' : '4px',
              width: '100%',
              boxShadow: hasSave ? 'none' : '0 0 20px rgba(255,0,0,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            NEW GAME
          </button>

          <button
            onClick={onShowLeaderboard}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,68,68,0.3)',
              color: '#ff6b6b',
              padding: '12px 32px',
              fontSize: '13px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: '3px',
              width: '100%',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,68,68,0.6)';
              (e.target as HTMLButtonElement).style.color = '#ff4444';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,68,68,0.3)';
              (e.target as HTMLButtonElement).style.color = '#ff6b6b';
            }}
          >
            LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
