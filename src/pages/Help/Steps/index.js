import React, { useState } from 'react'
import SortableTree from 'react-sortable-tree'
import { Checkbox } from 'antd'

const Steps = () => {
  const completedDefault = [
    { name: 'Add a Live Wallet in wallet screen with Private Key and Address', checked: true },
    { name: 'Buy a Live Trading subscription from Ambergrid.pro/Discord', checked: true },
    { name: 'Raise a License Request on the app/bot for enabling the license', checked: true },
    { name: 'Have enough gas in your wallet for trading purposes', checked: true },
    {
      name: 'Convert/Buy USDC or USDT corresponding to your Grid Pair before setting up the Grid',
      checked: true,
    },
    { name: 'Control your trades and book profits when neccessary', checked: true },
  ]
  const [completed, setCompleted] = useState(completedDefault)

  return (
    <div>
      <SortableTree
        isVirtualized={false}
        reactVirtualizedListProps={{ height: 20000 }}
        treeData={completed}
        onChange={(tree) => setCompleted(tree)}
        generateNodeProps={({ node }) => ({
          title: !node.children ? (
            <span style={{ fontSize: '18px', margin: '20px' }} role="img" aria-label="">
              🩸 <span style={{ marginLeft: '10px' }}>{node.name}</span>
            </span>
          ) : (
            <span style={{ fontSize: '18px', margin: '20px' }}>{node.name}:</span>
          ),
        })}
      />
    </div>
  )
}

export default Steps
