import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import styled from 'styled-components'
import { Counter, CounterKeys, FormatCount } from '../data/counts'

const PageContainer = styled.div`
  width: calc(100% - 8px);
  height: calc(100vh - 8px);
  display: flex;
  padding: 4px;
  background-color: whitesmoke;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
`

const ControllerButton = styled.button`
  width: 100%;
  height: 40px;
  margin: 2px;
  cursor: pointer;
`

export default function IndexPage() {
  const [controllerCounter, setControllerCounter] = React.useState<Counter | null>(null);
  const [counts, setCounts] = React.useState({ bullpen: 0, raceNumber: 0 })

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const newControllerCounter = new Counter();
    setControllerCounter(newControllerCounter);
    setCounts(newControllerCounter.getAllCounts());

    const counterListener = () => {
      setCounts(newControllerCounter.getAllCounts());
    }
    newControllerCounter.listenForCountChanges(counterListener);

    return () => {
      newControllerCounter.removeListener(counterListener);
      newControllerCounter.dispose();
    }
  }, []);

  return (
    <PageContainer>
      <h1> Swimboard Sea Lions Controller </h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Current Counters</h2>
        <div style={{ width: '150px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><b>Bullpen:</b></div>
            <div>{FormatCount(counts.bullpen)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><b>Event:</b></div>
            <div>{FormatCount(counts.raceNumber)}</div>
          </div>
        </div>

        <h2>Update Counters</h2>
        <table width="100%">
          <thead>
            <tr>
              <th>Bullpen</th>
              <th>Race Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ControllerButton onClick={() => controllerCounter?.decrementCount(CounterKeys.Bullpen)}>Subtract</ControllerButton>
                <ControllerButton onClick={() => controllerCounter?.incrementCount(CounterKeys.Bullpen)}>Add</ControllerButton>
              </td>
              <td>
                <ControllerButton onClick={() => controllerCounter?.decrementCount(CounterKeys.RaceNumber)}>Subtract</ControllerButton>
                <ControllerButton onClick={() => controllerCounter?.incrementCount(CounterKeys.RaceNumber)}>Add</ControllerButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageContainer>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
