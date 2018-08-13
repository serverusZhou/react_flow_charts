import React from 'react'
import ReactDOM from 'react-dom'
import Chart from './chart'

import assemblies from './material/assemblies'
import { typeSummary } from './dict'

ReactDOM.render(
  <div
    style={{ width: '1200px', height: '800px', margin: '0 auto', paddingTop: '20px' }}
  >
    <Chart
      typeSummary = {typeSummary}
      assemblies={assemblies}
    />
  </div>,
  document.getElementById('app')
)
