import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const loadProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  const total = cart.reduce(
    (acc, item) => acc + (item.sellingPrice || 0) * item.quantity,
    0,
  );
  const finalTotal = total + (total * tax) / 100 - discount;

  const checkout = async () => {
    try {
      await api.post("/invoices", {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          qty: item.quantity,
          price: item.sellingPrice,
          total: item.sellingPrice * item.quantity,
        })),
        tax,
        discount,
        paymentMethod: "cash",
      });
      alert("Invoice Created!");
      setCart([]);
      setDiscount(0);
      setTax(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" mb={2}>
        Sales
      </Typography>
      <Typography variant="h6">Products</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Add</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.sellingPrice}</TableCell>
              <TableCell>
                <Button onClick={() => addToCart(p)}>Add</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h6" mt={3}>
        Cart
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cart.map((c, i) => (
            <TableRow key={i}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.sellingPrice}</TableCell>
              <TableCell>{c.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Tax %"
          type="number"
          value={tax}
          onChange={(e) => setTax(Number(e.target.value))}
        />
        <TextField
          label="Discount"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />
      </Box>

      <Typography variant="h6" mt={2}>
        Total: {finalTotal.toFixed(2)}
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={checkout}>
        Checkout
      </Button>
    </Box>
  );
};

export default Sales;
