import { useState } from 'react';
import { useGameState } from './game/useGameState';
import { GameScene } from './game/GameScene';
import { HUD, LevelIndicators } from './game/HUD';
import { MenuScreen } from './game/MenuScreen';
import { GameOverScreen } from './game/GameOverScreen';
import { PauseScreen } from './game/PauseScreen';
import { LeaderboardScreen } from './game/LeaderboardScreen';

function App() {
  const {
    state,
    startGame,
    resumeSave,
    nextLevel,
    pauseGame,
    resumeGame,
    movePlayer,
    updateTime,
    updateMovingWalls,
    updateEnemies,
    returnToMenu,
    saveAndExit,
  } = useGameState();

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (showLeaderboard) {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#0a0a1a' }}>
        <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#0a0a1a' }}>
      {state.phase === 'menu' && (
        <MenuScreen
          onStart={startGame}
          onResume={resumeSave}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {(state.phase === 'playing' || state.phase === 'paused') && state.maze && (
        <>
          <GameScene
            state={state}
            movePlayer={movePlayer}
            updateTime={updateTime}
            updateEnemies={updateEnemies}
            updateMovingWalls={updateMovingWalls}
            nextLevel={nextLevel}
          />
          <HUD state={state} onPause={pauseGame} />
          <LevelIndicators level={state.level} />
        </>
      )}

      {state.phase === 'paused' && (
        <PauseScreen
          onResume={resumeGame}
          onSaveAndExit={saveAndExit}
          level={state.level}
          score={state.score}
        />
      )}

      {state.phase === 'gameover' && (
        <GameOverScreen
          score={state.score}
          level={state.level}
          onRestart={startGame}
          onMenu={returnToMenu}
        />
      )}
    </div>
  );
}

export default App;
