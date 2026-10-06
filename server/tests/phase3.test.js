import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { request, createStudent, createAdmin, createApprovedStudent, loginAs } from './helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Phase 3: Admin', () => {
  let admin, adminAgent;
  let student, studentAgent;
  let fakeImgPath;

  beforeAll(async () => {
    fakeImgPath = path.join(__dirname, 'test3.jpg');
    fs.writeFileSync(fakeImgPath, Buffer.from([0xFF, 0xD8, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
  });

  beforeEach(async () => {
    admin = await createAdmin();
    student = await createStudent();
    adminAgent = await loginAs(admin);
    studentAgent = await loginAs(student);
  });

  afterAll(() => {
    fs.unlinkSync(fakeImgPath);
  });

  it('Non-admin gets 403 on admin routes', async () => {
    const res = await studentAgent.get('/api/admin/users');
    expect(res.status).toBe(403);
  });

  it('List and filter pending users', async () => {
    await createStudent({ verificationStatus: 'pending', name: 'PenDing user' });
    await createApprovedStudent();
    
    const res = await adminAgent.get('/api/admin/users?verificationStatus=pending');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.items.every(i => i.verificationStatus === 'pending')).toBe(true);
  });

  it('Document streaming for admin only', async () => {
    // Signup to create a valid document path
    const rSignup = await request.post('/api/auth/signup')
      .field('name', 'Doc Tester')
      .field('email', 'doctester@c.edu')
      .field('password', 'securepass')
      .field('department', 'CS')
      .field('year', '1st')
      .attach('document', fakeImgPath);
      
    const userId = rSignup.body.data.user._id;
    
    const resStudent = await studentAgent.get(`/api/admin/users/${userId}/document`);
    expect(resStudent.status).toBe(403);

    const resAdmin = await adminAgent.get(`/api/admin/users/${userId}/document`);
    expect(resAdmin.status).toBe(200);
    expect(resAdmin.headers['content-type']).toBe('image/jpeg');
  });

  it('Path traversal blocked', async () => {
    const res = await adminAgent.get('/api/admin/users/../../../../etc/passwd/document');
    expect(res.status).toBe(400); // Invalid ObjectId
  });

  it('Approve', async () => {
    const u = await createStudent({ verificationStatus: 'pending' });
    const res = await adminAgent.patch(`/api/admin/users/${u._id}/verify`).send({ decision: 'approve' });
    expect(res.status).toBe(200);
    expect(res.body.data.user.verificationStatus).toBe('approved');
  });

  it('Reject needs a reason', async () => {
    const u = await createStudent({ verificationStatus: 'pending' });
    const res = await adminAgent.patch(`/api/admin/users/${u._id}/verify`).send({ decision: 'reject' });
    expect(res.status).toBe(422); // Validation Error
  });

  it('Deciding an already-decided user gets 409', async () => {
    const u = await createApprovedStudent();
    const res = await adminAgent.patch(`/api/admin/users/${u._id}/verify`).send({ decision: 'approve' });
    expect(res.status).toBe(409);
  });

  it('Resubmission flow', async () => {
    const u = await createStudent({ verificationStatus: 'rejected', email: 'rej@c.edu' });
    const rejAgent = await loginAs(u);
    
    const res = await rejAgent.post('/api/auth/resubmit-document')
      .attach('document', fakeImgPath);
    expect(res.status).toBe(200);
    expect(res.body.data.user.verificationStatus).toBe('pending');
  });

  it('Suspended user blocked on the next request', async () => {
    const u = await createStudent({ email: 'sus2@c.edu' });
    const sAgent = await loginAs(u);
    
    const resSus = await adminAgent.patch(`/api/admin/users/${u._id}/suspend`).send({ suspend: true });
    expect(resSus.status).toBe(200);
    
    const res = await sAgent.get('/api/auth/me');
    expect(res.status).toBe(403);
  });
});
