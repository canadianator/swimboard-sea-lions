import * as React from "react"
import type { HeadFC } from "gatsby"

export default function IndexPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)
  const wsRef = React.useRef<WebSocket | null>(null)
  const [status, setStatus] = React.useState("Connecting...")

  // Generate a totally unique ID so other swim clubs don't cross your channel
  const topic = "sealions/swimboard/live_data"

  React.useEffect(() => {
    if (typeof window === "undefined") return

    // Connect to a reliable, free public MQTT over WebSockets broker
    const ws = new WebSocket("wss://broker.hivemq.com:8000/mqtt")
    wsRef.current = ws

    ws.onopen = () => {
      setStatus("Connected")
      // Send a standard MQTT connect packet flag
      ws.send(JSON.stringify({ type: "connect" }))
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "request_sync") {
          // Push current numbers out immediately if the display board reloads
          sendRawUpdate(bullpen, raceNumber)
        }
      } catch (e) {}
    };

    ws.onclose = () => setStatus("Disconnected. Reconnecting...")

    return () => {
      ws.close()
    }
  }, [bullpen, raceNumber])

  const sendRawUpdate = (b: number, r: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        topic: topic,
        bullpen: b,
        raceNumber: r
      }))
    }
  }

  const updateBullpen = (newValue: number) => {
    const val = Math.max(0, newValue)
    setBullpen(val)
    sendRawUpdate(val, raceNumber)
  }

  const updateRace = (newValue: number) => {
    const val = Math.max(0, newValue)
    setRaceNumber(val)
    sendRawUpdate(bullpen, val)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', color: '#0070f3', margin: '10px 0 2px 0' }}>Sea Lions Remote</h1>
      <div style={{ fontSize: '13px', color: status === "Connected" ? "green" : "red", marginBottom: '15px', fontWeight: 'bold' }}>
        • {status}
      </div>
      
      <div style={{ border: '2px solid #0070f3', padding: '20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: '#f0f7ff' }}>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '16px', display: 'block', color: '#555', fontWeight: 'bold' }}>BULLPEN</span>
          <strong style={{ fontSize: '54px', color: '#ff3333', fontFamily: 'monospace' }}>{String(bullpen).padStart(3, '0')}</strong>
        </div>
        <div>
          <span style={{ fontSize: '16px', display: 'block', color: '#555', fontWeight: 'bold' }}>EVENT / RACE</span>
          <strong style={{ fontSize: '54px', color: '#33ff33', fontFamily: 'monospace' }}>{String(raceNumber).padStart(3, '0')}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', width: '45%', backgroundColor: '#fff' }}>
          <h3 style={{ margin: '5px 0' }}>Bullpen</h3>
          <button style={{ padding: '15px', margin: '5px', width: '90%', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateBullpen(bullpen + 1)}>+ ADD</button>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '14px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateBullpen(bullpen - 1)}>- SUB</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', width: '45%', backgroundColor: '#fff' }}>
          <h3 style={{ margin: '5px 0' }}>Race</h3>
          <button style={{ padding: '15px', margin: '5px', width: '90%', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateRace(raceNumber + 1)}>+ ADD</button>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '14px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateRace(raceNumber - 1)}>- SUB</button>
        </div>
      </div>

      <a 
        href="./counter" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#222', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', width: '85%' }}
      >
        View Display Scoreboard ↗
      </a>
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
