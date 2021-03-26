import React, { useEffect, useState } from "react";
import "./App.css";
import "react-bootstrap";
import Table from "react-bootstrap/Table";

// Sort Data
const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = async (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    await setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
// Table
const ProductTable = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.products);

  const [sortingArrow, setSortingArrow] = useState(null);
  const arrows = async () => {
    if (sortConfig === null) {
      await setSortingArrow(null);
    } else if (sortConfig.direction === "ascending") {
      await setSortingArrow("⇩");
    } else if (sortConfig.direction === "descending") {
      await setSortingArrow("⇧");
    }
  };

  useEffect(() => {
    arrows();
  });

  return (
    <Table responsive striped bordered hover variant="dark">
      <thead className="row">
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort("symbol")}
              className={sortingArrow}
            >
              <h6 className="col-2 text-nowrap pl-4">
                TICKER <span className="arrows">{sortingArrow}</span>
              </h6>
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("bid")}
              className={sortingArrow}
            >
              <h6 className="col-2 text-nowrap pl-4">
                BID <span className="arrows">{sortingArrow}</span>
              </h6>
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("ask")}
              className={sortingArrow}
            >
              <h6 className="col-2 text-nowrap pl-4">
                ASK <span className="arrows">{sortingArrow}</span>
              </h6>
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("high")}
              className={sortingArrow}
            >
              <h6 className="col-2 text-nowrap pl-4">
                HIGH <span className="arrows">{sortingArrow}</span>
              </h6>
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("low")}
              className={sortingArrow}
            >
              <h6 className="col-2 text-nowrap pl-4">
                LOW <span className="arrows">{sortingArrow}</span>
              </h6>
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("last")}
              className={sortingArrow}
            >
              <h6 className="col-2 text-nowrap pl-4">
                LAST <span className="arrows">{sortingArrow}</span>
              </h6>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.symbol}>
            <td>{item.symbol}</td>
            <td>{item.bid}</td>
            <td>{item.ask}</td>
            <td>${item.high}</td>
            <td>{item.low}</td>
            <td>{item.last}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Fetch Data
export default function App() {
  useEffect(() => {
    fetchItems();
  });

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const list = await fetch("api/2/public/ticker");
    const data = await list.json();

    // Classify Last Items
    const resultList = items.map((i) => i.last);
    const sorting = resultList.sort();
    const greater = sorting.reverse();
    const firstFive = greater.slice(0, 50);
    await firstFive.forEach(iterate);
    async function iterate(item) {
      await items.find((i) => (i.last === item ? array.push(i) : null));
      await array.concat(newArray);
      await setShowLast(array);
    }
    setItems(data);
  };

  let array = [];
  let newArray = [];

  // Show Last Items
  const [showLast, setShowLast] = useState([]);
  const [isToggled, setToggled] = useState(false);
  const toggleTrueFalse = async () => await setToggled(!isToggled);

  const fullList = <ProductTable products={items} />;
  const lastList = <ProductTable products={showLast} />;

  return (
    <div className="App">
      <button onClick={toggleTrueFalse}>
        {!isToggled ? <h6>SHOW LAST 50</h6> : <h6>SHOW ALL</h6> }
      </button>
      {!isToggled ? fullList : lastList}
    </div>
  );
}
