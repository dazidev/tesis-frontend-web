const ENV = process.env.NEXT_PUBLIC_ENVIRONMENT;

export const API =
  ENV === "production" ? process.env.NEXT_PUBLIC_API : "http://localhost:3000";
