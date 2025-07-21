const node_env: string = "development";

const isProduction = node_env === "production";

const baseUrl: string = isProduction
  ? "https://sociofy.site/api/v1" // Backend on EC2 port 8080
  : "http://localhost:8080/api/v1";

export const imageBaseUrl: string = isProduction
  ? "https://sociofy.site"
  : "http://localhost:8080";

export default baseUrl;
