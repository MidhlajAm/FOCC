import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { PAGE_SIZE } from '../config';
import MemberCard from '../components/MemberCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

const BRANCHES = ['all', 'CSE', 'IT', 'ECE', 'MECH'];
const YEARS = ['all', '1', '2', '3', '4'];

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState('all');
  const [year, setYear] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get('/users')
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let rows = members;
    if (branch !== 'all') rows = rows.filter((m) => m.branch === branch);
    if (year !== 'all') rows = rows.filter((m) => m.year === Number(year));
    if (query) {
      const needle = query.toLowerCase();
      rows = rows.filter((m) => m.name.toLowerCase().includes(needle));
    }
    return rows;
  }, [members, branch, query]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function reset() {
    setBranch('all');
    setYear('all');
    setQuery('');
  }

  return (
    <div className="container page">
      <div className="kicker">Directory</div>
      <h1>Members</h1>
      <p className="muted">
        {filtered.length} members across every branch. Anyone listed here is happy to
        review your first pull request.
      </p>

      <div className="row between" style={{ margin: '24px 0 18px' }}>
        <div className="row">
          {BRANCHES.map((b) => (
            <button
              key={b}
              className={`tag ${branch === b ? 'on' : ''}`}
              onClick={() => setBranch(b)}
            >
              {b}
            </button>
          ))}
          <select value={year} onChange={(e) => setYear(e.target.value)} style={{ width: 'auto' }}>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y === 'all' ? 'all years' : `year ${y}`}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <SearchBar value={query} onChange={setQuery} placeholder="Search members" />
          <button className="btn btn-sm btn-ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {loading && <Loader label="Loading directory" />}

      {!loading && filtered.length === 0 && (
        <EmptyState title="Nobody matches that filter" hint="Reset and try a wider search." />
      )}

      <div className="grid grid-3">
        {pageRows.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      <Pagination total={filtered.length} pageSize={PAGE_SIZE} page={page} onChange={setPage} />
    </div>
  );
}
