import jwt, { SignOptions } from "jsonwebtoken";

// Define the type of the payload
interface Payload {
  [key: string]: any; // You can customize this based on the structure of your payload
}

const generateAuthenticationToken = async (
  payload: Payload
): Promise<string> => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "JWT secret key is not defined in the environment variables."
    );
  }

  const options: SignOptions = { expiresIn: "7d" };

  const token = jwt.sign(payload, secretKey, options);

  return token;
};

export { generateAuthenticationToken };
