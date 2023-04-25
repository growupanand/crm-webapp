import rateLimit from "express-rate-limit";
const rateLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 2, // limit each IP to 2 requests per windowMs
});
export default rateLimiter;
