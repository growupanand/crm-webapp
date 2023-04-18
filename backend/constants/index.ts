export const testEnv = {
  NODEMAILER_SERVICE: "valid-service-name",
  NODEMAILER_USER: "testuser",
  NODEMAILER_PASS: "testpass",
  NODEMAILER_FROM: "testuser@email.com",
  NODEMAILER_HOST: "valid-host",
  NODEMAILER_PORT: "999",
} as Record<string, string>;

export const DEFAULT_ERROR_MESSAGE = "Something went wrong!";
export const DEFAULT_MONGOOSE_ERROR_MESSAGE = DEFAULT_ERROR_MESSAGE;

export const PORT = process.env.PORT || 3001;
export const HOST = process.env.BACKEND_HOST || "http://localhost";
export const BASE_URL = `${HOST}:${PORT}/`;
