import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type Position = [number, number]

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE: Position[] = [[10, 10]]
const INITIAL_DIRECTION: Position = [1, 0]
const INITIAL_FOOD: Position = [15, 15]

function App() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const moveSnake = useCallback(() => {
    const newSnake = [...snake]
    const head = newSnake[0]
    const newHead: Position = [
      (head[0] + direction[0] + GRID_SIZE) % GRID_SIZE,
      (head[1] + direction[1] + GRID_SIZE) % GRID_SIZE
    ]

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(prevScore => prevScore + 1)
      setFood(getRandomPosition())
    } else {
      newSnake.pop()
    }

    newSnake.unshift(newHead)

    if (checkCollision(newHead, newSnake.slice(1))) {
      setGameOver(true)
    } else {
      setSnake(newSnake)
    }
  }, [snake, direction, food])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection([0, -1])
          break
        case 'ArrowDown':
          setDirection([0, 1])
          break
        case 'ArrowLeft':
          setDirection([-1, 0])
          break
        case 'ArrowRight':
          setDirection([1, 0])
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(moveSnake, 100)
      return () => clearInterval(gameLoop)
    }
  }, [gameOver, moveSnake])

  const getRandomPosition = (): Position => {
    return [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE)
    ]
  }

  const checkCollision = (head: Position, body: Position[]): boolean => {
    return body.some(segment => segment[0] === head[0] && segment[1] === head[1])
  }

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(INITIAL_FOOD)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="mb-4">Score: {score}</div>
      <div
        className="border-2 border-gray-300"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          position: 'relative',
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="bg-green-500"
            style={{
              position: 'absolute',
              left: segment[0] * CELL_SIZE,
              top: segment[1] * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}
        <div
          className="bg-red-500"
          style={{
            position: 'absolute',
            left: food[0] * CELL_SIZE,
            top: food[1] * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />
      </div>
      <Dialog open={gameOver} onOpenChange={setGameOver}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
            <DialogDescription>
              Your score: {score}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={resetGame}>Play Again</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
