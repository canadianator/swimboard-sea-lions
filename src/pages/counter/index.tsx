import './counter.css'
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import styled from 'styled-components'
import { Counter, FormatCount } from '../../data/counts'
import background from '../../images/sealionlogo.png';

const CounterDiv = styled('div')`
  height: 75vh;
  width: 42vw; /* Adjusted width so both cards fit side-by-side comfortably within 100vw */
  border-radius: 8vh; /* Slightly adjusted for better visual proportions */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0px 10px 30px rgba(0,0,0,0.15); /* Soft shadow for better depth */
`

const CounterNumber = styled('div')`
  color: white;
  font-size: 35vh; /* Brought down from 50vh to ensure 2-3 digit numbers don't overflow */
  width: 100%;
  text-align: center;
  font-weight: bold;
`

const CounterLabel = styled('div')`
  color: white;
  font-size: 4.5vw;
  width: 100%;
  text-align: center;
`

const IndexPage: React.FC<PageProps> = () => {
  const [controllerCounter, setControllerCounter] = React.useState<Counter | null>(null);
  const [counts, setCounts] = React.useState({
    bullpen: 0,
    raceNumber: 0
  })

  React.useEffect(() => {
    if (controllerCounter) {
      setCounts(controllerCounter.getAllCounts());
      const counterListener = () => {
        setCounts(controllerCounter.getAllCounts());
      }
      controllerCounter.listenForCountChanges(counterListener);
      return () => {
        controllerCounter.removeListener(counterListener);
        controllerCounter.dispose();
      }
    } else {
      const newControllerCounter = new Counter();
      setControllerCounter(newControllerCounter);
      return () => {
        newControllerCounter.dispose();
      }
    }
  }, [controllerCounter]);

  return (
    <>
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '40% auto', /* Places logo beautifully in the background center */
        backgroundColor: '#f4f6f9', /* Fallback light background */
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}>
        
        {/* Left Board: Bullpen */}
        <CounterDiv id="left-counter" className='counter'>
          <CounterNumber>{FormatCount(counts.bullpen)}</CounterNumber>
          <CounterLabel><b>Bullpen up to</b></CounterLabel>
        </CounterDiv>

        {/* Right Board: Event/Race Number */}
        <CounterDiv id="right-counter" className='counter'>
          <CounterNumber>{FormatCount(counts.raceNumber)}</CounterNumber>
          <CounterLabel><b>Event</b></CounterLabel>
        </CounterDiv>

      </div>
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Sea Lions Swim</title>
