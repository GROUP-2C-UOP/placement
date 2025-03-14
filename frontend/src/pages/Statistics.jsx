import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList } from 'recharts';

function Statistics() {
  const data = [
    { name: 'Placement Offered', value: 400 },
    { name: 'First Interview Stage Passed', value: 300 },
    { name: 'No Response', value: 300 },
    { name: 'Rejected', value: 200 },
  ];

  const COLORS = ['#00FF00', '#FFA500', '#483D8B', '#FF0000'];

  const RADIAN = Math.PI / 180;
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList dataKey="name" position="outside" fill="white" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
