import { hashPassword, verifyPassword } from '../security/crypto';

export type UserRole = 'CUSTOMER' | 'RESTAURANT_ADMIN' | 'DELIVERY_RIDER' | 'SUPER_ADMIN';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
  restaurantId?: string;
  avatar: string;
  createdAt: string;
}

// Global in-memory user registry for the application lifecycle
const userRegistry: Map<string, StoredUser> = new Map();

// Helper to seed initial users with secure PBKDF2 password hashes
let isSeeded = false;

export async function ensureSeedUsers(): Promise<void> {
  if (isSeeded) return;

  const defaultUsers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    plainPass: string;
    restaurantId?: string;
    avatar: string;
  }> = [
    {
      id: 'usr-tanvir',
      name: 'Tanvir Ahmed',
      email: 'tanvir@feasthub.local',
      phone: '+880 1819-456789',
      role: 'CUSTOMER',
      plainPass: 'Customer@123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'admin-lab',
      name: 'Chef Sadek (The Burger Lab)',
      email: 'admin@theburgerlab.local',
      phone: '+880 1711-234567',
      role: 'RESTAURANT_ADMIN',
      plainPass: 'Admin@123',
      restaurantId: 'rest-1',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'rider-rakib',
      name: 'Rakib Hasan',
      email: 'rider.rakib@feasthub.local',
      phone: '+880 1712-345678',
      role: 'DELIVERY_RIDER',
      plainPass: 'Rider@123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'superadmin-root',
      name: 'Executive Operations Admin',
      email: 'superadmin@feasthub.local',
      phone: '+880 1999-000000',
      role: 'SUPER_ADMIN',
      plainPass: 'SuperAdmin@123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  for (const u of defaultUsers) {
    const passwordHash = await hashPassword(u.plainPass);
    userRegistry.set(u.email.toLowerCase(), {
      id: u.id,
      name: u.name,
      email: u.email.toLowerCase(),
      phone: u.phone,
      role: u.role,
      passwordHash,
      restaurantId: u.restaurantId,
      avatar: u.avatar,
      createdAt: new Date().toISOString(),
    });
  }

  isSeeded = true;
}

/**
 * Finds user by normalized email address
 */
export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  await ensureSeedUsers();
  return userRegistry.get(email.trim().toLowerCase());
}

/**
 * Finds user by unique user ID
 */
export async function findUserById(id: string): Promise<StoredUser | undefined> {
  await ensureSeedUsers();
  for (const user of userRegistry.values()) {
    if (user.id === id) return user;
  }
  return undefined;
}

/**
 * Registers a new user account with hashed password
 */
export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}): Promise<StoredUser> {
  await ensureSeedUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  if (userRegistry.has(normalizedEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const passwordHash = await hashPassword(data.password);
  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    name: data.name,
    email: normalizedEmail,
    phone: data.phone,
    role: data.role || 'CUSTOMER',
    passwordHash,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  };

  userRegistry.set(normalizedEmail, newUser);
  return newUser;
}

/**
 * Strips confidential fields (passwordHash) before returning to client
 */
export function sanitizeUserForClient(user: StoredUser) {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
