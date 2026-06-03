import * as React from "react"
import type { HeadFC } from "gatsby"

export default function CounterPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const script = document.createElement("script")
    script.src = "https://js.pusher.com/8.0.1/pusher.min.js"
    script.async = true
    script.onload = () => {
      const pusher = new window.Pusher("app-key", {
        cluster: "mt1",
        wsHost: "sockjs-mt1.pusher.com",
        httpHost: "sockjs-mt1.pusher.com",
        forceTLS: true,
        enabledTransports: ["ws", "xhr_streaming"]
      })

      const channel = pusher.subscribe("sea-lions-swimboard")

      channel.bind("client-update-bullpen", (data: { value: number }) => {
        setBullpen(data.value)
      })

      channel.bind("client-update-race", (data: { value: number }) => {
        setRaceNumber(data.value)
      })

      channel.bind("client-sync-data", (data: { bullpen: number, raceNumber: number }) => {
        setBullpen(data.bullpen)
        setRaceNumber(data.raceNumber)
      })

      // Ask the controller for the current numbers as soon as this page loads
      setTimeout(() => {
        channel.emit("client-request-sync", {})
      }, 1000)
    }
    document.head.appendChild(script)

    return () => {
      script.remove()
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
      <div style={{ textAlign: 'center', width: '90%', maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#0070f3', letterSpacing: '4px', margin: '0 0 60px 0', textTransform: 'uppercase', fontWeight: '900' }}>
          Sea Lions Swimboard
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '40px', width: '100%' }}>
          <div style={{ backgroundColor: '#141416', padding: '40px', borderRadius: '24px', width: '45%', border: '1px solid #222', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '2.5rem', color: '#888', fontWeight: 'bold', marginBottom: '20px' }}>BULLPEN</div>
            <div style={{ fontSize: '12rem', fontWeight: 'bold', color: '#ff3b30', fontFamily: 'monospace', lineHeight: '1' }}>
              {String(bullpen).padStart(3, '0')}
            </div>
          </div>
          
          <div style={{ backgroundColor: '#141416', padding: '40px', borderRadius: '24px', width: '45%', border: '1px solid #222', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '2.5rem', color: '#888', fontWeight: 'bold', marginBottom: '20px' }}>EVENT / RACE</div>
            <div style={{ fontSize: '12rem', fontWeight: 'bold', color: '#34c759', fontFamily: 'monospace', lineHeight: '1' }}>
              {String(raceNumber).padStart(3, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Display Board</title>
