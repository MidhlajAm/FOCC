import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { PAGE_SIZE } from '../config';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

const SORTS = [
  { key: 'stars', label: 'most starred' },
  { key: 'upvotes', label: 'most upvoted' },
  { key: 'newest', label: 'newest' },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [sort, setSort] = useState('stars');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get('/projects')
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => {
    const all = projects.flatMap((p) => p.tags);
    return [...new Set(all)].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    let rows = projects;

    if (query) {
      const needle = query.toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(needle));
    }
    if (activeTag) {
      const needle = activeTag.toLowerCase();
      rows = rows.filter((p) => p.tags.some((t) => t.toLowerCase().includes(needle)));
    }
    return rows;
  }, [projects, query, activeTag]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    if (sort === 'newest') {
      rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      rows.sort((a, b) => a[sort] > b[sort]);
    }
    return rows;
  }, [filtered, sort]);

  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setQuery('');
    setActiveTag(null);
    setSort('stars');
  }

  return (
    <div className="container page">
      <div className="kicker">Built by members</div>
      <h1>Projects</h1>
      <p className="muted" style={{ maxWidth: 580 }}>
        Everything here is club maintained and openly licensed. Fork anything, open an
        issue on anything, take over anything that says archived.
      </p>

      <div className="row between" style={{ margin: '26px 0 14px' }}>
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="Search by name or tech"
        />

        <div className="row">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ width: 'auto' }}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <button className="btn btn-sm btn-ghost" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      <div className="row" style={{ gap: 6, marginBottom: 20 }}>
        {tags.map((tag) => (
          <button
            key={tag}
            className={`tag ${activeTag === tag ? 'on' : ''}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {loading && <Loader label="Loading projects" />}

      {!loading && sorted.length === 0 && (
        <EmptyState title="No projects match that" hint="Clear the filters and try again." />
      )}

      <div className="grid grid-3">
        {pageRows.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Pagination total={sorted.length} pageSize={PAGE_SIZE} page={page} onChange={setPage} />
    </div>
  );
}
