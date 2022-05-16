const pool = require("../db.config");
const userServices = require("../services/users.services");
const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const result = await userServices.login(username, password);
    if (result?.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.cookie("token", result.token, {
        maxage: 86400,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(result.status).json({ message: result.message });
    }
  } catch (err) {
    res.status(500).send("Unexpected error");
  }
};
const register = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const result = await userServices.register(username, password, email);
    if (result?.error) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json({ message: result.message });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Unexpected error");
  }
};
const logout = (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out !" });
};
const getUser = (req, res) => {
  try {
    return res.json({
      user: {
        id: req.userId,
        username: req.username,
        role: req.role,
      },
    });
  } catch (err) {
    res.status(500).send("Unexpected error");
  }
};
const getUserInfo = async (req, res) => {
  const userId = req.userId;
  try {
    const userQuery = await pool.query(
      "SELECT id, username, email, address, telephone, role, date_joined, subscription, first_name, last_name, city, state, zipcode, country FROM USERS WHERE id=$1",
      [userId]
    );
    return res.status(200).json(userQuery.rows[0]);
  } catch (err) {
    res.status(500).send("Unexpected error");
  }
};
const updateUserInfo = async (req, res) => {
  try {
    const user = req.body.user;
    const userId = req.userId;
    const updateInfo = await pool.query(
      "UPDATE users SET first_name=$1, last_name=$2,telephone=$3,address=$4,city=$5,country=$6,zipcode=$7,state=$8 WHERE id=$9",
      [
        user.firstName,
        user.lastName,
        user.telephone,
        user.address,
        user.city,
        user.country,
        user.zipcode,
        user.state,
        userId,
      ]
    );
    res.status(200).json({ message: "User info updated" });
  } catch (err) {
    res.status(500).send("Unexpected error");
    console.log(err);
  }
};
const getUsers = async (req, res) => {
  if (req.role === 0) {
    return res.status(200).send("Not admin");
  }
  try {
    const userQuery = await pool.query(
      "SELECT id, username, email, address, telephone, role, date_joined, subscription, first_name, last_name, city, state, zipcode, country FROM USERS"
    );
    return res.status(200).json(userQuery.rows);
  } catch (err) {
    res.status(500).send("Unexpected error");
  }
};
const updateSubscription = async (req, res) => {
  if (req.role === 0) {
    return res.status(200).send("Not admin");
  }
  const id = req.body.id;
  const days = req.body.days;
  try {
    await userServices.manageSubscription(id, days);
    return res.status(200).json("Subscription updated");
  } catch (err) {
    res.status(500).send("Unexpected error");
  }
};
const updateRole = async (req, res) => {
  if (req.role === 0) {
    return res.status(200).send("Not admin");
  }
  const id = req.body.id;
  const role = req.body.role;
  try {
    await pool.query("UPDATE users SET role=$1 WHERE id=$2", [role, id]);
    return res.status(200).json("Role updated");
  } catch (err) {
    res.status(500).send("Unexpected error");
  }
};
const generateQrCode = async (req, res) => {
  const token = userServices.genereateQrCode(req.userId);
  return res.status(200).send(token);
};
const checkQrCode = async (req, res) => {
  const userId = userServices.checkQrCode(req.body.token);
  if (!userId) {
    return res.status(200).send("No user found");
  }
  const { rows } = await pool.query(
    "SELECT subscription FROM USERS WHERE id=$1",
    [userId]
  );
  const subscription = new Date(rows[0].subscription);
  const today = new Date();
  if (subscription > today) {
    res.status(200).json({
      message: `Subscription valid until ${subscription.toString()}`,
      valid: true,
    });
  } else {
    res.status(200).json({
      message: `Subscription not valid, expired at ${subscription.toString()}`,
      valid: false,
    });
  }
};

module.exports = {
  login,
  register,
  logout,
  getUser,
  getUserInfo,
  updateUserInfo,
  getUsers,
  updateSubscription,
  updateRole,
  generateQrCode,
  checkQrCode,
};
