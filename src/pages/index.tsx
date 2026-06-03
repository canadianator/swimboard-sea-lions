import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import styled from 'styled-components'

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
  const [bullpen, setBullpen] = React.useState(0);
  const [raceNumber, setRaceNumber] = React.useState(0);

  const formatCount = (count: number) => {
    return String(count).padStart(3, '0');
  };

  return (
    <PageContainer>
      <h1> Swimboard Sea Lions Controller </h1>
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>Current Counters</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div><b>Bullpen:</b></div>
          <div>{formatCount(bullpen)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div><b>Event:</b></div>
          <div>{formatCount(raceNumber)}</div>
        </div>

        <h2>Update Counters</h2>
        <table width="100%">
          <thead>
            <tr>
              <th style={{ paddingBottom: '10px' }}>Bullpen</th>
              <th style={{ paddingBottom: '10px' }}>Race Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ControllerButton onClick={() => setBullpen(prev => Math.max(0, prev - 1))}>Subtract</ControllerButton>
                <ControllerButton onClick={() => setBullpen(prev => prev + 1)}>Add</ControllerButton>
              </td>
              <td>
                <ControllerButton onClick={() => setRaceNumber(prev => Math.max(0, prev - 1))}>Subtract</ControllerButton>
                <ControllerButton onClick={() => setRaceNumber(prev => prev + 1)}>Add</ControllerButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageContainer>
  )
}

export const Head: HeadFC = () => <title>Sea Lions Swim Controller</title>
