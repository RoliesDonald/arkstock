import { EmployeeRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

declare module "next/server" {
  interface NextRequest {
    user?: JwtPayload;
  }
}

export async function authenticateToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Token tidak ditemukan" }, { status: 401 });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.log("JWT is tidak didefine di env variable");
    return NextResponse.json({ message: "Konfigurasi server tidak valid" }, { status: 500 });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
  } catch (error) {
    console.log("verifikasi token error", error);
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ messsage: "Token kadaluarsa" }, { status: 401 });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
    }
    return NextResponse.json({ message: "autentifikasi gagal" }, { status: 401 });
  }
}

export function authorizeRoles(requiredRoles: EmployeeRole[]) {
  return async (req: NextRequest) => {
    if (!req.user) {
      return NextResponse.json({ message: "Karyawan tidak terontentifikasi" }, { status: 403 });
    }
    if (!requiredRoles.includes(req.user.role)) {
      return NextResponse.json(
        {
          message: `Akses ditolak, (${
            req.user.role
          }) tidak memiliki hak akses untuk bagian ini. diperlukan hak akses : ${requiredRoles.join(",")}`,
        },
        { status: 403 }
      );
    }
    return null;
  };
}
