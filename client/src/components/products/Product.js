import { Link } from "react-router-dom";
import styles from "./Product.module.css";
import { Card, Button } from "react-bootstrap";
const Product = (props) => {
  const addtocart = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const { id } = props.product;
    const product = {
      id: id,
      quantity: 1,
    };
    if (cart) {
      let ok = 0;
      for (let i = 0; i < cart.length && ok === 0; i++) {
        if (cart[i].id === product.id) {
          cart[i].quantity = parseInt(cart[i].quantity) + 1;
          ok = 1;
        }
      }
      if (ok === 0) cart.push(product);
    } else {
      cart = [product];
    }
    console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  return (
    <Card key={props.product.id} className={styles.product}>
      <Link to={`/products/${props.product.id}`}>
        <Card.Img
          src={`images/${props.product.image}`}
          alt={props.product.name}
        />
        <Card.Body>
          <Card.Text>{props.product.name}</Card.Text>
        </Card.Body>
      </Link>
      <Card.Text>{props.product.price} lei</Card.Text>
      <Button onClick={addtocart}>Add to cart</Button>
    </Card>
  );
};
export default Product;