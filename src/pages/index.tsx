import * as React from "react"
import type { HeadFC } from "gatsby"

// Unique ID to isolate your swim meet data stream from other users
const CHANNEL_ID = "sealions_swim_meet_2026"
const API_KEY = "v3/1?api_key=o7YgUXvAL92Z9ZjLg90Z5f5Z5f5Z5f5Z5f5Z5f5Z"

export default function IndexPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)
  const [status, setStatus] = React.useState("Disconnected")
  const wsRef = React.useRef<WebSocket | null>(null)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    // Connect via native browser WebSockets directly to the public cluster
    const ws = new WebSocket(`wss://demo.piesocket.com/${API_KEY}&notify=1`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus("Connected")
      // Send a ping to wake up the channel and sync up coordinates
      ws.send(JSON.stringify({ type: "ping", channel: CHANNEL_ID }))
    }

    ws.onclose = () => {
      setStatus("Disconnected")
    }

    ws.onerror = () => {
      setStatus("Error")
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.channel !== CHANNEL_ID) return

        if (msg.type === "sync-request") {
          ws.send(JSON.stringify({
            type: "sync-broadcast",
            channel: CHANNEL_ID,
            bullpen: localStorage.getItem("sl_bp") || "0",
            race: localStorage.getItem("sl_rc") || "0"
          }))
        }
      } catch (e) {
        // Handle unexpected parsing frames safely
      }
    }

    // Pull initial states out of storage fallback safely
    const localBp = localStorage.getItem("sl_bp")
    const localRc = localStorage.getItem("sl_rc")
    if (localBp) setBullpen(parseInt(localBp, 10))
    if (localRc) setRaceNumber(parseInt(localRc, 10))

    return () => {
      ws.close()
    }
  }, [])

  const publishChange = (bpVal: number, rcVal: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "update",
        channel: CHANNEL_ID,
        bullpen: bpVal,
        race: rcVal
      }))
    }
  }

  const updateBullpen = (newValue: number) => {
    const val = Math.max(0, newValue)
    setBullpen(val)
    localStorage.setItem("sl_bp", String(val))
    publishChange(val, raceNumber)
  }

  const updateRace = (newValue: number) => {
    const val = Math.max(0, newValue)
    setRaceNumber(val)
    localStorage.setItem("sl_rc", String(val))
    publishChange(bullpen, val)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '26px', color: '#0070f3', margin: '10px 0 2px 0', fontWeight: '800' }}>Sea Lions Remote</h1>
      <div style={{ fontSize: '14px', color: status === "Connected" ? "#34c759" : "#ff3b30", marginBottom: '20px', fontWeight: 'bold' }}>
        ● {status}
      </div>
      
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
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
