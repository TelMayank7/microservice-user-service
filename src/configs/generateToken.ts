import jwt from "jsonwebtoken";

const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  }); 
};
export default generateToken;