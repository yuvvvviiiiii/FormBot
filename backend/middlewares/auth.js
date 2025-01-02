const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const isLoggedin = (req, res, next) => {

  const token = req.headers.authorization;

  if(token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if(err) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        req.user = {email: decoded.email, id: decoded.id};
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized/ No token Provided' });
  }
}

module.exports = { isLoggedin };