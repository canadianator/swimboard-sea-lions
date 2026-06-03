import * as React from "react"
import type { HeadFC } from "gatsby"

export default function IndexPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)
  const channelRef = React.useRef<BroadcastChannel | null>(null)

  // Initialize the communication channel safely inside the browser
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      channelRef.current = new BroadcastChannel("swimboard_channel")
      
      // Sync initial states if the counter page requests it
      channelRef.current.onmessage = (event) => {
        if (event.data.type === "REQUEST_SYNC") {
          channelRef.current?.postMessage({
            type: "SYNC",
            bullpen,
            raceNumber,
          })
        }
      }
    }
    return () => {
      channelRef.current?.close()
    }
  }, [bullpen, raceNumber])

  const updateBullpen = (newValue: number) => {
    const val = Math.max(0, newValue)
    setBullpen(val)
    channelRef.current?.postMessage({ type: "UPDATE_BULLPEN", value: val })
  }

  const updateRace = (newValue: number) => {
    const val = Math.max(0, newValue)
    setRaceNumber(val)
    channelRef.current?.postMessage({ type: "UPDATE_RACE", value: val })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Swimboard Sea Lions Controller</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <h2>Current Status</h2>
        <p style={{ fontSize: '20px' }}><b>Bullpen:</b> {String(bullpen).padStart(3, '0')}</p>
        <p style={{ fontSize: '20px' }}><b>Event/Race:</b> {String(raceNumber).padStart(3, '0')}</p>
      </div>

      <h2>Update Counters</h2>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '6px', width: '140px' }}>
          <h3>Bullpen</h3>
          <button style={{ padding: '8px', margin: '4px', width: '80%' }} onClick={() => updateBullpen(bullpen - 1)}>- Subtract</button>
          <button style={{ padding: '8px', margin: '4px', width: '80%' }} onClick={() => updateBullpen(bullpen + 1)}>+ Add</button>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '6px', width: '140px' }}>
          <h3>Race Number</h3>
          <button style={{ padding: '8px', margin: '4px', width: '80%' }} onClick={() => updateRace(raceNumber - 1)}>- Subtract</button>
          <button style={{ padding: '8px', margin: '4px', width: '80%' }} onClick={() => updateRace(raceNumber + 1)}>+ Add</button>
        </div>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
      
      {/* Target Link directly to your public display dashboard */}
      <a 
        href="./counter" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}
      >
        Open Display Board Dashboard ↗
      </a>
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
