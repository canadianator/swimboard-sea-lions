import * as React from "react"
import type { HeadFC } from "gatsby"

export default function CounterPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)
  const topic = "sealions/swimboard/live_data"

  React.useEffect(() => {
    if (typeof window === "undefined") return

    let ws: WebSocket;

    const connectDisplayWS = () => {
      ws = new WebSocket("wss://broker.hivemq.com:8000/mqtt")

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "request_sync" }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.topic === topic) {
            setBullpen(data.bullpen)
            setRaceNumber(data.raceNumber)
          }
        } catch (e) {}
      }

      ws.onclose = () => {
        setTimeout(connectDisplayWS, 3000)
      }
    }

    connectDisplayWS()

    return () => {
      if (ws) ws.close()
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
