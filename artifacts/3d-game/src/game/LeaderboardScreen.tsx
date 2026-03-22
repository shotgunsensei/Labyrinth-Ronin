import { useState, useEffect } from 'react';
import { CyberBackground } from './CyberBackground';

interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  levelsCompleted: number;
  createdAt: string;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setLeaderboard(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
        maxWidth: '500px',
        width: '90%',
        padding: '40px 20px',
        margin: 'auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <h1 style={{
          fontSize: '28px',
          color: '#ff4444',
          marginBottom: '4px',
          letterSpacing: '4px',
          textShadow: '0 0 20px rgba(255,0,0,0.4)',
        }}>
          LEADERBOARD
        </h1>
        <p style={{ fontSize: '11px', color: '#636e72', letterSpacing: '3px', marginBottom: '24px' }}>
          SHOTGUN NINJAS: LABYRINTH RONIN
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(255,0,0,0.1)',
        }}>
          {loading ? (
            <p style={{ color: '#636e72', padding: '20px' }}>Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p style={{ color: '#636e72', padding: '20px' }}>No scores yet. Be the first!</p>
          ) : (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                color: '#636e72',
                fontSize: '11px',
                letterSpacing: '2px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '4px',
              }}>
                <span>RANK</span>
                <span>PLAYER</span>
                <span>SCORE</span>
              </div>
              {leaderboard.slice(0, 20).map((entry, i) => (
                <div key={entry.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  color: i < 3 ? '#ff6b6b' : '#b2bec3',
                  fontSize: '14px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: i < 3 ? 'rgba(255,0,0,0.03)' : 'transparent',
                }}>
                  <span style={{ width: '40px', textAlign: 'left' }}>
                    {i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : `#${i + 1}`}
                  </span>
                  <span style={{ flex: 1, textAlign: 'center' }}>
                    {entry.playerName}
                    <span style={{ opacity: 0.4, marginLeft: '6px', fontSize: '11px' }}>L{entry.levelsCompleted}</span>
                  </span>
                  <span style={{ width: '60px', textAlign: 'right', color: '#fdcb6e', fontWeight: 'bold' }}>
                    {entry.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#b2bec3',
            padding: '12px 40px',
            fontSize: '14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            letterSpacing: '3px',
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
