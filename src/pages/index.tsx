import * as React from "react"
import type { HeadFC } from "gatsby"

export default function IndexPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)

  // Load initial values from localStorage on page load
  React.useEffect(() => {
    if (typeof window === "undefined") return
    
    const savedBullpen = localStorage.getItem("swim_bullpen")
    const savedRace = localStorage.getItem("swim_race")
    
    if (savedBullpen) setBullpen(parseInt(savedBullpen, 10))
    if (savedRace) setRaceNumber(parseInt(savedRace, 10))
  }, [])

  const updateBullpen = (newValue: number) => {
    const val = Math.max(0, newValue)
    setBullpen(val)
    localStorage.setItem("swim_bullpen", String(val))
    // Trigger a storage event manually to notify other tabs on the same device
    localStorage.setItem("swim_timestamp", String(Date.now()))
  }

  const updateRace = (newValue: number) => {
    const val = Math.max(0, newValue)
    setRaceNumber(val)
    localStorage.setItem("swim_race", String(val))
    // Trigger a storage event manually to notify other tabs on the same device
    localStorage.setItem("swim_timestamp", String(Date.now()))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '26px', color: '#0070f3', margin: '10px 0 20px 0', fontWeight: '800' }}>Sea Lions Remote</h1>
      
      <div style={{ border: '2px solid #0070f3', padding: '20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: '#f0f7ff' }}>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '16px', display: 'block', color: '#555', fontWeight: 'bold' }}>BULLPEN</span>
          <strong style={{ fontSize: '64px', color: '#ff3333', fontFamily: 'monospace' }}>{String(bullpen).padStart(3, '0')}</strong>
        </div>
        <div>
          <span style={{ fontSize: '16px', display: 'block', color: '#555', fontWeight: 'bold' }}>EVENT / RACE</span>
          <strong style={{ fontSize: '64px', color: '#33ff33', fontFamily: 'monospace' }}>{String(raceNumber).padStart(3, '0')}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', width: '45%', backgroundColor: '#fff' }}>
          <h3 style={{ margin: '5px 0' }}>Bullpen</h3>
          <button style={{ padding: '15px', margin: '5px', width: '90%', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateBullpen(bullpen + 1)}>+ ADD</button>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '16px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateBullpen(bullpen - 1)}>- SUB</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', width: '45%', backgroundColor: '#fff' }}>
          <h3 style={{ margin: '5px 0' }}>Race</h3>
          <button style={{ padding: '15px', margin: '5px', width: '90%', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateRace(raceNumber + 1)}>+ ADD</button>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '16px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateRace(raceNumber - 1)}>- SUB</button>
        </div>
      </div>

      {/* Explicitly targets the relative project page path layout */}
      <a 
        href="./counter/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: 'inline-block', padding: '14px 24px', backgroundColor: '#222', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', width: '85%', fontSize: '16px' }}
      >
        Open Scoreboard Screen ↗
      </a>
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
