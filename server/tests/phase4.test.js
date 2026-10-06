/**
 * tests/phase4.test.js
 * Phase 4: Items CRUD, image upload, search/filter, authenticated image serving.
 *
 * Tests are derived from the spec, not from the implementation.
 */
import path       from 'path';
import fs         from 'fs';
import { fileURLToPath } from 'url';
import { request, createStudent, createApprovedStudent, createAdmin, loginAs } from './helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Minimal valid 1x1 JPEG buffer ───────────────────────────
const validJpegBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

function makeValidJpeg() {
  return Buffer.from(validJpegBase64, 'base64');
}

describe('Phase 4: Items', () => {
  let student, studentAgent;
  let admin, adminAgent;
  let other, otherAgent;
  let jpegPath, pdfPath;

  beforeAll(() => {
    jpegPath = path.join(__dirname, 'p4_test.jpg');
    pdfPath  = path.join(__dirname, 'p4_fake.pdf');
    fs.writeFileSync(jpegPath, makeValidJpeg());
    fs.writeFileSync(pdfPath, Buffer.from([0x25, 0x50, 0x44, 0x46, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
  });

  beforeEach(async () => {
    student      = await createApprovedStudent();
    studentAgent = await loginAs(student);
    admin        = await createAdmin();
    adminAgent   = await loginAs(admin);
    other        = await createApprovedStudent();
    otherAgent   = await loginAs(other);
  });

  afterAll(() => {
    if (fs.existsSync(jpegPath)) fs.unlinkSync(jpegPath);
    if (fs.existsSync(pdfPath))  fs.unlinkSync(pdfPath);
  });

  // ── Unapproved users blocked ───────────────────────────────────────────────

  it('Pending user cannot access items endpoints', async () => {
    const pending = await createStudent({ verificationStatus: 'pending' });
    const pendingAgent = await loginAs(pending);
    const res = await pendingAgent.get('/api/items');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('NOT_APPROVED');
  });

  // ── POST /api/items ────────────────────────────────────────────────────────

  it('Create lost item without images succeeds', async () => {
    const res = await studentAgent.post('/api/items')
      .field('type', 'lost')
      .field('title', 'Lost Keys')
      .field('description', 'A bunch of keys with a blue keychain')
      .field('category', 'keys')
      .field('location', 'Library')
      .field('dateOccurred', new Date().toISOString());

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item.type).toBe('lost');
    expect(res.body.data.item.title).toBe('Lost Keys');
    // postedBy must only expose _id, name, department
    expect(res.body.data.item.postedBy).toMatchObject({ name: expect.any(String), department: expect.any(String) });
    expect(res.body.data.item.postedBy.email).toBeUndefined();
    expect(res.body.data.item.postedBy.passwordHash).toBeUndefined();
  });

  it('Create found item requires verificationQuestion', async () => {
    const res = await studentAgent.post('/api/items')
      .field('type', 'found')
      .field('title', 'Found Wallet')
      .field('description', 'A black leather wallet found near cafeteria')
      .field('category', 'bags')
      .field('location', 'Cafeteria')
      .field('dateOccurred', new Date().toISOString());
    // No verificationQuestion → 422
    expect(res.status).toBe(422);
  });

  it('Create found item with verificationQuestion succeeds', async () => {
    const res = await studentAgent.post('/api/items')
      .field('type', 'found')
      .field('title', 'Found Wallet')
      .field('description', 'A black leather wallet found near cafeteria')
      .field('category', 'bags')
      .field('location', 'Cafeteria')
      .field('dateOccurred', new Date().toISOString())
      .field('verificationQuestion', 'What is the brand on the wallet?');

    expect(res.status).toBe(201);
    expect(res.body.data.item.verificationQuestion).toBe('What is the brand on the wallet?');
  });

  it('Lost item ignores verificationQuestion', async () => {
    const res = await studentAgent.post('/api/items')
      .field('type', 'lost')
      .field('title', 'Lost Book')
      .field('description', 'A thick textbook with a red cover')
      .field('category', 'books')
      .field('location', 'Canteen')
      .field('dateOccurred', new Date().toISOString())
      .field('verificationQuestion', 'This should be ignored');

    expect(res.status).toBe(201);
    // verificationQuestion should be undefined/null for lost items
    expect(res.body.data.item.verificationQuestion).toBeFalsy();
  });

  it('Create item with image (JPEG) — image returned as URL', async () => {
    const res = await studentAgent.post('/api/items')
      .field('type', 'lost')
      .field('title', 'Lost Phone')
      .field('description', 'Black Samsung phone with cracked screen')
      .field('category', 'electronics')
      .field('location', 'Auditorium')
      .field('dateOccurred', new Date().toISOString())
      .attach('images', jpegPath);

    expect(res.status).toBe(201);
    expect(res.body.data.item.images).toHaveLength(1);
    expect(res.body.data.item.images[0]).toMatch(/^\/api\/files\/items\//);
  });

  it('Reject fake image with wrong magic bytes', async () => {
    const res = await studentAgent.post('/api/items')
      .field('type', 'lost')
      .field('title', 'Test Item Magic')
      .field('description', 'Description here for test item')
      .field('category', 'other')
      .field('location', 'Hallway')
      .field('dateOccurred', new Date().toISOString())
      .attach('images', pdfPath, { filename: 'photo.jpg', contentType: 'image/jpeg' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVALID_FILE_TYPE');
  });

  it('Reject more than 4 images', async () => {
    const req = studentAgent.post('/api/items')
      .field('type', 'lost')
      .field('title', 'Too Many Images')
      .field('description', 'This item has way too many images attached')
      .field('category', 'other')
      .field('location', 'Hallway')
      .field('dateOccurred', new Date().toISOString());

    // Attach 5 images
    for (let i = 0; i < 5; i++) {
      req.attach('images', jpegPath);
    }
    const res = await req;
    expect(res.status).toBe(422);
  });

  it('Reject item missing required fields', async () => {
    const res = await studentAgent.post('/api/items')
      .field('type', 'lost')
      .field('title', 'No');  // missing description, category, location, dateOccurred
    expect(res.status).toBe(422);
  });

  // ── GET /api/items ─────────────────────────────────────────────────────────

  it('GET /api/items returns paginated results (default open+claim_pending)', async () => {
    // Create items
    await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Lost Umbrella')
      .field('description', 'Red umbrella left by main entrance')
      .field('category', 'other').field('location', 'Main Gate')
      .field('dateOccurred', new Date().toISOString());

    const res = await studentAgent.get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('items');
    expect(res.body.data).toHaveProperty('page');
    expect(res.body.data).toHaveProperty('limit');
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('totalPages');
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it('GET /api/items filters by type', async () => {
    await studentAgent.post('/api/items')
      .field('type', 'found').field('title', 'Found Laptop')
      .field('description', 'Dell laptop found in classroom 201')
      .field('category', 'electronics').field('location', 'Room 201')
      .field('dateOccurred', new Date().toISOString())
      .field('verificationQuestion', 'What sticker is on the lid?');

    const res = await studentAgent.get('/api/items?type=found');
    expect(res.status).toBe(200);
    expect(res.body.data.items.every(i => i.type === 'found')).toBe(true);
  });

  it('GET /api/items filters by category', async () => {
    await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Lost Student ID')
      .field('description', 'Blue and white student identification card')
      .field('category', 'id_cards').field('location', 'Sports Complex')
      .field('dateOccurred', new Date().toISOString());

    const res = await studentAgent.get('/api/items?category=id_cards');
    expect(res.status).toBe(200);
    expect(res.body.data.items.every(i => i.category === 'id_cards')).toBe(true);
  });

  it('GET /api/items location filter is case-insensitive partial match', async () => {
    await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Lost Notebook')
      .field('description', 'Spiral notebook with green cover')
      .field('category', 'books').field('location', 'Science Block Lab')
      .field('dateOccurred', new Date().toISOString());

    const res = await studentAgent.get('/api/items?location=science+block');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.items[0].location.toLowerCase()).toContain('science block');
  });

  it('GET /api/items rejects object-style query params', async () => {
    const res = await studentAgent.get('/api/items?status[$ne]=open');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('GET /api/items pagination works', async () => {
    // Create 3 items
    for (let i = 0; i < 3; i++) {
      await studentAgent.post('/api/items')
        .field('type', 'lost')
        .field('title', `Pagination Test Item ${i}`)
        .field('description', 'A test item for pagination testing purposes')
        .field('category', 'other')
        .field('location', 'Test Hall')
        .field('dateOccurred', new Date().toISOString());
    }

    const res = await studentAgent.get('/api/items?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeLessThanOrEqual(2);
    expect(res.body.data.limit).toBe(2);
  });

  it('GET /api/items limit capped at 50', async () => {
    const res = await studentAgent.get('/api/items?limit=200');
    expect(res.status).toBe(422);
  });

  // ── GET /api/items/mine ────────────────────────────────────────────────────

  it('GET /api/items/mine returns only own items', async () => {
    await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'My Item')
      .field('description', 'This item belongs to the current user')
      .field('category', 'keys').field('location', 'Parking Lot')
      .field('dateOccurred', new Date().toISOString());

    // other user also creates an item
    await otherAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Other Item')
      .field('description', 'This item belongs to a different user')
      .field('category', 'bags').field('location', 'Gym')
      .field('dateOccurred', new Date().toISOString());

    const res = await studentAgent.get('/api/items/mine');
    expect(res.status).toBe(200);
    expect(res.body.data.items.every(i => i.postedBy._id === student._id.toString())).toBe(true);
  });

  // ── GET /api/items/:id ─────────────────────────────────────────────────────

  it('GET /api/items/:id returns item', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Specific Item')
      .field('description', 'A specific item retrieved by its ID')
      .field('category', 'clothing').field('location', 'Hostel A')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;
    const res = await studentAgent.get(`/api/items/${itemId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.item._id).toBe(itemId);
  });

  it('GET /api/items/:id returns 404 for unknown id', async () => {
    const res = await studentAgent.get('/api/items/000000000000000000000099');
    expect(res.status).toBe(404);
  });

  // ── PATCH /api/items/:id ───────────────────────────────────────────────────

  it('Owner can update item', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Old Title')
      .field('description', 'Original description for this test item')
      .field('category', 'books').field('location', 'Library')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;

    const res = await studentAgent.patch(`/api/items/${itemId}`)
      .field('title', 'Updated Title');

    expect(res.status).toBe(200);
    expect(res.body.data.item.title).toBe('Updated Title');
  });

  it('Non-owner cannot update item', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'My Private Item')
      .field('description', 'Description for the private item owned by student')
      .field('category', 'keys').field('location', 'Dorm')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;
    const res = await otherAgent.patch(`/api/items/${itemId}`)
      .field('title', 'Stolen Title');

    expect(res.status).toBe(403);
  });

  // ── PATCH /api/items/:id/status ────────────────────────────────────────────

  it('Owner can mark item as returned', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Found My Keys')
      .field('description', 'Keys that were lost and now have been found')
      .field('category', 'keys').field('location', 'Office')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;

    const res = await studentAgent.patch(`/api/items/${itemId}/status`);
    expect(res.status).toBe(200);
    expect(res.body.data.item.status).toBe('returned');
  });

  it('Non-owner cannot change status', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Owned Item For Status')
      .field('description', 'This item should not be modifiable by others')
      .field('category', 'bags').field('location', 'Gym')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;
    const res = await otherAgent.patch(`/api/items/${itemId}/status`);
    expect(res.status).toBe(403);
  });

  it('Cannot mark already-returned item as returned again', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Already Returned')
      .field('description', 'This item was already returned so cannot be returned again')
      .field('category', 'clothing').field('location', 'Lobby')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;
    await studentAgent.patch(`/api/items/${itemId}/status`);
    const res = await studentAgent.patch(`/api/items/${itemId}/status`);
    expect(res.status).toBe(400);
  });

  it('Cannot edit a returned item', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Returned Item Edit Block')
      .field('description', 'Cannot edit an item once it has been returned')
      .field('category', 'other').field('location', 'Gate')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;
    await studentAgent.patch(`/api/items/${itemId}/status`);

    const res = await studentAgent.patch(`/api/items/${itemId}`)
      .field('title', 'New Title After Return');
    expect(res.status).toBe(403);
  });

  // ── DELETE /api/items/:id ──────────────────────────────────────────────────

  it('Owner can delete own item', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'To Be Deleted')
      .field('description', 'This item is going to be deleted by its owner')
      .field('category', 'other').field('location', 'Hall')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;

    const del = await studentAgent.delete(`/api/items/${itemId}`);
    expect(del.status).toBe(200);

    const get = await studentAgent.get(`/api/items/${itemId}`);
    expect(get.status).toBe(404);
  });

  it('Non-owner student cannot delete item', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Protected Item')
      .field('description', 'This item is protected and cannot be deleted by others')
      .field('category', 'keys').field('location', 'Building B')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;
    const res = await otherAgent.delete(`/api/items/${itemId}`);
    expect(res.status).toBe(403);
  });

  it('Admin can delete any item', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Admin Will Delete This')
      .field('description', 'Admin should be able to delete any item in the system')
      .field('category', 'bags').field('location', 'Courtyard')
      .field('dateOccurred', new Date().toISOString());

    const itemId = createRes.body.data.item._id;
    const res = await adminAgent.delete(`/api/items/${itemId}`);
    expect(res.status).toBe(200);
  });

  // ── GET /api/files/items/:filename ────────────────────────────────────────

  it('Unauthenticated request to file endpoint returns 401', async () => {
    const res = await request.get('/api/files/items/some-file.jpg');
    expect(res.status).toBe(401);
  });

  it('Non-UUID filename returns 404', async () => {
    const res = await studentAgent.get('/api/files/items/../../etc/passwd');
    expect(res.status).toBe(404);
  });

  it('Non-UUID filename (no dots) returns 404', async () => {
    const res = await studentAgent.get('/api/files/items/malicious-file');
    expect(res.status).toBe(404);
  });

  it('Non-existent UUID filename returns 404', async () => {
    const res = await studentAgent.get('/api/files/items/00000000-0000-0000-0000-000000000000.jpg');
    expect(res.status).toBe(404);
  });

  it('Uploaded image is accessible via GET /api/files/items/:filename', async () => {
    const createRes = await studentAgent.post('/api/items')
      .field('type', 'lost').field('title', 'Item With Servable Image')
      .field('description', 'Test item created to verify image serving works')
      .field('category', 'electronics').field('location', 'Room 301')
      .field('dateOccurred', new Date().toISOString())
      .attach('images', jpegPath);

    expect(createRes.status).toBe(201);
    const imageUrl = createRes.body.data.item.images[0]; // /api/files/items/<uuid>.webp
    const res = await studentAgent.get(imageUrl);
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toMatch(/private/);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  // ── Seed idempotency (regression from phase 2) ─────────────────────────────

  it('Creating admin with same email twice does not duplicate (seed idempotency)', async () => {
    // The seed script does findOne then create — simulate that logic.
    // If the admin already exists (unique email), the second creation throws.
    const { default: User }  = await import('../src/models/User.js');
    const { default: bcrypt } = await import('bcryptjs');

    const adminEmail = `seed-test-admin-${Date.now()}@college.edu`;
    const hash = await bcrypt.hash('Admin@1234', 10);

    await User.create({ name: 'Admin', email: adminEmail, passwordHash: hash, department: 'Administration', year: 'N/A', role: 'admin', verificationStatus: 'approved' });

    // Second upsert with findOneAndUpdate (upsert:true) should not create a second doc
    await User.findOneAndUpdate(
      { email: adminEmail },
      { $setOnInsert: { name: 'Admin', email: adminEmail, passwordHash: hash, department: 'Administration', year: 'N/A', role: 'admin', verificationStatus: 'approved' } },
      { upsert: true, new: true }
    );

    const count = await User.countDocuments({ email: adminEmail });
    expect(count).toBe(1);
  });
});
