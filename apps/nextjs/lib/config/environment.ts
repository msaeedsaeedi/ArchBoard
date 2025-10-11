interface Environment {
  production: boolean;
  apiUrl: string;
}

export const environment: Environment = {
  production: process.env.NODE_ENV === "production",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
};
