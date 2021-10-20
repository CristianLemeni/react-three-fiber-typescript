import { useState, useEffect } from "react"
import { addEffect, addAfterEffect } from "react-three-fiber"
//@ts-ignore
import StatsImpl from "stats.js"
//function that attaches the fps counter to the document body
export function Stats({ showPanel = 0 } : {showPanel: number}) {
  const [stats] = useState(() => new StatsImpl())
  useEffect(() => {
    const node = document.body

    stats.showPanel(showPanel)
    node.appendChild(stats.dom)

    const begin = addEffect(() => stats.begin())
    const end = addAfterEffect(() => stats.end())

    return () => {
      node.removeChild(stats.dom)
      begin()
      end()
    }
  }, [showPanel, stats])
  return null
}
