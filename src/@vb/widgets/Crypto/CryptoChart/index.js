import React, { useState, useEffect } from 'react'
import { Client, Message } from '@stomp/stompjs';
import TradeChart from './TradeChart'
import getData from './TradeChart/utils'

const CryptoChart = () => {
  const [graphData, setGraphData] = useState(null)
  const client = new Client({
    brokerURL: 'ws://localhost:8080/web-socket',
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  const [chartData,setChartData]= useState([]);
  client.onConnect =  (frame)=> {
     console.log('Connected to localhost ');
     const subscription = client.subscribe('/topic/WBTCUSDT', callback);

  };

  const callback=(message)=>{

    console.log(JSON.parse(message.body));

    chartData.push(JSON.parse(message.body))

    if(chartData.length>5)
    setGraphData(JSON.parse(message.body));

  }



  client.activate();
  useEffect(() => {


    getData().then((data) => {
      setGraphData(data)
    })
  }, [])

  return (
    <div style={{ height: 400 }}>
      {graphData !== null && <TradeChart type="hybrid" data={graphData} />}
    </div>
  )
}

export default CryptoChart
