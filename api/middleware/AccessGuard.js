const jwt = require('jsonwebtoken');

exports.checkAuth = (roles) => {
  return (req, res, next) => {

    try {
      const token = req.headers.authorization.split(" ")[1];
      // console.log('got the token');
      jwt.verify(token, "feedingtrends009", (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
            error: err
          });
        }
        if (decoded) {
          if(roles.includes(decoded.user_type)){
            req.userData = decoded;
            next();
          }else if(decoded.user_type == 'admin'){
            req.userData = decoded;
            next();
          }else{
            return res.status(401).json({
              message: 'Access Denied',
            });
          }
        }
      });
    } catch (e) {
      return res.status(401).json({
        message: 'Auth failed',
        error: err
      });
    }
  }
}