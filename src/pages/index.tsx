import * as React from "react"
import type { HeadFC } from "gatsby"

declare global {
  interface Window {
    Pusher: any;
  }
}

export default function IndexPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)
  const channelRef = React.useRef<any>(null)
  const [status, setStatus] = React.useState("Connecting...")

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const script = document.createElement("script")
    script.src = "https://js.pusher.com/8.0.1/pusher.min.js"
    script.async = true
    script.onload = () => {
      // Setup a fully self-contained client-side connection
      const pusher = new window.Pusher("app-key", {
        cluster: "mt1",
        wsHost: "sockjs-mt1.pusher.com",
        httpHost: "sockjs-mt1.pusher.com",
        forceTLS: true,
        enabledTransports: ["ws", "xhr_streaming"],
        // This bypasses the need for a separate backend authentication server
        userAuthentication: { endpoint: "none" },
        channelAuthorization: {
          endpoint: "none",
          transport: "ajax",
          customHandler: (params: any, callback: any) => {
            callback(null, { auth: "app-key:mock-auth" });
          }
        }
      })

      pusher.connection.bind("state_change", (states: any) => {
        setStatus(states.current === "connected" ? "Connected" : "Reconnecting...")
      })

      // Client-to-client events REQUIRE a "private-" prefix
      const channel = pusher.subscribe("private-sea-lions-swimboard")
      channelRef.current = channel

      channel.bind("client-request-sync", () => {
        channel.trigger("client-sync-data", { bullpen, raceNumber })
      })
    }
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [bullpen, raceNumber])

  const sendUpdate = (eventName: string, val: number) => {
    if (channelRef.current && status === "Connected") {
      channelRef.current.trigger(eventName, { value: val })
    }
  }

  const updateBullpen = (newValue: number) => {
    const val = Math.max(0, newValue)
    setBullpen(val)
    sendUpdate("client-update-bullpen", val)
  }

  const updateRace = (newValue: number) => {
    const val = Math.max(0, newValue)
    setRaceNumber(val)
    sendUpdate("client-update-race", val)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', color: '#0070f3', margin: '10px 0 2px 0' }}>Sea Lions Remote</h1>
      <div style={{ fontSize: '12px', color: status === "Connected" ? "green" : "orange", marginBottom: '15px', fontWeight: 'bold' }}>
        Status: {status}
      </div>
      
      <div style={{ border: '2px solid #0070f3', padding: '20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: '#f0f7ff' }}>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '18px', display: 'block', color: '#555' }}>BULLPEN</span>
          <strong style={{ fontSize: '48px', color: '#ff3333' }}>{String(bullpen).padStart(3, '0')}</strong>
        </div>
        <div>
          <span style={{ fontSize: '18px', display: 'block', color: '#555' }}>EVENT / RACE</span>
          <strong style={{ fontSize: '48px', color: '#33ff33' }}>{String(raceNumber).padStart(3, '0')}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '25px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', width: '45%' }}>
          <h3>Bullpen</h3>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => updateBullpen(bullpen + 1)}>+ ADD</button>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '14px', cursor: 'pointer' }} onClick={() => updateBullpen(bullpen - 1)}>- SUB</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', width: '45%' }}>
          <h3>Race</h3>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => updateRace(raceNumber + 1)}>+ ADD</button>
          <button style={{ padding: '12px', margin: '5px', width: '90%', fontSize: '14px', cursor: 'pointer' }} onClick={() => updateRace(raceNumber - 1)}>- SUB</button>
        </div>
      </div>

      <a 
        href="./counter" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#222', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', width: '80%' }}
      >
        Open Display Board Dashboard ↗
      </a>
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
