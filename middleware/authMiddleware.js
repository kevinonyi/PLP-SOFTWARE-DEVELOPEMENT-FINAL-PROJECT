// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    // Check if user is logged in by checking session
    if (req.session.user) {
      next(); // If the user is logged in, continue to the next middleware or route handler
    } else {
      res.status(401).json({ error: "Unauthorized access" }); // If not, send a 401 Unauthorized response
    }
  };
  