import * as React from "react"
import type { HeadFC } from "gatsby"

declare global {
  interface Window {
    mqtt: any;
  }
}

// A unique ID suffix to prevent global public topic collisions
const TOPIC_ID = "sealions_swim_2026_prod"

export default function IndexPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)
  const [status, setStatus] = React.useState("Disconnected")
  const clientRef = React.useRef<any>(null)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const script = document.createElement("script")
    script.src = "https://unpkg.com/mqtt/dist/mqtt.min.js"
    script.async = true
    script.onload = () => {
      try {
        // Explicitly separating connection details fixes browser websocket framing issues
        const client = window.mqtt.connect({
          host: 'broker.hivemq.com',
          port: 8000,
          protocol: 'ws',
          path: '/mqtt',
          clientId: 'sl_remote_' + Math.random().toString(16).substr(2, 8)
        })
        
        clientRef.current = client

        client.on("connect", () => {
          setStatus("Connected")
          client.subscribe(`${TOPIC_ID}/sync/response`)
          // Ask display board for data if it's already running
          client.publish(`${TOPIC_ID}/sync/request`, "sync")
        })

        client.on("error", (err: any) => {
          console.error("MQTT Error:", err)
          setStatus("Error Connecting")
        })

        client.on("close", () => {
          setStatus("Disconnected")
        })

        client.on("message", (topic: string, message: any) => {
          if (topic === `${TOPIC_ID}/sync/response`) {
            try {
              const data = JSON.parse(message.toString())
              if (typeof data.bullpen === "number") setBullpen(data.bullpen)
              if (typeof data.raceNumber === "number") setRaceNumber(data.raceNumber)
            } catch (e) {
              console.error(e)
            }
          }
        })
      } catch (err) {
        console.error("Initialization Error:", err)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (clientRef.current) {
        clientRef.current.end()
      }
      script.remove()
    }
  }, [])

  const updateBullpen = (newValue: number) => {
    const val = Math.max(0, newValue)
    setBullpen(val)
    if (clientRef.current && status === "Connected") {
      clientRef.current.publish(`${TOPIC_ID}/bullpen`, String(val), { retain: true, qos: 1 })
    }
  }

  const updateRace = (newValue: number) => {
    const val = Math.max(0, newValue)
    setRaceNumber(val)
    if (clientRef.current && status === "Connected") {
      clientRef.current.publish(`${TOPIC_ID}/race`, String(val), { retain: true, qos: 1 })
    }
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
