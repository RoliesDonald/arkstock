import { EmployeeRole } from "./employee";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: string;
    email: string;
    role: EmployeeRole;
    name: string;
  }
}
