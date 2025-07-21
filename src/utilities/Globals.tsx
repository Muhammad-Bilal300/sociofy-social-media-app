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

export function getUserName(): string | undefined {
  const authToken = localStorage.getItem("token");
  if (authToken !== null) {
    const decodedToken = jwtDecode<DecodedToken>(authToken);
    return decodedToken.firstName + " " + decodedToken.lastName;
  }
}

export function getUserEmail(): string | undefined {
  const authToken = localStorage.getItem("token");
  if (authToken !== null) {
    const decodedToken = jwtDecode<DecodedToken>(authToken);
    return decodedToken.emailAddress;
  }
}

export function getUserId(): string | undefined {
  const authToken = localStorage.getItem("token");
  if (authToken !== null) {
    const decodedToken = jwtDecode<DecodedToken>(authToken);
    return decodedToken.userId;
  }
}

export function removeAuthToken(): void {
  localStorage.removeItem("token");
}

export function getTimeAgo(updatedAt: string): string {
  const updatedDate = new Date(updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - updatedDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
  if (minutes === 1) return `1 min ago`;
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours === 1) return `1 hour ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return `1 day ago`;
  if (days < 30) return `${days} days ago`;
  if (months === 1) return `1 month ago`;
  if (months < 12) return `${months} months ago`;
  if (years === 1) return `1 year ago`;
  return `${years} years ago`;
}
