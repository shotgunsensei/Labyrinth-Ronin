import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  levelsCompleted: number;
  createdAt: string;
}

interface GameOverScreenProps {
  score: number;
  level: number;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOverScreen({ score, level, onRestart, onMenu }: GameOverScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch {
    }
  }

  async function submitScore() {
    if (!playerName.trim() || submitted) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score,
          levelsCompleted: level,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        fetchLeaderboard();
      } else {
        setError('Failed to submit score. Try again.');
      }
    } catch {
      setError('Network error. Score not submitted.');
    }
    setLoading(false);
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(10,10,26,0.95)',
      zIndex: 20,
      fontFamily: 'monospace',
      overflow: 'auto',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        padding: '32px',
      }}>
        <h1 style={{
          fontSize: '36px',
          color: '#d63031',
          marginBottom: '4px',
          textShadow: '0 0 20px rgba(214,48,49,0.5)',
          letterSpacing: '4px',
        }}>
          GAME OVER
        </h1>
        <p style={{ fontSize: '11px', color: '#636e72', letterSpacing: '3px', marginBottom: '8px' }}>
          SHOTGUN NINJAS: LABYRINTH RONIN
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          margin: '24px 0',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#636e72' }}>SCORE</div>
            <div style={{ fontSize: '32px', color: '#fdcb6e', fontWeight: 'bold' }}>{score}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#636e72' }}>LEVEL</div>
            <div style={{ fontSize: '32px', color: '#74b9ff', fontWeight: 'bold' }}>{level}</div>
          </div>
        </div>

        {!submitted ? (
          <div style={{ margin: '24px 0' }}>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value.slice(0, 20))}
              placeholder="Enter your name..."
              maxLength={20}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                width: '100%',
                maxWidth: '300px',
                marginBottom: '12px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onKeyDown={e => e.key === 'Enter' && submitScore()}
            />
            <br />
            <button
              onClick={submitScore}
              disabled={!playerName.trim() || loading}
              style={{
                background: playerName.trim() ? '#fdcb6e' : '#636e72',
                border: 'none',
                color: '#1a1a2e',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                cursor: playerName.trim() ? 'pointer' : 'default',
                fontFamily: 'monospace',
                letterSpacing: '2px',
              }}
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT SCORE'}
            </button>
          </div>
        ) : (
          <p style={{ color: '#00b894', margin: '16px 0' }}>Score submitted!</p>
        )}

        {error && (
          <p style={{ color: '#d63031', margin: '8px 0', fontSize: '13px' }}>{error}</p>
        )}

        {leaderboard.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            textAlign: 'left',
          }}>
            <div style={{ color: '#fdcb6e', fontSize: '14px', marginBottom: '12px', textAlign: 'center', letterSpacing: '2px' }}>
              LEADERBOARD
            </div>
            {leaderboard.slice(0, 10).map((entry, i) => (
              <div key={entry.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
                color: i < 3 ? '#fdcb6e' : '#b2bec3',
                fontSize: '13px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span>
                  <span style={{ opacity: 0.5, marginRight: '8px' }}>#{i + 1}</span>
                  {entry.playerName}
                </span>
                <span>
                  <span style={{ color: '#fdcb6e' }}>{entry.score}</span>
                  <span style={{ opacity: 0.4, marginLeft: '8px' }}>L{entry.levelsCompleted}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button
            onClick={onRestart}
            style={{
              background: 'linear-gradient(135deg, #00cec9, #0984e3)',
              border: 'none',
              color: '#fff',
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: '2px',
            }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onMenu}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#b2bec3',
              padding: '12px 32px',
              fontSize: '14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: '2px',
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
