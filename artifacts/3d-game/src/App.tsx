import { useGameState } from './game/useGameState';
import { GameScene } from './game/GameScene';
import { HUD, LevelIndicators } from './game/HUD';
import { MenuScreen } from './game/MenuScreen';
import { GameOverScreen } from './game/GameOverScreen';

function App() {
  const { state, startGame, nextLevel, movePlayer, updateTime, updateEnemies, returnToMenu } = useGameState();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#0a0a1a' }}>
      {state.phase === 'menu' && (
        <MenuScreen onStart={startGame} />
      )}

      {state.phase === 'playing' && state.maze && (
        <>
          <GameScene
            state={state}
            movePlayer={movePlayer}
            updateTime={updateTime}
            updateEnemies={updateEnemies}
            nextLevel={nextLevel}
          />
          <HUD state={state} />
          <LevelIndicators level={state.level} />
        </>
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
