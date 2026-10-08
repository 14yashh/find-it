import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import TagCard from '../components/ui/TagCard.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useItems } from '../hooks/useItems.js';
import { Plus, FolderOpen } from 'lucide-react';

export default function MyItemsPage({ user }) {
  const { allItems, updateItem } = useItems();
  const [filter, setFilter] = useState('all');

  // Filter items owned by current user
  const myItems = allItems.filter(
    (item) => !item.postedBy || String(item.postedBy._id) === String(user?._id || '67039a518e19b33a102c9101')
  );

  const displayed = filter === 'all' ? myItems : myItems.filter((i) => i.status === filter);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      <Navbar variant="student" user={user} />

      <section className="bg-manila border-b-2 border-ink px-4 md:px-6 py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 font-meta text-xs">
              <span className="bg-ink text-paper px-2 py-0.5 uppercase font-bold">
                CUSTODIAL VAULT
              </span>
              <span className="text-ink-muted uppercase">PERSONAL PROPERTY LEDGER</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase text-ink tracking-tight">
              My Reported Items
            </h1>
            <p className="font-sans text-sm md:text-base text-ink-muted mt-0.5">
              Items you have filed into the central registry as lost property or found intake.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            to="/items/new"
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Item</span>
          </Button>
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        {/* Status filter pills */}
        <div className="mb-6 flex items-center gap-2 font-meta text-xs">
          <span className="font-bold uppercase text-ink mr-2">Filter Status:</span>
          {['all', 'open', 'claim_pending', 'returned'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1 border border-ink uppercase font-bold transition-none ${
                filter === st ? 'bg-ink text-paper' : 'bg-paper hover:bg-manila text-ink'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((item) => (
              <TagCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Items Filed Yet"
            message="You haven't logged any lost belongings or found articles matching this status."
            actionLabel="Report Your First Item"
            onAction={() => window.location.assign('/items/new')}
            icon={FolderOpen}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
