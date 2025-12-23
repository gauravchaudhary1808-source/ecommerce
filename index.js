const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- MOCK DATABASE ----------
const products = [
  { id: 1, name: "Laptop", price: 50000, color: "#ff6b6b" },
  { id: 2, name: "Mobile", price: 20000, color: "#4dabf7" },
  { id: 3, name: "Headphones", price: 2000, color: "#51cf66" },
  { id: 4, name: "Smart Watch", price: 8000, color: "#f59f00" }
];

let cart = [];

// ---------- APIs ----------
app.get("/api/products", (req, res) => res.json(products));
app.get("/api/cart", (req, res) => res.json(cart));

app.post("/api/cart", (req, res) => {
  const product = products.find(p => p.id === req.body.id);
  if (product) cart.push(product);
  res.json(cart);
});

app.delete("/api/cart/:id", (req, res) => {
  cart = cart.filter(item => item.id != req.params.id);
  res.json(cart);
});

// ---------- FRONTEND ----------
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>MERN E-Commerce</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  min-height: 100vh;
}

.header {
  text-align: center;
  color: white;
  padding: 20px;
  font-size: 28px;
  font-weight: bold;
}

.container {
  max-width: 1000px;
  margin: auto;
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  border-radius: 14px;
  padding: 18px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.card h3 {
  margin: 0;
}

.card p {
  font-size: 18px;
  font-weight: bold;
}

.add-btn {
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: white;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.add-btn:hover {
  background: #000;
  color: #fff;
  transform: scale(1.05);
}

.cart {
  margin-top: 35px;
}

.cart h2 {
  text-align: center;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #f1f3f5, #e9ecef);
  padding: 12px;
  margin-top: 10px;
  border-radius: 10px;
}

.remove {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
}

.remove:hover {
  background: #c92a2a;
}
.badge {
  background: #20c997;
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 14px;
}
</style>
</head>

<body>
  <div class="header">🛒 Colorful MERN E-Commerce Store</div>
  <div id="root"></div>

<script>
const { useState, useEffect } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then(res => setProducts(res.data));
    loadCart();
  }, []);

  const loadCart = () => {
    axios.get("/api/cart").then(res => setCart(res.data));
  };

  const addToCart = id => {
    axios.post("/api/cart", { id }).then(loadCart);
  };

  const removeFromCart = id => {
    axios.delete("/api/cart/" + id).then(loadCart);
  };

  return (
    React.createElement("div", { className: "container" },

      React.createElement("h2", null, "Products"),
      React.createElement("div", { className: "grid" },
        products.map(p =>
          React.createElement("div", {
            key: p.id,
            className: "card",
            style: { background: p.color }
          },
            React.createElement("h3", null, p.name),
            React.createElement("p", null, "₹" + p.price),
            React.createElement("button", {
              className: "add-btn",
              onClick: () => addToCart(p.id)
            }, "Add to Cart")
          )
        )
      ),

      React.createElement("div", { className: "cart" },
        React.createElement("h2", null, "Cart ", 
          React.createElement("span", { className: "badge" }, cart.length)
        ),

        cart.map(c =>
          React.createElement("div", { className: "cart-item", key: c.id },
            React.createElement("span", null, c.name + " - ₹" + c.price),
            React.createElement("button", {
              className: "remove",
              onClick: () => removeFromCart(c.id)
            }, "Remove")
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root"))
  .render(React.createElement(App));
</script>
</body>
</html>
  `);
});

// ---------- SERVER ----------
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
