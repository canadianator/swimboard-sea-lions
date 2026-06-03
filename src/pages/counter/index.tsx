import * as React from "react"
import type { HeadFC } from "gatsby"

const TOPIC_ID = "sealions_swim_2026_prod"

export default function CounterPage() {
  const [bullpen, setBullpen] = React.useState(0)
  const [raceNumber, setRaceNumber] = React.useState(0)
  const stateRef = React.useRef({ bullpen: 0, raceNumber: 0 })

  React.useEffect(() => {
    stateRef.current = { bullpen, raceNumber }
  }, [bullpen, raceNumber])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const script = document.createElement("script")
    script.src = "https://unpkg.com/mqtt/dist/mqtt.min.js"
    script.async = true
    script.onload = () => {
      try {
        const client = window.mqtt.connect({
          host: 'broker.hivemq.com',
          port: 8000,
          protocol: 'ws',
          path: '/mqtt',
          clientId: 'sl_board_' + Math.random().toString(16).substr(2, 8)
        })

        client.on("connect", () => {
          client.subscribe(`${TOPIC_ID}/bullpen`)
          client.subscribe(`${TOPIC_ID}/race`)
          client.subscribe(`${TOPIC_ID}/sync/request`)
        })

        client.on("message", (topic: string, message: any) => {
          const valueStr = message.toString()
          
          if (topic === `${TOPIC_ID}/bullpen`) {
            setBullpen(parseInt(valueStr, 10) || 0)
          } else if (topic === `${TOPIC_ID}/race`) {
            setRaceNumber(parseInt(valueStr, 10) || 0)
          } else if (topic === `${TOPIC_ID}/sync/request`) {
            client.publish(`${TOPIC_ID}/sync/response`, JSON.stringify(stateRef.current))
          }
        })
      } catch (e) {
        console.error("Scoreboard connection issue:", e)
      }
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
