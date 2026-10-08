import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useAdminUsers } from '../hooks/useAdminUsers.js';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export default function AdminUsersPage({ onLogout }) {
  const { allUsers, toggleSuspend } = useAdminUsers();

  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');

  const [suspendModalUser, setSuspendModalUser] = useState(null);

  const filteredUsers = allUsers.filter((user) => {
    if (verificationFilter !== 'all' && user.verificationStatus !== verificationFilter) {
      return false;
    }
    if (accountFilter === 'active' && user.isSuspended) return false;
    if (accountFilter === 'suspended' && !user.isSuspended) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = user.name?.toLowerCase().includes(q);
      const matchRoll = user.rollNumber?.toLowerCase().includes(q);
      const matchEmail = user.email?.toLowerCase().includes(q);
      const matchDept = user.department?.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchEmail && !matchDept) return false;
    }
    return true;
  });

  const handleConfirmToggleSuspend = () => {
    if (suspendModalUser && suspendModalUser.role !== 'admin') {
      toggleSuspend(suspendModalUser._id);
      setSuspendModalUser(null);
    }
  };

  return (
    <div className="space-y-6">
        {/* Filters and search docket */}
        <div className="bg-paper border-2 border-ink hard-shadow-4 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search student name, roll number, email, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="w-full sm:w-56">
              <Select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Verifications' },
                  { value: 'pending', label: 'Status: Pending' },
                  { value: 'approved', label: 'Status: Approved' },
                  { value: 'rejected', label: 'Status: Rejected' },
                ]}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Accounts' },
                  { value: 'active', label: 'Active Only' },
                  { value: 'suspended', label: 'Suspended Only' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-meta text-ink-muted border-t border-ink/10 pt-2">
            <span>
              TOTAL ROSTER: <strong className="text-ink">{filteredUsers.length}</strong> STUDENTS LISTED
            </span>
            <span>DIRECTORY ACCESS: STUDENT ROSTER</span>
          </div>
        </div>

        {/* Directory Table */}
        {filteredUsers.length === 0 ? (
          <EmptyState
            title="No Users Located"
            message="No student accounts match your filter criteria."
            icon={Users}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setVerificationFilter('all');
                  setAccountFilter('all');
                }}
              >
                Clear Filters
              </Button>
            }
          />
        ) : (
          <div className="bg-paper border-2 border-ink hard-shadow-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-manila border-b-2 border-ink font-meta text-xs uppercase tracking-wider text-ink select-none">
                    <th className="p-3 border-r border-ink">Student Name</th>
                    <th className="p-3 border-r border-ink">Roll Number</th>
                    <th className="p-3 border-r border-ink">Email</th>
                    <th className="p-3 border-r border-ink">Academic Dept & Year</th>
                    <th className="p-3 border-r border-ink">Verification Status</th>
                    <th className="p-3 border-r border-ink">Account State</th>
                    <th className="p-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink text-xs font-meta">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-manila/30 transition-colors">
                      {/* Student Name */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="font-bold text-ink block text-sm">{user.name}</span>
                        <span className="text-ink-faint text-[10px] block mt-0.5">
                          ID: {user._id}
                        </span>
                      </td>

                      {/* Roll Number */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="font-mono font-bold text-ink text-sm block">
                          {user.rollNumber || '—'}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="text-ink block font-mono">{user.email}</span>
                        {user.phone && (
                          <span className="text-ink-muted text-[11px] block mt-0.5">
                            {user.phone}
                          </span>
                        )}
                      </td>

                      {/* Academic Dept & Year */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="font-bold text-ink block">{user.department}</span>
                        <span className="text-ink-muted text-[11px] block">{user.year}</span>
                      </td>

                      {/* Verification Status */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <Stamp status={user.verificationStatus} size="sm" />
                      </td>

                      {/* Account State */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        {user.isSuspended ? (
                          <span className="inline-block px-2 py-0.5 border border-stamp-rejected bg-red-100 text-stamp-rejected font-bold uppercase text-[10px]">
                            SUSPENDED
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 border border-stamp-approved bg-green-100 text-stamp-approved font-bold uppercase text-[10px]">
                            ACTIVE
                          </span>
                        )}
                      </td>

                      {/* Moderation Actions */}
                      <td className="p-3 align-top text-right whitespace-nowrap space-x-2">
                        {user.verificationStatus === 'pending' && user.role !== 'admin' && (
                          <Link to="/admin/verifications">
                            <Button variant="secondary" size="sm" className="text-xs">
                              Audit ID
                            </Button>
                          </Link>
                        )}
                        {user.role === 'admin' ? (
                          <span className="font-meta text-[10px] font-bold text-ink-muted uppercase px-2 py-1 bg-paper border border-ink/30 inline-block">
                            Admin Account // Exempt
                          </span>
                        ) : (
                          <Button
                            variant={user.isSuspended ? 'secondary' : 'danger'}
                            size="sm"
                            onClick={() => setSuspendModalUser(user)}
                            className="text-xs"
                          >
                            {user.isSuspended ? 'Lift Suspension' : 'Suspend'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Suspend / Lift Suspension Modal */}
        <Modal
          isOpen={!!suspendModalUser}
          onClose={() => setSuspendModalUser(null)}
          title={
            suspendModalUser?.isSuspended
              ? 'LIFT ACCOUNT SUSPENSION'
              : 'ENACT DISCIPLINARY SUSPENSION'
          }
        >
          {suspendModalUser && (
            <div className="space-y-4 font-meta text-xs">
              <div className="p-3 bg-manila border border-ink space-y-1">
                <span className="font-bold text-ink block">
                  Student: {suspendModalUser.name} ({suspendModalUser.email})
                </span>
                <span className="text-ink-muted">
                  Department: {suspendModalUser.department} // {suspendModalUser.year}
                </span>
              </div>

              <p className="text-ink">
                {suspendModalUser.isSuspended
                  ? 'Re-enabling this account will restore immediate access to post items, file claims, and browse campus listings.'
                  : 'Suspending this account prevents the student from logging in, reporting items, or submitting claims across all campus departments.'}
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSuspendModalUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant={suspendModalUser.isSuspended ? 'primary' : 'danger'}
                  size="sm"
                  onClick={handleConfirmToggleSuspend}
                >
                  {suspendModalUser.isSuspended ? 'Restore Access' : 'Confirm Suspension'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
  );
}
