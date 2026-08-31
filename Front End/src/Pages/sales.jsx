import { useState, useEffect } from "react";
import api from "../api/axios";
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell,
         TableBody, TextField } from "@mui/material"
const Sales = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [tax, setTax] = useState([]);
    const [discount, setDiscount] = useState([]);

    const loadProducts = async () => {
        const {data} = await api.get("./products");
        setProducts(data )
    }

    const addToCart = (product) => {
        setCart(prev => [...prev, {...product, quantity: 1}]);
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const finalTotal = total + (total * tax / 100) - discount;


const checkout = async() => {
    try{
        await api.post("/invoices", {item: cart, tax, discount})
            alert("Invoice Created!")
            setCart([])
            setDiscount(0)

        } catch (err) {console.log(err)}
};

useEffect(() => loadProducts)

return (
  <Box sx={{padding: 3}}>
    <Typography variant = "h4" mb={2}> Sales</Typography>
    <Typography variant = "h6">Products</Typography>

    <Table>
        <TableHead>
        <TableRow>     
            <TableCell>name</TableCell>

            <TableCell>Price</TableCell>

            <TableCell>Add</TableCell>                
        </TableRow>
        </TableHead>

        <TableBody>
        {products.map(p => {
            <TableRow key = {p._id}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.price}</TableCell>
            <TableCell><Button onClicke = {() => addToCart(p)}>add</Button></TableCell>

            </TableRow>
        })}
        </TableBody>
    </Table>

    <Typography variant = "h6" mt = {3}>
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
        
        {cart.map((c , i) => {
            <TableRow key = {i}>
            <TableCell>{c.name}</TableCell>
            <TableCell>{c.price}</TableCell>
            <TableCell>{c.quantity}</TableCell>
            </TableRow>
        })}

        </TableBody>
    </Table>

    <Box sx = {{mt: 2, display: "flex", gap: 2}}>
        <TextField label = "Tax %" type = "number"
         value = {tax} onChange = {e => setTax(Number(e.target.value))} />
        <TextField label = "Discount %" type = "number"
         value = {discount} onChange = {e => setDiscount(Number(e.target.value))} />
    </Box>

    <Typography variant ="h6" mt = {2}>Total: {finalTotal}</Typography>
    <Button variant = "contained" sx = {{mt: 2}} onClicke = {checkout}>Checkout</Button>
</Box>
)
}

export default Sales