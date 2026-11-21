/**
 * Advanced Search & Filters Hook
 * Fase 34: Advanced Search
 */

'use client';

import { useMemo, useState } from 'react';

export interface SearchFilters {
  query: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
  sortBy?: 'date' | 'amount' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export function useAdvancedSearch<T extends Record<string, any>>(
  items: T[],
  searchableFields: (keyof T)[] = []
) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const filteredResults = useMemo(() => {
    let results = [...items];

    // Text search
    if (filters.query && searchableFields.length > 0) {
      const query = filters.query.toLowerCase();
      results = results.filter((item) =>
        searchableFields.some(
          (field) =>
            String(item[field])
              .toLowerCase()
              .includes(query)
        )
      );
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      results = results.filter((item) => {
        const itemDate = new Date(item.created_at || item.date);
        if (filters.dateFrom && itemDate < filters.dateFrom) return false;
        if (filters.dateTo && itemDate > filters.dateTo) return false;
        return true;
      });
    }

    // Category filter
    if (filters.category) {
      results = results.filter((item) => item.category === filters.category);
    }

    // Status filter
    if (filters.status) {
      results = results.filter((item) => item.status === filters.status);
    }

    // Amount range filter
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      results = results.filter((item) => {
        const amount = item.amount || 0;
        if (filters.minAmount !== undefined && amount < filters.minAmount) return false;
        if (filters.maxAmount !== undefined && amount > filters.maxAmount) return false;
        return true;
      });
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((item) =>
        filters.tags?.some((tag) => (item.tags || []).includes(tag))
      );
    }

    // Sorting
    results.sort((a, b) => {
      let aVal = a[filters.sortBy || 'date'];
      let bVal = b[filters.sortBy || 'date'];

      if (filters.sortBy === 'date') {
        aVal = new Date(a.created_at || a.date).getTime();
        bVal = new Date(b.created_at || b.date).getTime();
      }

      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return results;
  }, [items, filters, searchableFields]);

  return {
    filters,
    setFilters,
    updateFilter: (key: keyof SearchFilters, value: any) =>
      setFilters((prev) => ({ ...prev, [key]: value })),
    clearFilters: () =>
      setFilters({
        query: '',
        sortBy: 'date',
        sortOrder: 'desc',
      }),
    results: filteredResults,
    resultCount: filteredResults.length,
  };
}

export function buildSearchQuery(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.query) parts.push(`"${filters.query}"`);
  if (filters.category) parts.push(`category:${filters.category}`);
  if (filters.status) parts.push(`status:${filters.status}`);
  if (filters.minAmount) parts.push(`amount:>=${filters.minAmount}`);
  if (filters.maxAmount) parts.push(`amount:<=${filters.maxAmount}`);
  if (filters.dateFrom)
    parts.push(`from:${filters.dateFrom.toISOString().split('T')[0]}`);
  if (filters.dateTo) parts.push(`to:${filters.dateTo.toISOString().split('T')[0]}`);
  if (filters.tags?.length) parts.push(`tags:[${filters.tags.join(',')}]`);

  return parts.join(' ');
}

export function parseSearchQuery(query: string): SearchFilters {
  const filters: SearchFilters = {
    query: '',
    tags: [],
  };

  const regex =
    /(?:(?<field>\w+):(?<value>[^\s]+)|(?<text>(?:[^"\s]|\\")+|"[^"]*"))/g;
  let match;

  while ((match = regex.exec(query)) !== null) {
    if (match.groups?.field) {
      const field = match.groups.field;
      const value = match.groups.value.replace(/['"]/g, '');

      switch (field) {
        case 'category':
          filters.category = value;
          break;
        case 'status':
          filters.status = value;
          break;
        case 'from':
          filters.dateFrom = new Date(value);
          break;
        case 'to':
          filters.dateTo = new Date(value);
          break;
        case 'amount':
          if (value.startsWith('>=')) {
            filters.minAmount = parseFloat(value.slice(2));
          } else if (value.startsWith('<=')) {
            filters.maxAmount = parseFloat(value.slice(2));
          }
          break;
        case 'tags':
          filters.tags = value.split(',');
          break;
      }
    } else if (match.groups?.text) {
      filters.query += (filters.query ? ' ' : '') + match.groups.text.replace(/^"|"$/g, '');
    }
  }

  return filters;
}
