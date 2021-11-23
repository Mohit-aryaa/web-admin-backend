const jwt = require('jsonwebtoken')

module.exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, 'thisissecret', (err, user) => {
      if (err) {
        return res.status(403).json({ code: 403, message: 'Authentication failed', errors: ['Invalid or expire token'] })
      }
      req.user = user
      next()
    })
  } else {
    res.status(401).json({ code: 401, message: 'Authentication failed', errors: ['Token missing'] })
  }
}
