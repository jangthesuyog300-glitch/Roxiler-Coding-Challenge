import React, { useState, useMemo } from 'react';

const Table = ({ columns, data, emptyMessage = 'No data available' }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});

  // Trigger sorting
  const handleSort = (key, sortable) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Update column filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Process data (Filter -> Sort)
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Filter
    Object.keys(filters).forEach(key => {
      const filterVal = filters[key]?.toLowerCase();
      if (filterVal) {
        result = result.filter(row => {
          const cellVal = row[key];
          if (cellVal === null || cellVal === undefined) return false;
          return String(cellVal).toLowerCase().includes(filterVal);
        });
      }
    });

    // 2. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle nested objects or formatting
        if (typeof aVal === 'object' && aVal !== null && aVal.name) aVal = aVal.name;
        if (typeof bVal === 'object' && bVal !== null && bVal.name) bVal = bVal.name;

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return sortConfig.direction === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        }
      });
    }

    return result;
  }, [data, sortConfig, filters]);

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th 
                key={col.key} 
                onClick={() => handleSort(col.key, col.sortable)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                  <span>{col.label}</span>
                  {col.sortable && (
                    <span style={{ fontSize: '0.75rem', opacity: sortConfig.key === col.key ? 1 : 0.3 }}>
                      {sortConfig.key === col.key 
                        ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') 
                        : ' ⇅'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
          
          {/* Filters Row */}
          {columns.some(c => c.filterable) && (
            <tr style={{ background: 'rgba(0, 0, 0, 0.1)' }}>
              {columns.map(col => (
                <td key={`filter-${col.key}`} style={{ padding: '0.5rem 1rem' }}>
                  {col.filterable ? (
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Filter...`}
                      value={filters[col.key] || ''}
                      onChange={(e) => handleFilterChange(col.key, e.target.value)}
                      style={{ 
                        padding: '0.375rem 0.75rem', 
                        fontSize: '0.8rem', 
                        width: '100%',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {processedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            processedData.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map(col => (
                  <td key={`${row.id || idx}-${col.key}`}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
