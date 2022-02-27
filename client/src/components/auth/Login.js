import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../actions";
const Login = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [usernameLog, setUsernameLog] = useState("");
  const [passwordLog, setPasswordLog] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const gotoLogout = () => {
    navigate("/logout");
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      login();
    }
  };
  const login = async (event) => {
    event?.preventDefault();
    if (usernameLog.trim().length === 0 || passwordLog.trim().length === 0) {
      return;
    }
    const login = await Axios.post(
      "http://localhost:3001/login",
      {
        username: usernameLog,
        password: passwordLog,
      },
      { withCredentials: true }
    );

    if (login.status === 200) {
      setMessage(login.data.message);
    }

    setUsernameLog("");
    setPasswordLog("");
    Axios.get("http://localhost:3001/me", {
      withCredentials: true,
    }).then((res) => {
      dispatch(setUser(res.data.user));
    });
  };

  // const logout = async () => {
  //   const logout = await Axios.get("http://localhost:3001/logout", {
  //     withCredentials: true,
  //   });
  //   if (logout.status === 200) {
  //     props.setUser();
  //     setMessage(logout.data.message);
  //   }
  // };
  return (
    <div>
      {!user && (
        <form onSubmit={login}>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsernameLog(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            value={usernameLog}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPasswordLog(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            value={passwordLog}
          />
          <input type="submit" value="Login"></input>
        </form>
      )}
      <div className="testUser">
        {user && (
          <div>
            <h1>username:{user.username}</h1>
          </div>
        )}
      </div>
      <div>
        <button onClick={gotoLogout}>Logout</button>
        <h1>{message}</h1>
      </div>
    </div>
  );
};
export default Login;
