import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
// Import your actual controller/counter components here
// (Adjust the path below depending on where you saved them)
import { Counter, CounterKeys, FormatCount, LeftRightTap } from '../data/counts'

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Swimboard Sea Lions Controller</h1>
      {/* Render your application interface here */}
      <Controller />
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
