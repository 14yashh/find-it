import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Modal from '../components/ui/Modal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAdminItems } from '../hooks/useAdminItems.js';
import { CATEGORY_OPTIONS } from '../lib/constants.js';
import {
  Package,
  Search,
  Trash2,
  ExternalLink,
  Edit3,
  Calendar,
  MapPin,
  Tag,
  AlertTriangle,
} from 'lucide-react';

export default function AdminItemsPage({ onLogout }) {
  const { allItems, deleteItem, isLoading, isError } = useAdminItems();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const filteredItems = allItems.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchTag = item.tagNumber?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchPoster = item.postedBy?.name?.toLowerCase().includes(q);
      if (!matchTitle && !matchTag && !matchLoc && !matchPoster) return false;
    }
    return true;
  });

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete._id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
        {/* Filters and search docket */}
        <div className="bg-paper border-2 border-ink hard-shadow-4 p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search tag number, title, location, poster..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="w-full md:w-44">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'lost', label: 'Type: Lost' },
                  { value: 'found', label: 'Type: Found' },
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={CATEGORY_OPTIONS}
              />
            </div>
            <div className="w-full md:w-44">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'open', label: 'Status: Open' },
                  { value: 'claim_pending', label: 'Claim Pending' },
                  { value: 'returned', label: 'Returned' },
                  { value: 'expired', label: 'Expired' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-meta text-ink-muted border-t border-ink/10 pt-2">
            <span>
              RECORD COUNT: <strong className="text-ink">{filteredItems.length}</strong> ENTRIES FOUND
            </span>
            <span>CLASSIFICATION: AUDITED REPOSITORY</span>
          </div>
        </div>

        {/* Ledger Table */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No Items Found in Ledger"
            message="No records matched your search filters. Try widening search parameters or clearing filters."
            icon={Package}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                Reset All Filters
              </Button>
            }
          />
        ) : (
          <div className="bg-paper border-2 border-ink hard-shadow-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-manila border-b-2 border-ink font-meta text-xs uppercase tracking-wider text-ink select-none">
                    <th className="p-3 border-r border-ink">Tag & Type</th>
                    <th className="p-3 border-r border-ink">Title & Description</th>
                    <th className="p-3 border-r border-ink">Category & Location</th>
                    <th className="p-3 border-r border-ink">Recorded By</th>
                    <th className="p-3 border-r border-ink">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink text-xs font-meta">
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="hover:bg-manila/30 transition-colors">
                      {/* Tag & Type */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="font-bold text-ink block">{item.tagNumber}</span>
                        <span
                          className={`inline-block px-1.5 py-0.5 border border-ink text-[10px] font-bold uppercase mt-1 ${
                            item.type === 'found'
                              ? 'bg-stamp-found text-white'
                              : 'bg-stamp-lost text-white'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="p-3 border-r border-ink align-top max-w-xs">
                        <Link
                          to={`/items/${item._id}`}
                          className="font-heading font-bold text-sm text-ink hover:underline block truncate"
                        >
                          {item.title}
                        </Link>
                        <p className="text-ink-muted text-xs line-clamp-2 mt-0.5 font-sans">
                          {item.description}
                        </p>
                      </td>

                      {/* Category & Location */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <div className="flex items-center gap-1 text-ink font-bold capitalize">
                          <Tag className="w-3.5 h-3.5 text-ink-muted" />
                          <span>{item.category.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-ink-muted text-[11px] mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{item.location}</span>
                        </div>
                      </td>

                      {/* Recorded By */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="font-bold text-ink block">{item.postedBy?.name || 'Unknown'}</span>
                        <span className="text-ink-muted text-[11px] block">{item.postedBy?.department || 'Campus'}</span>
                        <span className="text-ink-faint text-[10px] block mt-0.5">
                          {new Date(item.dateOccurred).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Status Stamp */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <Stamp status={item.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="p-3 align-top text-right whitespace-nowrap space-x-1">
                        <Link to={`/items/${item._id}`}>
                          <button
                            type="button"
                            className="p-1.5 border border-ink bg-paper text-ink hover:bg-manila interactive-hard"
                            title="View Full Item Record"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <Link to={`/items/${item._id}/edit`}>
                          <button
                            type="button"
                            className="p-1.5 border border-ink bg-paper text-ink hover:bg-manila interactive-hard"
                            title="Edit Item Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 border border-ink bg-paper text-stamp-rejected hover:bg-stamp-rejected hover:text-white interactive-hard"
                          title="Purge Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="EXPUNGE PROPERTY RECORD // CONFIRMATION"
        >
          {itemToDelete && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 border-2 border-stamp-rejected">
                <AlertTriangle className="w-5 h-5 text-stamp-rejected shrink-0 mt-0.5" />
                <div className="font-meta text-xs text-ink space-y-1">
                  <span className="font-bold text-stamp-rejected block uppercase tracking-wider">
                    Irreversible Ledger Deletion
                  </span>
                  <p>
                    You are expunging item record <strong>{itemToDelete.tagNumber}</strong> ({itemToDelete.title}). This will permanently remove it from campus search indices and archive records.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={confirmDelete}
                >
                  Confirm Expunge
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
  );
}
