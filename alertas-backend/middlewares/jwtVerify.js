const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token) {
    jwt.verify(token, process.env.JWT_SESSION_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = verifyJWT;