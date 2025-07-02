import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  [key: string]: any; // allows for additional unknown properties
}

export function formatUnderscoredString(inputString: string): string {
  if (inputString?.includes("_")) {
    return inputString
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  } else {
    return (
      inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
    );
  }
}

export function getUserToken(): string | null {
  const authToken = localStorage.getItem("token");
  return authToken;
}

export function getUserRole(): string | undefined {
  const authToken = localStorage.getItem("token");
  if (authToken !== null) {
    const decodedToken = jwtDecode<DecodedToken>(authToken);
    return decodedToken.role;
  }
}
