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
        enabledTransports: ["ws", "xhr_streaming"],
        userAuthentication: { endpoint: "none" },
        channelAuthorization: {
          endpoint: "none",
          transport: "ajax",
          customHandler: (params: any, callback: any) => {
            callback(null, { auth: "app-key:mock-auth" });
          }
        }
      })

      const channel = pusher.subscribe("private-sea-lions-channel")

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

      channel.bind("pusher:subscription_succeeded", () => {
        channel.emit("client-request-sync", {})
      })
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
