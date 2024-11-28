// Project Structure
/*
vrv-security-rbac/
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── environment.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   └── Permission.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   └── roleController.ts
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── rbacMiddleware.ts
│   │   └── errorHandler.ts
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── tokenService.ts
│   │   └── securityService.ts
│   │
│   ├── utils/
│   │   ├── passwordUtils.ts
│   │   ├── validationUtils.ts
│   │   └── cryptoUtils.ts
│   │
│   └── routes/
│       ├── authRoutes.ts
│       ├── userRoutes.ts
│       └── roleRoutes.ts
│
├── tests/
│   ├── auth.test.ts
│   ├── rbac.test.ts
│   └── security.test.ts
│
├── package.json
└── tsconfig.json
*/

// 1. Environment Configuration (src/config/environment.ts)
import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SECURITY_LEVELS: {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
  }
};

// 2. Role and Permission Models (src/models/Role.ts)
import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description: string;
  securityLevel: number;
}

export interface IRole extends Document {
  name: string;
  permissions: IPermission[];
  hierarchyLevel: number;
}

const PermissionSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  securityLevel: { 
    type: Number, 
    enum: [ENV.SECURITY_LEVELS.LOW, ENV.SECURITY_LEVELS.MEDIUM, ENV.SECURITY_LEVELS.HIGH],
    default: ENV.SECURITY_LEVELS.LOW
  }
});

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [PermissionSchema],
  hierarchyLevel: { type: Number, required: true }
});

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);
export const Role = mongoose.model<IRole>('Role', RoleSchema);

// 3. User Model with Advanced Security (src/models/User.ts)
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: IRole;
  loginAttempts: number;
  lockUntil: number;
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  isLocked(): boolean;
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  role: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
  loginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockUntil: { 
    type: Number 
  },
  lastLogin: { 
    type: Date 
  }
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
UserSchema.methods.incrementLoginAttempts = async function() {
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= ENV.MAX_LOGIN_ATTEMPTS) {
    updates.$set = { 
      lockUntil: Date.now() + ENV.LOCKOUT_DURATION 
    };
  }
  
  await this.updateOne(updates);
};

// Method to check if account is locked
UserSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

export const User = mongoose.model<IUser>('User', UserSchema);

// 4. Authentication Service (src/services/authService.ts)
import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment';

export class AuthService {
  // Generate JWT Token with Enhanced Security
  static generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
      tokenType: 'access',
      // Add additional claims for enhanced security
      iat: Date.now(),
      jti: this.generateJTI() // Unique token identifier
    };

    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRATION,
      algorithm: 'HS256'
    });
  }

  // Generate Refresh Token
  static generateRefreshToken(user: IUser): string {
    const payload = {
      id: user._id,
      tokenType: 'refresh',
      jti: this.generateJTI()
    };

    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256'
    });
  }

  // Generate Unique Token Identifier
  private static generateJTI(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }

  // Verify Token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, ENV.JWT_SECRET, {
        algorithms: ['HS256']
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

// 5. RBAC Middleware (src/middleware/rbacMiddleware.ts)
import { Request, Response, NextFunction } from 'express';

export class RBACMiddleware {
  // Dynamic Permission Checker
  static checkPermission(requiredPermission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user; // Assumed to be set by previous auth middleware
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Retrieve user's role with populated permissions
      const userRole = await Role.findById(user.role)
        .populate('permissions');

      if (!userRole) {
        return res.status(403).json({ message: 'Role not found' });
      }

      // Check if role has the required permission
      const hasPermission = userRole.permissions.some(
        perm => perm.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          requiredPermission 
        });
      }

      next();
    };
  }

  // Hierarchical Access Control
  static hierarchicalAccess(requiredLevel: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      
      if (!user || user.role.hierarchyLevel < requiredLevel) {
        return res.status(403).json({ 
          message: 'Insufficient access level' 
        });
      }

      next();
    };
  }
}

// 6. Authentication Controller (src/controllers/authController.ts)
export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password, roleId } = req.body;

      // Validate input
      if (!username || !email || !password || !roleId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create new user
      const newUser = new User({
        username,
        email,
        password,
        role: roleId
      });

      await newUser.save();

      // Generate tokens
      const accessToken = AuthService.generateToken(newUser);
      const refreshToken = AuthService.generateRefreshToken(newUser);

      res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        refreshToken
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Registration failed',
        error: error instanceof Error ? error.message : error 
      });
    }
  }

  // Additional methods: login, logout, refresh token, etc.
}

// Comprehensive Example of How to Use
async function setupInitialRoles() {
  // Create base permissions
  const readPerm = await Permission.create({
    name: 'read:any',
    description: 'Read access to resources',
    securityLevel: ENV.SECURITY_LEVELS.LOW
  });

  const writePerm = await Permission.create({
    name: 'write:any',
    description: 'Write access to resources',
    securityLevel: ENV.SECURITY_LEVELS.MEDIUM
  });

  // Create roles with different hierarchy and permissions
  await Role.create([
    {
      name: 'Admin',
      permissions: [readPerm, writePerm],
      hierarchyLevel: 3
    },
    {
      name: 'Moderator',
      permissions: [readPerm],
      hierarchyLevel: 2
    },
    {
      name: 'User',
      permissions: [readPerm],
      hierarchyLevel: 1
    }
  ]);
}
