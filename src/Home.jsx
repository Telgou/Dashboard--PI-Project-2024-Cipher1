import React from 'react'
import EventList from './components/EventList';
import GroupList from './components/GroupList';
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';

function Home() {

    
     

  return (
    <main className='main-container'>
       

       <div>
      <h1>Mon Application React</h1>
      <EventList />
      <GroupList />
    </div>

       
    </main>
  )
}

export default Home