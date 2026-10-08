import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import TagCard from '../components/ui/TagCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useItems } from '../hooks/useItems.js';
import { Search, SlidersHorizontal, RotateCcw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrowsePage({ user }) {
  const { items, filters, setFilters, total } = useItems();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'id_cards', label: 'ID cards' },
    { value: 'bags', label: 'Bags' },
    { value: 'keys', label: 'Keys' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'other', label: 'Other' },
  ];

  const handleTypeChange = (typeVal) => {
    setFilters((prev) => ({ ...prev, type: typeVal }));
  };

  const handleCategoryChange = (catVal) => {
    setFilters((prev) => ({ ...prev, category: catVal }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, q: e.target.value }));
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      q: '',
      status: 'open,claim_pending',
      sort: 'newest',
    });
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      <Navbar variant="student" user={user} />

      {/* SUB-HEADER / BANNER */}
      <section className="border-b-2 border-ink bg-manila/40">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-ink text-paper font-meta text-xs px-2 py-0.5 uppercase tracking-wider font-bold">
                SECTION 04
              </span>
              <span className="font-meta text-xs text-ink-muted uppercase">
                ARCHIVAL INVENTORY VAULT // REPOSITORY DRAWER 12-A
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight uppercase">
              The Drawer // Physical Repository Index
            </h1>
            <p className="font-sans text-sm md:text-base text-ink-muted mt-1">
              Active campus lost & found records cataloged in the physical central register.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Total custody ledger card */}
            <div className="border-2 border-ink bg-paper p-3 hard-shadow-4 text-center min-w-[130px] rotate-1">
              <div className="font-meta text-[10px] uppercase text-ink-muted font-bold tracking-wider">
                TOTAL CUSTODY LOG
              </div>
              <div className="font-heading text-2xl font-extrabold text-primary leading-tight mt-0.5">
                {total} ENTRIES
              </div>
              <div className="font-meta text-[10px] text-ink-faint border-t border-dashed border-ink/40 pt-1 mt-1 font-bold">
                CURRENT REGISTER
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              to="/items/new"
              className="hidden sm:flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Report Item</span>
            </Button>
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: FILTERS / INDEX DRAWER CONTROLS (3 cols) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 space-y-6">
            <div className="border-2 border-ink bg-manila p-5 hard-shadow-4 relative">
              <Tape position="top-right" />

              {/* Docket Header */}
              <div className="border-b-2 border-ink pb-2 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-ink" />
                  <h2 className="font-heading text-base uppercase font-bold tracking-tight">
                    Index Filters
                  </h2>
                </div>
                <span className="font-meta text-[10px] bg-paper px-1.5 border border-ink font-bold">
                  FORM 109-F
                </span>
              </div>

              {/* Filter Form */}
              <div className="space-y-5">
                {/* 1. Search Query */}
                <div>
                  <label className="block font-meta text-xs font-bold uppercase mb-1 tracking-wider text-ink">
                    Keyword Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.q}
                      onChange={handleSearchChange}
                      placeholder="Title, description, location..."
                      className="w-full bg-paper border-2 border-ink font-meta text-xs text-ink placeholder:text-ink-faint p-2 hard-shadow-2 focus:outline-none focus:bg-white"
                    />
                    <Search className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Type Filter (All / Lost / Found) */}
                <div>
                  <label className="block font-meta text-xs font-bold uppercase mb-1 tracking-wider text-ink">
                    Custodial Type
                  </label>
                  <div className="grid grid-cols-3 border-2 border-ink bg-paper p-0.5 hard-shadow-2 font-meta text-xs">
                    {['all', 'found', 'lost'].map((typeKey) => (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => handleTypeChange(typeKey)}
                        className={`py-1 text-center font-bold uppercase transition-none ${
                          filters.type === typeKey
                            ? 'bg-ink text-paper'
                            : 'text-ink hover:bg-manila'
                        }`}
                      >
                        {typeKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Category Single-Select (Rule 4 requirement: Single-select) */}
                <div className="border-t border-b border-ink/40 py-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-meta text-xs font-bold uppercase tracking-wider text-ink">
                      Category Registry
                    </label>
                    <span className="font-meta text-[10px] text-ink-muted">SINGLE-SELECT</span>
                  </div>
                  <div className="space-y-1 font-meta text-xs">
                    {categories.map((cat) => (
                      <label
                        key={cat.value}
                        className={`flex items-center justify-between px-2 py-1.5 border border-transparent cursor-pointer hover:bg-paper/80 transition-colors ${
                          filters.category === cat.value
                            ? 'bg-paper border-ink font-bold hard-shadow-2'
                            : 'text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="category-radio"
                            value={cat.value}
                            checked={filters.category === cat.value}
                            onChange={() => handleCategoryChange(cat.value)}
                            className="w-3.5 h-3.5 accent-ink"
                          />
                          <span>{cat.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-ink bg-paper text-ink font-meta text-xs font-bold uppercase hover:bg-white interactive-hard hard-shadow-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN COLUMN: ITEM TAGS GRID (9 cols) */}
          {/* Note: "Browse becomes a one-column list" at mobile width 390 via grid-cols-1 */}
          <section className="lg:col-span-9 space-y-6">
            {/* Control Bar above items */}
            <div className="bg-paper border-2 border-ink p-3 hard-shadow-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-meta text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink uppercase">FILING RESULTS:</span>
                <span className="bg-manila border border-ink px-2 py-0.5 font-bold">
                  {items.length} ENTRIES DISPLAYED
                </span>
                {filters.category !== 'all' && (
                  <span className="bg-paper-light border border-ink px-1.5 py-0.5 text-ink-muted">
                    {filters.category}
                  </span>
                )}
                {filters.type !== 'all' && (
                  <span className="bg-paper-light border border-ink px-1.5 py-0.5 text-ink-muted uppercase">
                    {filters.type}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-ink-muted uppercase">SORT:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                  className="bg-paper-light border border-ink px-2 py-1 font-meta text-xs text-ink font-bold cursor-pointer"
                >
                  <option value="newest">Newest Intake First</option>
                  <option value="relevance">Highest Relevance</option>
                </select>
              </div>
            </div>

            {/* Tag Cards Grid */}
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => (
                  <TagCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Registry Records Found"
                message="No items match your active keyword, category, or custodial filter parameters."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
