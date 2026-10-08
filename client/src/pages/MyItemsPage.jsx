import React, { useState } from 'react';
import TagCard from '../components/ui/TagCard.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useMyItems } from '../hooks/useMyItems.js';
import { Plus, FolderOpen } from 'lucide-react';

export default function MyItemsPage() {
  const { items: myItems, isLoading, isError } = useMyItems();
  const [filter, setFilter] = useState('all');

  const displayed = filter === 'all' ? myItems : myItems.filter((i) => i.status === filter);

  return (
    <div className="font-sans">

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
    </div>
  );
}
