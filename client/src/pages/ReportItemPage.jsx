import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import FileDrop from '../components/ui/FileDrop.jsx';
import Button from '../components/ui/Button.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useItem } from '../hooks/useItem.js';
import { useItems } from '../hooks/useItems.js';
import {
  FileText,
  HelpCircle,
  Upload,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function ReportItemPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { item: existingItem } = useItem(id);
  const { addItem, updateItem } = useItems();

  const [formData, setFormData] = useState({
    type: 'found', // 'lost' | 'found'
    title: '',
    description: '',
    category: 'electronics',
    location: '',
    dateOccurred: new Date().toISOString().split('T')[0],
    verificationQuestion: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isEditing && existingItem) {
      setFormData({
        type: existingItem.type || 'found',
        title: existingItem.title || '',
        description: existingItem.description || '',
        category: existingItem.category || 'electronics',
        location: existingItem.location || '',
        dateOccurred: existingItem.dateOccurred
          ? existingItem.dateOccurred.split('T')[0]
          : new Date().toISOString().split('T')[0],
        verificationQuestion: existingItem.verificationQuestion || '',
      });
      if (existingItem.images) {
        setImageFiles(existingItem.images);
      }
    }
  }, [isEditing, existingItem]);

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics & Computing' },
    { value: 'id_cards', label: 'ID Badges & Cards' },
    { value: 'bags', label: 'Bags, Backpacks & Cases' },
    { value: 'keys', label: 'Keys & Keychains' },
    { value: 'books', label: 'Books & Course Materials' },
    { value: 'clothing', label: 'Outerwear & Clothing' },
    { value: 'other', label: 'Miscellaneous Other' },
  ];

  const handleFieldChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title headline is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (!formData.location.trim()) errs.location = 'Campus location is required.';
    if (!formData.dateOccurred) errs.dateOccurred = 'Date is required.';
    if (formData.type === 'found') {
      if (!formData.verificationQuestion || formData.verificationQuestion.trim().length < 5) {
        errs.verificationQuestion = 'Verification question is required (min 5 characters) for found items.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      updateItem(id, {
        ...formData,
        images: imageFiles,
      });
    } else {
      const newItem = {
        _id: `item-${Date.now()}`,
        tagNumber: `TAG-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        images: imageFiles,
        status: 'open',
        postedBy: {
          _id: user?._id || 'user-current',
          name: user?.name || 'Jordan Taylor',
          department: user?.department || 'Computer Science',
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      };
      addItem(newItem);
    }

    setSubmitted(true);
    setTimeout(() => {
      navigate('/my-items');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      <Navbar variant="student" user={user} />

      {/* Breadcrumb banner */}
      <section className="bg-manila border-b-2 border-ink px-4 md:px-6 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between font-meta text-xs">
          <div className="flex items-center gap-2">
            <span className="text-ink-muted uppercase">LEDGER DOCKET</span>
            <span>&gt;</span>
            <span className="font-bold text-ink uppercase">
              {isEditing ? 'EDIT RECORD ENTRY' : 'NEW PROPERTY RECORD ENTRY'}
            </span>
          </div>
          <span className="hidden sm:inline-block bg-paper border border-ink px-2 py-0.5 font-bold uppercase">
            SECTION: INTAKE RECEPTION
          </span>
        </div>
      </section>

      {/* Main Form Canvas */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-ink pb-4 gap-2">
          <div>
            <div className="inline-block px-2.5 py-0.5 bg-ink text-paper font-meta text-xs font-bold mb-1 tracking-widest uppercase">
              OFFICIAL INTAKE REGISTRY
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-ink uppercase tracking-tight">
              {isEditing ? 'Update Docket Record' : 'Intake Docket // Form 104-B: Report Item'}
            </h1>
            <p className="font-sans text-sm md:text-base text-ink-muted mt-0.5">
              File a physical record into the central campus property registry. Ensure high descriptive accuracy for custodial verification.
            </p>
          </div>
          <div className="bg-paper border-2 border-ink p-2.5 text-right hard-shadow-2">
            <span className="block font-meta text-[10px] text-ink-muted uppercase tracking-wider font-bold">
              REGISTRATION KEY
            </span>
            <span className="block font-meta text-xs font-bold text-ink">
              DOCK-2026-FORM
            </span>
          </div>
        </div>

        {submitted ? (
          <div className="border-2 border-ink bg-paper p-10 text-center hard-shadow-6 max-w-xl mx-auto my-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-stamp-found mx-auto" />
            <h2 className="font-heading text-2xl font-bold uppercase text-ink">
              {isEditing ? 'Record Updated' : 'Item Catalogued in Central Ledger'}
            </h2>
            <p className="font-meta text-xs text-ink-muted">
              Redirecting you to your registered items list...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: PRIMARY FORM (7 cols) */}
            <section className="lg:col-span-7 bg-paper border-2 border-ink p-6 sm:p-8 hard-shadow-6 relative">
              <Tape position="top-left" />
              <div className="absolute top-4 right-4 eyelet" />

              {/* CLASSIFICATION TOGGLE */}
              <div className="mb-6">
                <label className="block font-meta text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  1.0 Docket Filing Classification <span className="text-primary">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('type', 'lost')}
                    className={`border-2 border-ink p-3.5 text-left transition-none flex items-center justify-between ${
                      formData.type === 'lost'
                        ? 'bg-paper-light border-ink hard-shadow-4'
                        : 'bg-paper hover:bg-manila/50'
                    }`}
                  >
                    <div>
                      <span className="block font-heading text-base font-bold text-ink">
                        LOST ITEM
                      </span>
                      <span className="block font-meta text-xs text-ink-muted">
                        Owner searching for asset
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 border-ink flex items-center justify-center ${
                        formData.type === 'lost' ? 'bg-stamp-lost text-white font-bold' : 'bg-paper'
                      }`}
                    >
                      {formData.type === 'lost' && '✓'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange('type', 'found')}
                    className={`border-2 border-ink p-3.5 text-left transition-none flex items-center justify-between ${
                      formData.type === 'found'
                        ? 'bg-manila border-ink hard-shadow-4'
                        : 'bg-paper hover:bg-manila/50'
                    }`}
                  >
                    <div>
                      <span className="block font-heading text-base font-bold text-ink">
                        FOUND ITEM
                      </span>
                      <span className="block font-meta text-xs text-ink-muted">
                        In custody / surrendered
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 border-ink flex items-center justify-center ${
                        formData.type === 'found' ? 'bg-stamp-found text-white font-bold' : 'bg-paper'
                      }`}
                    >
                      {formData.type === 'found' && '✓'}
                    </div>
                  </button>
                </div>
              </div>

              {/* CORE FIELDS */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="2.0 Item Nomenclature / Description Headline"
                  id="item-title"
                  required
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  error={errors.title}
                  placeholder="e.g. Black Dell 65W Laptop Charger, Stainless Hydroflask, Blue Backpack"
                  hint="Prominent physical identifiers without revealing secret clues."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="2.1 Property Category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    options={categoryOptions}
                    error={errors.category}
                  />

                  <Input
                    label="2.2 Date Occurred"
                    id="dateOccurred"
                    type="date"
                    required
                    value={formData.dateOccurred}
                    onChange={(e) => handleFieldChange('dateOccurred', e.target.value)}
                    error={errors.dateOccurred}
                  />
                </div>

                <div>
                  <Input
                    label="2.3 Geographic Campus Location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    error={errors.location}
                    placeholder="e.g. Central Library 2nd Floor, Science Concourse L2, Gym Bleachers"
                    hint="Where the item was recovered or last noticed."
                  />
                  {/* Quick suggestion tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2 font-meta text-xs text-ink-muted">
                    <span className="text-[11px] font-bold">Frequent:</span>
                    {['Main Library 2nd Fl', 'Student Union Cafe', 'Science Concourse', 'Gym Lockers'].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleFieldChange('location', loc)}
                        className="px-2 py-0.5 border border-ink/40 bg-paper-light hover:bg-manila transition-none"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC VERIFICATION QUESTION (FOR FOUND ITEMS) */}
                {formData.type === 'found' && (
                  <div className="border-2 border-ink bg-manila p-4 hard-shadow-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-heading text-sm font-bold uppercase text-ink">
                        3.0 Verification Question (Required for Found Items)
                      </h3>
                    </div>
                    <p className="font-sans text-xs text-ink-muted">
                      Only the genuine owner should know this answer. Do NOT state the answer in your title or description!
                    </p>
                    <Input
                      id="verificationQuestion"
                      required
                      value={formData.verificationQuestion}
                      onChange={(e) => handleFieldChange('verificationQuestion', e.target.value)}
                      error={errors.verificationQuestion}
                      placeholder="e.g. What specific sticker is on the back? What color is the lanyard?"
                      hint="Claimants must answer this to prove ownership before handover."
                    />
                  </div>
                )}

                <Textarea
                  label="4.0 Physical Ledger Description & Identifying Marks"
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  error={errors.description}
                  placeholder="Record wear marks, stickers, color nuances, brand engraving, visible scuffs..."
                  hint="Detailed physical description for the official register."
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>{isEditing ? 'Update Central Ledger Record' : 'Post Item to Central Ledger'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </section>

            {/* RIGHT COLUMN: EVIDENCE IMAGES (5 cols) */}
            <aside className="lg:col-span-5 space-y-6">
              <div className="bg-paper border-2 border-ink p-6 hard-shadow-4">
                <div className="flex items-center justify-between border-b-2 border-ink pb-3 mb-4">
                  <div className="flex items-center gap-2 font-heading font-bold text-base uppercase text-ink">
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Photographic Evidence</span>
                  </div>
                  <span className="font-meta text-xs bg-manila border border-ink px-1.5 py-0.5 font-bold">
                    {imageFiles.length}/4 ATTACHED
                  </span>
                </div>

                <FileDrop
                  label="Upload Item Photos"
                  hint="Attach up to 4 photos (JPG, PNG, WebP up to 5 MB each)"
                  multiple={true}
                  maxFiles={4}
                  files={imageFiles}
                  onChange={(newFiles) => {
                    const combined = [...imageFiles, ...newFiles].slice(0, 4);
                    setImageFiles(combined);
                  }}
                  onRemove={(idx) => {
                    setImageFiles(imageFiles.filter((_, i) => i !== idx));
                  }}
                />

                <div className="mt-4 p-3 border-2 border-dashed border-ink/40 bg-manila/30 font-meta text-xs text-ink-muted space-y-1">
                  <span className="font-bold uppercase text-ink block">
                    Archival Photo Policy:
                  </span>
                  <p className="text-[11px]">
                    Photos are authenticated and watermarked on the server before serving to verified students.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
