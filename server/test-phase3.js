import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function req(method, url, body, cookie) {
  const headers = {};
  if (cookie) headers.Cookie = cookie;
  const options = { method, headers };
  if (body) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`http://localhost:5000${url}`, options);
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, data };
}

async function uploadReq(url, filePath, cookie) {
  const fileData = fs.readFileSync(filePath);
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  
  let body = `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="name"\r\n\r\nStudent\r\n`;
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="email"\r\n\r\nstudent${Math.random()}@c.edu\r\n`;
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="password"\r\n\r\nPass1234\r\n`;
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="department"\r\n\r\nCS\r\n`;
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="year"\r\n\r\n1st\r\n`;
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="document"; filename="test.jpg"\r\n`;
  body += `Content-Type: image/jpeg\r\n\r\n`;

  const bodyBuffer = Buffer.concat([
    Buffer.from(body),
    fileData,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const headers = { 'Content-Type': `multipart/form-data; boundary=${boundary}` };
  if (cookie) headers.Cookie = cookie;

  const res = await fetch(`http://localhost:5000${url}`, { method: 'POST', headers, body: bodyBuffer });
  return { status: res.status, data: await res.json() };
}

async function run() {
  console.log('--- Phase 3 Self-Check ---');

  // 1. Admin login
  const r1 = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'admin@college.edu', password: 'Admin@1234'})
  });
  const adminCookie = r1.headers.get('set-cookie');
  console.log('Admin login:', r1.status === 200 ? 'PASS' : 'FAIL');

  // Create a real mock jpeg (must be at least 12 bytes to pass our magic byte check)
  const fakeJpgPath = path.join(__dirname, 'test.jpg');
  fs.writeFileSync(fakeJpgPath, Buffer.from([0xFF, 0xD8, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));

  // 2. Student Signup (Creates pending user)
  const rSignup = await uploadReq('/api/auth/signup', fakeJpgPath);
  if (rSignup.status !== 201) {
    console.error('Signup failed!', rSignup.data);
    return;
  }
  console.log('Student signup: PASS');
  const studentEmail = rSignup.data.data.user.email;
  const studentId = rSignup.data.data.user._id;

  // 3. Student Login
  const rStudentLogin = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: studentEmail, password: 'Pass1234'})
  });
  const studentCookie = rStudentLogin.headers.get('set-cookie');
  console.log('Student login:', rStudentLogin.status === 200 ? 'PASS' : 'FAIL');

  // 4. Non-admin accessing admin route
  const r4 = await req('GET', '/api/admin/users', null, studentCookie);
  console.log('Non-admin gets 403 on admin route:', r4.status === 403 ? 'PASS' : 'FAIL');

  // 5. Admin lists pending users
  const r5 = await req('GET', '/api/admin/users?verificationStatus=pending', null, adminCookie);
  console.log('Admin lists pending users:', r5.status === 200 && r5.data.data.items.length > 0 ? 'PASS' : 'FAIL');

  // 6. Document streaming 
  const r6 = await req('GET', `/api/admin/users/${studentId}/document`, null, adminCookie);
  console.log('Admin streams document:', r6.status === 200 ? 'PASS' : 'FAIL');
  const r6b = await req('GET', `/api/admin/users/${studentId}/document`, null, studentCookie);
  console.log('Student streams document (blocked):', r6b.status === 403 ? 'PASS' : 'FAIL');

  // 7. Path traversal attempt
  const r7 = await req('GET', '/api/admin/users/../../../../etc/passwd/document', null, adminCookie);
  console.log('Path traversal blocked:', r7.status === 400 || r7.status === 404 ? 'PASS' : 'FAIL', r7.status); // ObjectId invalidation or 404

  // 8. Reject without reason fails
  const r8 = await req('PATCH', `/api/admin/users/${studentId}/verify`, { decision: 'reject' }, adminCookie);
  console.log('Reject without reason fails:', r8.status === 422 ? 'PASS' : 'FAIL', r8.status);

  // 9. Reject with reason
  const r9 = await req('PATCH', `/api/admin/users/${studentId}/verify`, { decision: 'reject', reason: 'Blurry image' }, adminCookie);
  console.log('Reject with reason:', r9.status === 200 ? 'PASS' : 'FAIL');

  // 10. Deciding an already decided user (409)
  const r10 = await req('PATCH', `/api/admin/users/${studentId}/verify`, { decision: 'approve' }, adminCookie);
  console.log('Deciding already decided user gives 409:', r10.status === 409 ? 'PASS' : 'FAIL');

  // 11. Resubmission flow
  const r11 = await uploadReq('/api/auth/resubmit-document', fakeJpgPath, studentCookie);
  console.log('Resubmission for rejected user:', r11.status === 200 ? 'PASS' : 'FAIL', r11.status);
  
  // 12. Verify again (Approve)
  const r12 = await req('PATCH', `/api/admin/users/${studentId}/verify`, { decision: 'approve' }, adminCookie);
  console.log('Approve resubmitted user:', r12.status === 200 ? 'PASS' : 'FAIL');

  // 13. Suspend user
  const r13 = await req('PATCH', `/api/admin/users/${studentId}/suspend`, { suspend: true }, adminCookie);
  console.log('Suspend user:', r13.status === 200 ? 'PASS' : 'FAIL');

  // 14. Suspended user blocked on next request
  const r14 = await req('GET', '/api/auth/me', null, studentCookie);
  console.log('Suspended user blocked (403):', r14.status === 403 ? 'PASS' : 'FAIL', r14.status);

  // Phase 2 re-checks
  fs.writeFileSync(fakeJpgPath, Buffer.from([0x25, 0x50, 0x44, 0x46])); // PDF magic bytes
  const r15 = await uploadReq('/api/auth/signup', fakeJpgPath);
  console.log('Fake image rejected (magic bytes):', r15.status === 422 ? 'PASS' : 'FAIL');

  const r16 = await req('GET', '/uploads/verification/fake.jpg', null, null);
  console.log('Static serving of verification directory returns 404:', r16.status === 404 ? 'PASS' : 'FAIL');
}

run().catch(console.error);
