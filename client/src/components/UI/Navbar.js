import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { Navbar as Navi, Container, Nav } from "react-bootstrap";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Navi sticky="top" bg="dark" variant="dark" className={styles.navbar}>
        <Container>
          <Navi.Brand>
            <Link className={styles.navbarLink} to="/">
              Power Gym
            </Link>
          </Navi.Brand>
          <Navi.Toggle aria-controls="responsive-navbar-nav" />

          <Nav className="me-auto">
            <Link className={styles.navbarLink} to="/shop">
              Shop
            </Link>
          </Nav>

          {!user && (
            <Nav className={styles.navRight}>
              <Link className={styles.navbarLink} to="/login">
                Login
              </Link>

              <Link className={styles.navbarLink} to="/register">
                Register
              </Link>
            </Nav>
          )}
          {user && (
            <Nav className={styles.navRight}>
              {user.role === 1 && (
                <Link className={styles.navbarLink} to="/admin">
                  Admin Panel
                </Link>
              )}
              <Link className={styles.navbarLink} to="/cart">
                Cart
              </Link>

              <Link className={styles.navbarLink} to="/orders">
                Orders
              </Link>
              <Link className={styles.navbarLink} to="/profile">
                Profile
              </Link>
              <Link className={styles.navbarLink} to="/logout">
                Logout
              </Link>
            </Nav>
          )}
        </Container>
      </Navi>
    </>
  );
};

export default Navbar;
