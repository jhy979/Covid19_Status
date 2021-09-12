import {React, useState, useEffect} from 'react'
import axios from 'axios'
import {Bar,Doughnut,Line} from 'react-chartjs-2'
const Contents = () => {
  
  const [confirmedData,setConfirmedData]=useState({})
  const [quarantinedData,setQuarantinedData]=useState({})
  const [comparedData,setComparedData]=useState({})

  useEffect(()=>{

    const makeData = (items)=>{
      const arr = items.reduce((acc,cur)=>{
        const currentData  = new Date(cur.Date)
        const year = currentData.getFullYear();
        const month = currentData.getMonth();
        const date = currentData.getDate();

        const confirmed = cur.Confirmed;
        const active = cur.Active;
        const death = cur.Deaths;
        const recovered = cur.Recovered;

        const findItem = acc.find(a=>a.year === year && a.month === month)

        if(!findItem){
          acc.push(
            {year:year,month:month,date:date,confirmed:confirmed,active:active,death:death,recovered:recovered}
          )
        }
        if(findItem && findItem.date < date){
          findItem.active = active;
          findItem.death = death;
          findItem.date = date;
          findItem.year = year;
          findItem.month = month;
          findItem.recovered = recovered;
          findItem.confirmed = confirmed;
        }
        return acc;
      },[])

      const labels = arr.map((el)=>`${el.year}-${el.month+1}`)
      setConfirmedData({
        labels: labels,
        datasets:[
          {
            label: "국내 확진자",
            backgroundColor : '#59677c',
            fill:true,
            data: arr.map(el=>el.confirmed)
          },
        ]
      });

      setQuarantinedData({
        labels: labels,
        datasets:[
          {
            label: "월별 격리자 현황",
            borderColor : '#59677c',
            fill:false,
            data: arr.map(el=>el.active)
          },
        ]
      });
      const last = arr[arr.length-1]
      setComparedData({
        labels: ["확진자", "격리 해제", "사망"],
        datasets:[
          {
            label: "누적 확진, 해제, 사망 비율",
            backgroundColor:['#344560','#7f8998','#a5abb5'],
            borderColor : ['#344560','#7f8998','#a5abb5'],
            fill:false,
            data: [last.confirmed,last.recovered,last.death]
          },
        ]
      });

    }

    const fetchEvent = async ()=>{
      const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr")
      makeData(res.data)
    }

    

    fetchEvent();
  },[])

  return (
    <section>
      <h2>국내 코로나 현황</h2>
      <div className="contents">
        <div>
          <Bar data = {confirmedData} options={
            { title : {display : true, text : "누적 확진자 추이", fontSize : 16}},
            { legend : {display : true, position : "bottom"}}
          }/>
        </div>

        <div>
          <Line data = {quarantinedData} options={
            { title : {display : true, text : "월별 격리자 현황", fontSize : 16}},
            { legend : {display : true, position : "bottom"}}
          }/>
        </div>

        <div>
          <Doughnut data = {comparedData} options={
            { title : {display : true, text : `누적 확진, 해제, 사망 (${new Date().getMonth()+1})`, fontSize : 16}},
            { legend : {display : true, position : "bottom"}}
          }/>
        </div>


      </div>
    </section>
  )
}

export default Contents
