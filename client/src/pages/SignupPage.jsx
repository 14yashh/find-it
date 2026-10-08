import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import FileDrop from '../components/ui/FileDrop.jsx';
import TicketStub from '../components/ui/TicketStub.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Tape from '../components/ui/Tape.jsx';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SignupPage({ onSignupSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 | 2 | 3 (success)

  // Form State matching backend exactly:
  // name, email, password, department, year, phone, document
  const [formData, setFormData] = useState({
    name: 'Jordan Taylor',
    email: 'j.taylor@campus.edu',
    password: 'password123',
    department: 'Computer Science',
    year: '3rd Year',
    phone: '',
  });

  const [documentFiles, setDocumentFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Campus email is required.';
    else if (!formData.email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (!formData.department) newErrors.department = 'Department is required.';
    if (!formData.year) newErrors.year = 'Academic year is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (documentFiles.length === 0) {
      setErrors({ document: 'Please attach your student ID or fee receipt document.' });
      return;
    }

    // Static success state
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (onSignupSuccess) {
      onSignupSuccess({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        year: formData.year,
        role: 'student',
        verificationStatus: 'pending',
      });
    }
  };

  const departmentOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Fine Arts & Design', label: 'Fine Arts & Design' },
    { value: 'Sciences & Humanities', label: 'Sciences & Humanities' },
    { value: 'Other Department', label: 'Other Department' },
  ];

  const yearOptions = [
    { value: '1st Year', label: '1st Year (Freshman)' },
    { value: '2nd Year', label: '2nd Year (Sophomore)' },
    { value: '3rd Year', label: '3rd Year (Junior)' },
    { value: '4th Year', label: '4th Year (Senior)' },
    { value: 'Graduate / Post-Grad', label: 'Graduate / Post-Grad' },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans justify-between">
      <Navbar variant="public" />

      <main className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12 flex-1 flex flex-col items-center justify-center">
        {/* Status / Filing Ledger Meta Header */}
        <div className="w-full max-w-xl mb-6 flex items-center justify-between border-b-2 border-ink pb-2 font-meta text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-manila border border-ink uppercase font-bold text-ink">
              INTAKE DESK
            </span>
            <span className="text-ink-muted uppercase tracking-wider hidden sm:inline">
              SECTION: STUDENT VERIFICATION
            </span>
          </div>
          <div className="flex items-center gap-1 font-bold text-ink">
            <span>STAGE {step === 3 ? '02' : `0${step}`}</span>
            <span>/</span>
            <span>02</span>
          </div>
        </div>

        {/* STEP 1: BASIC PARTICULARS */}
        {step === 1 && (
          <section className="w-full max-w-xl bg-paper border-2 border-ink hard-shadow-6 relative p-6 sm:p-8">
            <Tape position="top-left" />
            <div className="absolute top-4 right-4 eyelet" />

            {/* Header Box */}
            <div className="border-b-2 border-dashed border-ink pb-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-meta text-xs tracking-widest text-ink-muted uppercase font-bold">
                    FORM 101-STU // VERIFIED ACCESS
                  </span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight uppercase mt-1">
                    Student Intake Registry
                  </h1>
                </div>
                <div className="border-2 border-stamp-found text-stamp-found px-2 py-1 rotate-2 font-meta text-xs font-bold uppercase shrink-0">
                  PAGE 1 OF 2
                </div>
              </div>
              <p className="font-sans text-sm text-ink-muted mt-2 border-l-2 border-primary-container pl-3 py-0.5 bg-manila/30">
                Establish your campus file. You will attach your institutional student ID or fee receipt on page 2.
              </p>
            </div>

            {/* Step 1 Form */}
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <Input
                label="Full Legal / Campus Name"
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={errors.name}
                placeholder="e.g. Jordan Taylor"
                hint="As listed on official roster."
              />

              <Input
                label="Campus Email Address"
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={errors.email}
                placeholder="username@institution.edu"
                hint="Institutional email required for identity checks."
              />

              <Input
                label="Security Phrase / Password"
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                error={errors.password}
                placeholder="Enter password..."
                hint="Minimum 8 characters."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  id="department"
                  required
                  value={formData.department}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  options={departmentOptions}
                  error={errors.department}
                />

                <Select
                  label="Year of Study"
                  id="year"
                  required
                  value={formData.year}
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                  options={yearOptions}
                  error={errors.year}
                />
              </div>

              <Input
                label="Contact Phone Number (Optional)"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                hint="Only disclosed to owners upon verified claim approval."
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <span>Proceed to Page 2: Attach ID</span>
                  <ArrowRight className="w-4 h-4 font-bold" />
                </Button>
              </div>

              <div className="pt-2 text-center border-t border-ink/40 mt-4">
                <span className="font-sans text-sm text-ink">
                  Already registered?{' '}
                  <Link
                    to="/login"
                    className="font-meta text-xs font-bold uppercase underline underline-offset-4 decoration-2 decoration-ink hover:bg-manila px-1 ml-1"
                  >
                    Log in
                  </Link>
                </span>
              </div>
            </form>
          </section>
        )}

        {/* STEP 2: ATTACH PROOF OF ENROLMENT */}
        {step === 2 && (
          <section className="w-full max-w-xl bg-paper border-2 border-ink hard-shadow-6 relative p-6 sm:p-8">
            <Tape position="top-right" />
            <div className="absolute top-4 right-4 eyelet" />

            {/* Header Box */}
            <div className="border-b-2 border-dashed border-ink pb-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-meta text-xs tracking-widest text-ink-muted uppercase font-bold">
                    FORM 104-B // ID VERIFICATION SLIP
                  </span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight uppercase mt-1">
                    Attach Proof of Enrolment
                  </h1>
                </div>
                <div className="border-2 border-primary-container text-primary-container px-2 py-1 rotate-2 font-meta text-xs font-bold uppercase shrink-0">
                  PAGE 2 OF 2
                </div>
              </div>
              <p className="font-sans text-sm text-ink-muted mt-2 border-l-2 border-primary-container pl-3 py-0.5 bg-manila/30">
                Supply a valid student card, matriculation badge, or tuition fee receipt for administrative clearance.
              </p>
            </div>

            {/* Particulars Review Stub */}
            <div className="bg-manila/40 border border-ink p-3 mb-5 font-meta text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider block text-ink">
                Review Intake Particulars:
              </span>
              <div className="grid grid-cols-2 gap-2 text-ink">
                <div>
                  <span className="text-ink-muted">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="text-ink-muted">Email:</span> {formData.email}
                </div>
                <div>
                  <span className="text-ink-muted">Dept:</span> {formData.department}
                </div>
                <div>
                  <span className="text-ink-muted">Year:</span> {formData.year}
                </div>
              </div>
            </div>

            {/* Step 2 Form */}
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <FileDrop
                label="Student ID or Fee Receipt Document"
                hint="JPG, PNG, or WebP (Max file size: 5 MB)"
                required
                files={documentFiles}
                onChange={(files) => {
                  setDocumentFiles(files);
                  setErrors((prev) => ({ ...prev, document: null }));
                }}
                onRemove={() => setDocumentFiles([])}
                error={errors.document}
              />

              <div className="flex items-center gap-2 font-meta text-xs text-ink-muted border-t border-ink/20 pt-3">
                <ShieldCheck className="w-4 h-4 text-stamp-found shrink-0" />
                <span>
                  Admin documents are securely streamed and never shared publicly.
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 sm:w-1/3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <span>Submit Registration Slip</span>
                  <ArrowRight className="w-4 h-4 font-bold" />
                </Button>
              </div>
            </form>
          </section>
        )}

        {/* STEP 3: SUCCESS STATE CONFIRMATION */}
        {step === 3 && (
          <section className="w-full max-w-xl bg-paper border-2 border-ink hard-shadow-6 relative p-6 sm:p-10 text-center">
            <Tape position="top-center" />

            <div className="w-16 h-16 bg-manila border-2 border-ink mx-auto mb-4 flex items-center justify-center hard-shadow-2">
              <CheckCircle2 className="w-8 h-8 text-stamp-found" />
            </div>

            <div className="mb-4">
              <Stamp type="pending" size="md" rotate={true} />
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink uppercase tracking-tight">
              Registration Slip Docket Submitted
            </h1>

            <p className="font-sans text-base text-ink leading-relaxed mt-2 max-w-md mx-auto">
              Your account has been recorded. Your student ID has been forwarded to the campus admin desk for verification review.
            </p>

            <TicketStub className="bg-manila/50 my-6 text-left font-meta text-xs space-y-1.5">
              <div className="flex justify-between border-b border-ink/30 pb-1 font-bold">
                <span>DOCKET #REG-2026-X</span>
                <span>STATUS: IN QUEUE</span>
              </div>
              <p className="text-ink-muted">
                Applicant: <strong>{formData.name}</strong> ({formData.email})
              </p>
              <p className="text-ink-muted">
                Department: {formData.department} // {formData.year}
              </p>
              <p className="text-ink-muted">
                Admin review typically completes during normal campus office hours.
              </p>
            </TicketStub>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/verification')}
                className="w-full sm:w-auto"
              >
                Check Status Docket
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/browse')}
                className="w-full sm:w-auto bg-manila"
              >
                Browse Public Ledger
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
