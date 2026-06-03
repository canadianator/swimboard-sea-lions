import * as React from "react"
import type { HeadFC } from "gatsby"

const CHANNEL_ID = "sealions_swim_meet_2026"
const API_KEY = "v3/1?api_key=o7YgUXvAL92Z9ZjLg90Z5f5Z5f5Z5f5Z5f5Z5f5Z"

export default function CounterPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const ws = new WebSocket(`wss://demo.piesocket.com/${API_KEY}&notify=1`)

    ws.onopen = () => {
      // Request current data from the controller if it's open
      ws.send(JSON.stringify({ type: "sync-request", channel: CHANNEL_ID }))
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.channel !== CHANNEL_ID) return

        if (msg.type === "update") {
          setBullpen(parseInt(msg.bullpen, 10) || 0)
          setRaceNumber(parseInt(msg.race, 10) || 0)
        } else if (msg.type === "sync-broadcast") {
          setBullpen(parseInt(msg.bullpen, 10) || 0)
          setRaceNumber(parseInt(msg.race, 10) || 0)
        }
      } catch (e) {
        console.error(e)
      }
    }

    return () => {
      ws.close()
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
