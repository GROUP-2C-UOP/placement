import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../api';

function Statistics() {
  const [data, setData] = useState([]);
  const COLORS = {
    'Offer Made': '#00FF00',
    'In Progress': '#FFA500',
    'Withdrawn': '#483D8B',
    'Rejected': '#FF0000',
    'Phone Interview': '#dd89f5',
    'In Person Interview': '#5bc0c9',
    'Assessment': '#c4d45d'
  };
  const RADIAN = Math.PI / 180;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: placements } = await api.get('/api/placements/');
      const statusCounts = placements.reduce((acc, { status }) => {
        let formattedStatus = status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        formattedStatus = formattedStatus === "Face To Face Interview" ? "In Person Interview" : formattedStatus;
        formattedStatus = formattedStatus === "Applied" ? "In Progress" : formattedStatus;
        acc[formattedStatus] = (acc[formattedStatus] || 0) + 1;
        return acc;
      }, {});

      const orderedStatuses = Object.keys(COLORS).map(status => ({
        name: status,
        value: statusCounts[status] || 0
      })).filter(status => status.value > 0);

      setData({ barChartData: orderedStatuses, pieChartData: orderedStatuses });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>;
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '20px', boxSizing: 'border-box', overflow: 'hidden' }}>
      <h1 style={{ textAlign: 'left', color: 'white', fontSize: '64px', marginBottom: '10px' }}>Statistics</h1>
      <h2 style={{ textAlign: 'left', color: 'white', marginTop: '0px' }}>Success rate of applications:</h2>
      <hr style={{ width: '100%', margin: '0 auto', border: '1px solid white', marginBottom: '20px' }} />
      <div style={{ backgroundColor: '#000080', padding: '20px', borderRadius: '10px', margin: '20px 20px 0 20px' }}>
        {data.length === 0 ? (
          <p style={{ color: 'white', textAlign: 'center' }}>To see your statistics, add a placement first!</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
            {[data.barChartData, data.pieChartData].map((chartData, index) => (
              <div key={index} style={{ flex: 1, height: '400px', padding: '20px', backgroundColor: '#395088', borderRadius: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {index === 0 ? (
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                      <XAxis dataKey="name" stroke="#ffffff" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" interval={0} />
                      <YAxis stroke="#ffffff" domain={[0, 20]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {chartData.map(({ name }, i) => <Cell key={i} fill={COLORS[name] || '#8884d8'} />)}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="value">
                        {chartData.map(({ name }, i) => <Cell key={i} fill={COLORS[name] || '#8884d8'} />)}
                        <LabelList dataKey="name" position="outside" fill="white" />
                      </Pie>
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
