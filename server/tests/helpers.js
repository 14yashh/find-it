import supertest from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const request = supertest(app);

function uniqueEmail(prefix = 'user') {
  return `${prefix}-${randomUUID().slice(0, 8)}@test.edu`;
}

export async function createStudent(overrides = {}) {
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await User.create({
    name: 'Student User',
    email: uniqueEmail('student'),
    passwordHash,
    department: 'CS',
    year: '1st',
    verificationStatus: 'pending',
    isSuspended: false,
    ...overrides
  });
  return user;
}

export async function createApprovedStudent(overrides = {}) {
  return createStudent({ verificationStatus: 'approved', ...overrides });
}

export async function createAdmin(overrides = {}) {
  return createStudent({ 
    role: 'admin', 
    verificationStatus: 'approved', 
    ...overrides 
  });
}

export async function loginAs(user, password = 'password123') {
  const agent = supertest.agent(app);
  await agent.post('/api/auth/login').send({
    email: user.email,
    password
  });
  return agent;
}

export { request };

