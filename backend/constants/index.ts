import { Role } from "@app/types/role";

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
export const NODE_ENV = process.env.NODE_ENV || "local";
export const FRONTEND_HOST =
  process.env.FRONTEND_HOST || "http://localhost:3000";

/** this api urls can be access without need of user email verified */
export const ALLOWED_PATHS_WITHOUT_MAIL_VERIFIED = [
  {
    path: "/user/resendEmailVerification/",
    method: ["POST"],
  },
  {
    path: "/auth/getAccessToken",
    method: ["POST"],
  },
  {
    path: "/user/me/",
    method: ["GET"],
  },
];

/** this api urls can be access without need of user logged in */
export const ALLOWED_PATHS_WITHOUT_USER_LOGGED_IN = [
  {
    path: "/organizations/invitations/accept",
    method: ["GET"],
  },
  {
    path: "/auth/getAccessToken",
    method: ["POST"],
  },
  {
    path: "/status",
    method: ["GET"],
  },
];

/** when server start, default roles will be loaded automatically in Database */
export const DEFAULT_ROLES = [
  {
    name: "Owner",
    slug: "owner",
    /** only one user at a time can be owner of an organization */
    description: "This user is owner of the organization",
    isDefaultRole: true,
  },
  {
    name: "Member",
    slug: "member",
    description: "This user is member of the organization",
    isDefaultRole: true,
  },
] as Omit<Role, "_id">[];

/**
 * Some error messages
 */

export const INVALID_TOKEN_MSG = "Invalid token";
export const EMAIL_NOT_VERIFIED_MSG = "Email not verified";
