import React, { useState, useEffect } from "react";
import api from "../api";

function profileStats() {
  const [items, setItems] = useState([
    "Average progress per application",
    "Acception / Rejection rates"
  ]);
  
  const getPlacements = () => {
    api
      .get("/api/placements/")
      .then((res) => res.data)
      .then((data) => {
        const count = data.length; 
        setItems((prevItems) => [...prevItems, `Total placements: ${count}`]); 
        console.log([...items, `Total placements: ${count}`]); 
      })
      .catch((err) => alert(err));
  };
  
  getPlacements();

  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>Profile Example</h1>
      {items.length === 0 && <p>No stats found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li className={ selectedIndex === index ? 'list-group-item active' : 'list-group-item'} 
          key={item} 
          onClick={() => {setSelectedIndex(index);}}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default profileStats;
