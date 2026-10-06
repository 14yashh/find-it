import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { request, createStudent, createAdmin, loginAs } from './helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Phase 2: Auth', () => {
  let fakeImgPath, fakePdfPath;

  beforeAll(() => {
    fakeImgPath = path.join(__dirname, 'test2.jpg');
    fakePdfPath = path.join(__dirname, 'test2.pdf');
    fs.writeFileSync(fakeImgPath, Buffer.from([0xFF, 0xD8, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
    fs.writeFileSync(fakePdfPath, Buffer.from([0x25, 0x50, 0x44, 0x46, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
  });

  afterAll(() => {
    fs.unlinkSync(fakeImgPath);
    fs.unlinkSync(fakePdfPath);
  });

  it('Signup valid', async () => {
    const res = await request.post('/api/auth/signup')
      .field('name', 'John Doe')
      .field('email', 'john@c.edu')
      .field('password', 'securepass')
      .field('department', 'CS')
      .field('year', '1st')
      .attach('document', fakeImgPath);
      
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('Duplicate email', async () => {
    await createStudent({ email: 'dup@c.edu' });
    const res = await request.post('/api/auth/signup')
      .field('name', 'John 2')
      .field('email', 'dup@c.edu')
      .field('password', 'securepass')
      .field('department', 'CS')
      .field('year', '1st')
      .attach('document', fakeImgPath);
    
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_CONFLICT');
  });

  it('Fake image with wrong magic bytes', async () => {
    const res = await request.post('/api/auth/signup')
      .field('name', 'Hacker')
      .field('email', 'hack@c.edu')
      .field('password', 'securepass')
      .field('department', 'CS')
      .field('year', '1st')
      .attach('document', fakePdfPath, { filename: 'test.jpg', contentType: 'image/jpeg' });
      
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVALID_FILE_TYPE');
  });

  it('Oversized file (too large)', async () => {
    const bigFile = path.join(__dirname, 'big.jpg');
    // Multer limit is 5MB, we generate a 6MB file
    const buf = Buffer.alloc(6 * 1024 * 1024);
    buf.write('\xFF\xD8\xFF', 0, 'binary'); // Write jpeg magic bytes at start
    fs.writeFileSync(bigFile, buf);

    const res = await request.post('/api/auth/signup')
      .field('name', 'Big File')
      .field('email', 'big@c.edu')
      .field('password', 'securepass')
      .field('department', 'CS')
      .field('year', '1st')
      .attach('document', bigFile);
      
    fs.unlinkSync(bigFile);
    expect(res.status).toBe(413);
  });

  it('No document', async () => {
    const res = await request.post('/api/auth/signup')
      .field('name', 'No Doc')
      .field('email', 'nodoc@c.edu')
      .field('password', 'securepass')
      .field('department', 'CS')
      .field('year', '1st');
      
    expect(res.status).toBe(422); // FILE_REQUIRED from upload middleware
  });

  it('Short password', async () => {
    const res = await request.post('/api/auth/signup')
      .field('name', 'Short Pass')
      .field('email', 'short@c.edu')
      .field('password', '123') // Less than 8
      .field('department', 'CS')
      .field('year', '1st')
      .attach('document', fakeImgPath);
      
    expect(res.status).toBe(422);
  });

  it('Login valid', async () => {
    const user = await createStudent();
    const res = await request.post('/api/auth/login').send({
      email: user.email,
      password: 'password123'
    });
    
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('Generic error for wrong credentials', async () => {
    const user = await createStudent({ email: 'cred@c.edu' });
    const res = await request.post('/api/auth/login').send({
      email: user.email,
      password: 'wrongpassword'
    });
    
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');

    const res2 = await request.post('/api/auth/login').send({
      email: 'nonexistent@c.edu',
      password: 'wrongpassword'
    });
    expect(res2.status).toBe(401);
    expect(res2.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('/me returns current user', async () => {
    const user = await createStudent();
    const agent = await loginAs(user);
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(user.email);
  });

  it('Suspended user gets 403 on login and /me', async () => {
    const user = await createStudent({ isSuspended: true });
    
    const res = await request.post('/api/auth/login').send({
      email: user.email,
      password: 'password123'
    });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
    
    // Test if suspension happens after login
    const goodUser = await createStudent({ email: 'sus@c.edu' });
    const agent = await loginAs(goodUser);
    goodUser.isSuspended = true;
    await goodUser.save();
    
    const resMe = await agent.get('/api/auth/me');
    expect(resMe.status).toBe(403);
  });
});
