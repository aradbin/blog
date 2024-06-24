import React from 'react'
import { ResponsivePie } from '@nivo/pie'

export default function PortfolioChart({ data }: any) {
  return (
    <div className="chart" style={{ width: '100%', height: '300px', margin: '0 auto' }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 20, left: 80 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        sortByValue={true}
        theme={{
          tooltip: {
            container: {
              background: '#292929',
              color: '#fff',
              fontSize: 10,
            },
          },
        }}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsTextColor={{ from: 'color' }}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabel={(d) => `${d.value} %`}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
      />
    </div>
  )
}
