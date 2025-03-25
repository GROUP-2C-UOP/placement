import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList } from 'recharts';
import api from '../api';

function Statistics() {
  const [data, setData] = useState([]);
  const COLORS = {
    'offer_made': '#00FF00',
    'in progress': '#FFA500',
    'withdrawn': '#483D8B',
    'rejected': '#FF0000',
    'phone interview': '#dd89f5',
    'in person interview': '#5bc0c9',
    'assessment': '#c4d45d'
  };
  const RADIAN = Math.PI / 180;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/placements/');
      const placements = response.data;
      const statusCounts = placements.reduce((acc, placement) => {
        acc[placement.status] = (acc[placement.status] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status],
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'left', color: 'white', marginTop: '60px' }}>Success rate of applications</h2>
        <hr style={{ width: '100%', margin: '0 auto', border: '1px solid white' }} />
      </div>
      
      <div style={{ backgroundColor: '#000080', padding: '20px', borderRadius: '10px', margin: '0 20px', minHeight: '70vh' }}>
        {data.length === 0 ? (
          <p style={{ color: 'white', textAlign: 'center' }}>To see your statistics, add a placement first!</p>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <button style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#395088', border: 'none', borderRadius: '5px', color: 'white' }}>BY SUCCESS</button>
              <button style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#395088', border: 'none', borderRadius: '5px', color: 'white' }}>BY INDUSTRY</button>
              <button style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#395088', border: 'none', borderRadius: '5px', color: 'white' }}>BY LOCATION</button>
              <button style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#395088', border: 'none', borderRadius: '5px', color: 'white' }}>BY DATE</button>
            </div>
            <div style={{ flex: 1, height: '400px', padding: '20px', backgroundColor: '#395088', margin: '0 20px', borderRadius: '10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                    ))}
                    <LabelList dataKey="name" position="outside" fill="white" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
