'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: string;
  type: 'receita' | 'despesa' | 'doacao';
  title: string;
  description: string;
  campaignId: string;
  timestamp: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/activity', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar atividades');
      }

      const data = await response.json();
      setActivities(data.activities);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'receita':
        return '🟢';
      case 'despesa':
        return '🔴';
      case 'doacao':
        return '🟦';
      default:
        return '⭕';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'receita':
        return 'border-l-green-500 bg-green-50';
      case 'despesa':
        return 'border-l-red-500 bg-red-50';
      case 'doacao':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-slate-500 bg-slate-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Carregando atividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500">Nenhuma atividade recente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`border-l-4 p-4 rounded-r-lg ${getActivityColor(activity.type)}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{getActivityIcon(activity.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate">{activity.title}</p>
              <p className="text-xs text-slate-600 truncate">{activity.description}</p>
              <p className="text-xs text-slate-500 mt-1">{new Date(activity.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
