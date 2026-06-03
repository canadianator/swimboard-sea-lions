import * as React from "react"
import type { HeadFC } from "gatsby"

export default function CounterPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const channel = new BroadcastChannel("swimboard_channel")

    // Listen for real-time adjustments coming from the controller tab
    channel.onmessage = (event) => {
      if (event.data.type === "UPDATE_BULLPEN") {
        setBullpen(event.data.value)
      } else if (event.data.type === "UPDATE_RACE") {
        setRaceNumber(event.data.value)
      } else if (event.data.type === "SYNC") {
        setBullpen(event.data.bullpen)
        setRaceNumber(event.data.raceNumber)
      }
    }

    // Request current numbers from controller immediately upon opening tab
    channel.postMessage({ type: "REQUEST_SYNC" })

    return () => {
      channel.close()
    }
  }, [])

  return (
    <div style={{ 
      backgroundColor: '#111', 
      color: '#fff', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: 'monospace' 
    }}>
      <div style={{ textAlign: 'center', width: '80%' }}>
        <h1 style={{ fontSize: '3rem', color: '#0070f3', marginBottom: '50px' }}>SEA LIONS SWIMBOARD</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <div>
            <div style={{ fontSize: '2rem', color: '#aaa' }}>BULLPEN</div>
            <div style={{ fontSize: '10rem', fontWeight: 'bold', color: '#ff3333' }}>
              {String(bullpen).padStart(3, '0')}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '2rem', color: '#aaa' }}>EVENT / RACE</div>
            <div style={{ fontSize: '10rem', fontWeight: 'bold', color: '#33ff33' }}>
              {String(raceNumber).padStart(3, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Display Board</title>
