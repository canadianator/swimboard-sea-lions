import * as React from "react"
import { type HeadFC, type PageProps } from "gatsby"
import styled from 'styled-components'
import { Counter, CounterKeys, FormatCount, LeftRightTap } from '../data/counts'

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

const lastCalls = new Map<Function, number>();
const debounceBy10Ms = <T extends Function>(fn: T) => (...args: any[]) => {
  if (lastCalls.has(fn)) {
    if (Date.now() - lastCalls.get(fn)! <= 10) {
      return;
    }
  }
  lastCalls.set(fn, Date.now());
  fn(...args);
}

const IndexPage: React.FC<PageProps> = () => {
  const [controllerCounter, setControllerCounter] = React.useState<Counter | null>(null);
  const [remainingTime, setRemainingTime] = React.useState<number | null>(null);
  const [counts, setCounts] = React.useState({ bullpen: 0, raceNumber: 0 })

 React.useEffect(() => {
    // Only run this code if we are inside a browser environment
    if (typeof window === "undefined") return;

    if (controllerCounter) {
      setCounts(controllerCounter.getAllCounts());
      /* listening for updates to render */
      const counterListener = () => {
        setCounts(controllerCounter.getAllCounts());
      }
      controllerCounter.listenForCountChanges(counterListener);

      /* listening for arrow keystrokes */
      const keyListener = debounceBy10Ms((event: KeyboardEvent) => {
        if (event.key === 'PageUp' || event.key === 'ArrowRight') {
          controllerCounter.registerTap(LeftRightTap.Right)
        }
        if (event.key === 'PageDown' || event.key === 'ArrowLeft') {
          controllerCounter.registerTap(LeftRightTap.Left)
        }
      })
      window.addEventListener('keydown', keyListener);

      /* watching count-down */
      const interval = setInterval(() => {
        setRemainingTime(controllerCounter.getTimeRemainingOnCounterMs());
      }, 400);

      return () => {
        controllerCounter.removeListener(counterListener);
        controllerCounter.dispose();
        window.removeEventListener('keydown', keyListener);
        clearInterval(interval);
      }
    } else {
      const newControllerCounter = new Counter();
      setControllerCounter(newControllerCounter);
      return () => {
        newControllerCounter.dispose();
      };
    }
  }, [controllerCounter]);

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

export default IndexPage
export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
