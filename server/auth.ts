import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import type { User as SchemaUser } from "@shared/schema";
import type { Express, Request, Response, NextFunction } from "express";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return salt + ':' + derivedKey.toString('hex');
}

export async function comparePasswords(storedPassword: string, inputPassword: string): Promise<boolean> {
  try {
    if (!storedPassword || !storedPassword.includes(':')) {
      return false;
    }
    const [salt, hash] = storedPassword.split(':');
    if (!salt || !hash) return false;

    const derivedKey = await scryptAsync(inputPassword, salt, 64) as Buffer;
    return hash === derivedKey.toString('hex');
  } catch (error) {
    return false;
  }
}

declare global {
  namespace Express {
    interface User extends Omit<SchemaUser, "password"> {}
  }
}

export function setupAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const isValid = await comparePasswords(user.password, password);
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const { password: _, ...userWithoutPassword } = user;
          return done(null, userWithoutPassword);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  return passport;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};