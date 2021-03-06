import { Link } from "react-router-dom";
import styles from "./Product.module.css";
import { Card, Button } from "react-bootstrap";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { setModal, setModalMessage } from "../../actions";

const Product = (props) => {
  const product = props.product;

  const dispatch = useDispatch();
  const addToCart = async () => {
    const { id } = product;
    const insertProduct = {
      id: id,
      quantity: 1,
    };

    const insertCart = await Axios.post(
      `${process.env.REACT_APP_HOSTNAME}/cart/insertCart`,
      { product: insertProduct },
      { withCredentials: true }
    );
    if (insertCart.data?.error) {
      dispatch(setModal());
      dispatch(setModalMessage(insertCart.data.error));
    }
  };
  return (
    <Card key={product.id} className={styles.product}>
      <Link to={`/products/${product.id}`}>
        <Card.Img
          src={`/images/${product.image}`}
          alt={product.name}
          styles={{ width: "150px" }}
        />
      </Link>
      <Card.Body>
        <Card.Text>{product.name}</Card.Text>
        <Card.Text>{product.price} lei</Card.Text>
      </Card.Body>
      {product.stock ? (
        <Button variant="info" onClick={addToCart}>
          Add to cart
        </Button>
      ) : (
        <Button variant="danger" disabled>Sold out</Button>
      )}
    </Card>
  );
};
export default Product;
