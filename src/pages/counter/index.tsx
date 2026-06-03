import * as React from "react"
import type { HeadFC } from "gatsby"

export default function CounterPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    // Sync current values immediately upon opening the board
    const savedBullpen = localStorage.getItem("swim_bullpen")
    const savedRace = localStorage.getItem("swim_race")
    if (savedBullpen) setBullpen(parseInt(savedBullpen, 10))
    if (savedRace) setRaceNumber(parseInt(savedRace, 10))

    // Real-time listener that catches updates from the controller page
    const handleStorageChange = (e: StorageEvent) => {
      const savedBullpen = localStorage.getItem("swim_bullpen")
      const savedRace = localStorage.getItem("swim_race")
      
      if (savedBullpen) setBullpen(parseInt(savedBullpen, 10))
      if (savedRace) setRaceNumber(parseInt(savedRace, 10))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <div style={{ 
      backgroundColor: '#0a0a0c', 
      color: '#fff', 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      margin: 0,
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', width: '95%', maxWidth: '1300px' }}>
        <h1 style={{ fontSize: '4rem', color: '#0070f3', letterSpacing: '6px', margin: '0 0 40px 0', textTransform: 'uppercase', fontWeight: '900' }}>
          Sea Lions Scoreboard
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '40px', width: '100%' }}>
          <div style={{ backgroundColor: '#141416', padding: '50px 20px', borderRadius: '32px', width: '46%', border: '2px solid #222' }}>
            <div style={{ fontSize: '3rem', color: '#e5e5ea', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '2px' }}>BULLPEN</div>
            <div style={{ fontSize: '15rem', fontWeight: 'bold', color: '#ff453a', fontFamily: 'monospace', lineHeight: '1' }}>
              {String(bullpen).padStart(3, '0')}
            </div>
          </div>
          
          <div style={{ backgroundColor: '#141416', padding: '50px 20px', borderRadius: '32px', width: '46%', border: '2px solid #222' }}>
            <div style={{ fontSize: '3rem', color: '#e5e5ea', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '2px' }}>EVENT / RACE</div>
            <div style={{ fontSize: '15rem', fontWeight: 'bold', color: '#30d158', fontFamily: 'monospace', lineHeight: '1' }}>
              {String(raceNumber).padStart(3, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Display Board</title>
