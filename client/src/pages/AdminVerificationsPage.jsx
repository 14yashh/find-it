import React, { useState } from 'react';
import Stamp from '../components/ui/Stamp.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useAdminUsers } from '../hooks/useAdminUsers.js';
import {
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function AdminVerificationsPage() {
  const { users, filter, setFilter, verifyUser, isLoading, isError, error, refetch } = useAdminUsers();

  const studentUsers = users.filter((u) => u.role !== 'admin');
  const [selectedId, setSelectedId] = useState(null);
  const selectedUser = studentUsers.find((u) => u._id === selectedId) || studentUsers[0] || null;
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const handleApprove = (u) => {
    verifyUser(u._id, 'approve');
  };

  const handleOpenReject = (u) => {
    setSelectedId(u._id);
    setRejectReason('');
    setRejectError('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectReason.trim() || rejectReason.trim().length < 5) {
      setRejectError('A specific reason (minimum 5 characters) is required to reject a student.');
      return;
    }

    if (selectedUser) {
      verifyUser(selectedUser._id, 'reject', rejectReason);
    }
    setRejectModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
        {/* Filter bar */}
        <div className="bg-paper border-2 border-ink p-3 hard-shadow-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-meta text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase text-ink">FILTER QUEUE:</span>
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilter(st)}
                className={`px-2 py-1 uppercase font-bold border border-ink transition-none ${
                  filter === st ? 'bg-ink text-paper' : 'bg-paper hover:bg-manila text-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="font-bold text-ink">
            {users.length} RECORDS IN ACTIVE VIEW
          </div>
        </div>

        {/* Two Pane Layout: Left List, Right Inspection Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table/List (7 cols) */}
          <div className="lg:col-span-7 bg-paper border-2 border-ink hard-shadow-4 p-4">
            <div className="border-b-2 border-ink pb-3 mb-3 flex items-center justify-between font-meta text-xs font-bold uppercase text-ink">
              <span>Student Applicant Dossiers</span>
              <span className="text-ink-muted">CLICK TO INSPECT</span>
            </div>

            <div className="space-y-3">
              {isLoading && (
                <p className="font-meta text-xs text-ink-muted text-center py-10">Loading records…</p>
              )}
              {!isLoading && isError && (
                <div className="text-center py-10 space-y-3">
                  <p className="font-meta text-xs text-stamp-rejected font-bold">
                    Failed to load: {error?.message || 'Unknown error'}
                  </p>
                  <button
                    type="button"
                    onClick={refetch}
                    className="px-3 py-1 border-2 border-ink bg-paper font-meta text-xs font-bold hover:bg-manila"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!isLoading && !isError && studentUsers.length === 0 && (
                <p className="font-meta text-xs text-ink-muted text-center py-10">
                  No records match the current filter.
                </p>
              )}
              {!isLoading && !isError && studentUsers.map((u) => {
                const isSelected = selectedUser?._id === u._id;
                return (
                  <div
                    key={u._id}
                    onClick={() => setSelectedId(u._id)}
                    className={`p-3.5 border-2 border-ink cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-manila hard-shadow-4 translate-x-1'
                        : 'bg-paper-light hover:bg-manila/50 hard-shadow-2'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-ink">
                            {u.name}
                          </h3>
                          <span className="font-meta text-[11px] text-ink-muted">
                            ({u.department} // {u.year})
                          </span>
                        </div>
                        <p className="font-meta text-xs text-ink mt-0.5">{u.email}</p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <Stamp type={u.verificationStatus} size="sm" rotate={false} />
                        {u.hasDocument && (
                          <span className="font-meta text-[10px] bg-paper px-1 border border-ink font-bold">
                            HAS DOC [x]
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Inspection Card (5 cols) */}
          <aside className="lg:col-span-5 bg-paper border-2 border-ink hard-shadow-6 p-6 relative">
            <Tape position="top-right" />
            <div className="absolute top-4 left-4 eyelet" />

            {selectedUser ? (
              <div className="space-y-5">
                <div className="border-b-2 border-ink pb-3">
                  <span className="font-meta text-[10px] bg-manila px-1.5 py-0.5 border border-ink font-bold uppercase">
                    INSPECTION DOCKET // #{selectedUser._id.slice(-6).toUpperCase()}
                  </span>
                  <h2 className="font-heading text-xl font-bold uppercase text-ink mt-2">
                    {selectedUser.name}
                  </h2>
                  <p className="font-meta text-xs text-ink-muted">{selectedUser.email}</p>
                </div>

                {/* Particulars Manifest */}
                <div className="bg-paper-light border border-ink p-3 space-y-1.5 font-meta text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Department:</span>
                    <span className="font-bold text-ink">{selectedUser.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Academic Year:</span>
                    <span className="font-bold text-ink">{selectedUser.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Contact Phone:</span>
                    <span className="font-bold text-ink">{selectedUser.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Status:</span>
                    <span className="font-bold uppercase text-ink">
                      {selectedUser.verificationStatus}
                    </span>
                  </div>
                </div>

                {/* Document Plate & Roll Number Inspection */}
                <div className="border-2 border-ink bg-manila/30 p-4 space-y-3">
                  <div className="bg-paper border-2 border-ink p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hard-shadow-2">
                    <div>
                      <span className="font-meta text-[10px] text-ink-muted uppercase font-bold block">
                        STUDENT ROLL NUMBER
                      </span>
                      <span className="font-mono text-2xl font-black text-ink tracking-widest block">
                        {selectedUser.rollNumber || '—'}
                      </span>
                    </div>
                    <div className="font-meta text-xs text-ink-muted sm:text-right max-w-[210px] leading-snug">
                      Compare the name and roll number with the ID photo
                    </div>
                  </div>

                  <div className="text-center space-y-2 pt-2">
                    <FileText className="w-10 h-10 text-ink mx-auto stroke-[1.5]" />
                    <span className="block font-meta text-xs font-bold uppercase text-ink">
                      Student ID Document Plate
                    </span>
                    <p className="font-meta text-[11px] text-ink-muted">
                      Official document submitted during enrollment verification.
                    </p>
                    <div>
                      <a
                        href={`/api/admin/users/${selectedUser._id}/document`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-paper px-3 py-1.5 border-2 border-ink hard-shadow-2 font-meta text-xs font-bold hover:bg-manila transition-colors text-ink"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Verification Document</span>
                      </a>
                    </div>
                  </div>
                </div>

                {selectedUser.rejectionReason && (
                  <div className="bg-stamp-rejected/10 border-2 border-stamp-rejected p-3 font-sans text-xs">
                    <span className="font-meta text-[10px] font-bold text-stamp-rejected uppercase block mb-1">
                      Recorded Rejection Reason:
                    </span>
                    <p className="text-ink font-semibold">"{selectedUser.rejectionReason}"</p>
                  </div>
                )}

                {/* Actions strictly labelled per prompt:
                    "Verification actions are labelled 'Approve student' and 'Reject' (reason required)." */}
                <div className="pt-2 border-t-2 border-ink space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleApprove(selectedUser)}
                      disabled={selectedUser.verificationStatus === 'approved'}
                      className="w-full flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve student</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={() => handleOpenReject(selectedUser)}
                      disabled={selectedUser.verificationStatus === 'rejected'}
                      className="w-full flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-meta text-xs text-ink-muted text-center py-10">
                Select a student record from the left docket to inspect.
              </p>
            )}
          </aside>
        </div>

        {/* REJECT MODAL WITH REQUIRED REASON */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Student Registration"
        subtitle={`DOCKET // ${selectedUser?.name}`}
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <p className="font-sans text-sm text-ink leading-relaxed">
            Specify the official justification for credential rejection. This explanation will be presented to the student on their verification status docket.
          </p>

          <Textarea
            label="Rejection Reason"
            id="reject-reason"
            required
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            error={rejectError}
            placeholder="e.g. Document photo is blurred or expired. Institutional matriculation seal is not visible."
            hint="Minimum 5 characters required."
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setRejectModalOpen(false)}
              className="bg-paper"
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="md">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
