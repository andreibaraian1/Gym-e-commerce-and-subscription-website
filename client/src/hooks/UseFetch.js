import Axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setProducts } from "../actions";
const UseFetch = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    Axios.get("http://localhost:3001/users/getUser", {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.user) dispatch(setUser(res.data.user));
        else dispatch(setUser(null));
      })
      .catch((err) => {
        console.log(err);
      });

    Axios.get("http://localhost:3001/products/getProducts")
      .then((response) => {
        dispatch(setProducts(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
export default UseFetch;