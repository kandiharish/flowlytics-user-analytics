import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, MousePointerClick, FileText, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSessions } from '../services/api';
import { useApiFetch } from '../hooks/useApiFetch';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import MetricCard from '../components/MetricCard';

const SessionsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const fetchFn = useCallback(() => getSessions(page, limit), [page, limit]);
  const { data: response, loading, error } = useApiFetch(fetchFn, true, [fetchFn]);

  const sessions = response?.sessions || [];
  
  // Calculate aggregate metrics over the current page as a sample (or you could fetch globals from another API)
  const metrics = useMemo(() => {
    if (!sessions.length) return { totalSessions: 0, totalEvents: 0, totalPageViews: 0, totalClicks: 0 };
    
    // In a real app, global metrics would come from a separate endpoint. 
    // Here we use the paginated data for the overview cards to show 'current page metrics'
    // or just show totals from the pagination metadata if provided.
    const totalSessions = response?.total || 0;
    const totalEvents = sessions.reduce((sum, s) => sum + s.eventCount, 0);
    const totalPageViews = sessions.reduce((sum, s) => sum + (s.pageViews || 0), 0);
    const totalClicks = sessions.reduce((sum, s) => sum + (s.clicks || 0), 0);

    return { totalSessions, totalEvents, totalPageViews, totalClicks };
  }, [sessions, response]);

  if (loading && !sessions.length) return <Loader message="Loading dashboard data..." />;
  if (error) return <ErrorAlert message="Failed to load dashboard data" />;

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Sessions (All Time)" 
            value={metrics.totalSessions} 
            icon={Users} 
            colorClass="bg-blue-100 text-blue-600" 
          />
          <MetricCard 
            title="Events (Current Page)" 
            value={metrics.totalEvents} 
            icon={Activity} 
            colorClass="bg-purple-100 text-purple-600" 
          />
          <MetricCard 
            title="Clicks (Current Page)" 
            value={metrics.totalClicks} 
            icon={MousePointerClick} 
            colorClass="bg-amber-100 text-amber-600" 
          />
          <MetricCard 
            title="Page Views (Current Page)" 
            value={metrics.totalPageViews} 
            icon={FileText} 
            colorClass="bg-emerald-100 text-emerald-600" 
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Sessions</h2>
        
        {/* Pagination Controls */}
        {response?.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium text-gray-600 px-2">
              Page {page} of {response.totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(response.totalPages, p + 1))}
              disabled={page === response.totalPages}
              className="p-2 rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      
      {!sessions || sessions.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <Users className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 font-medium">No sessions recorded yet.</p>
          <p className="text-sm text-gray-400 mt-1">Embed the tracker script to start collecting data.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader message="" />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Session ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Events</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">First Seen</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sessions.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-indigo-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 truncate max-w-[200px]" title={s.sessionId}>
                      {s.sessionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800" title="Total Events">
                        {s.eventCount}
                      </span>
                      <span className="text-xs text-emerald-600 font-medium" title="Page Views">{s.pageViews} PV</span>
                      <span className="text-xs text-amber-600 font-medium" title="Clicks">{s.clicks} CL</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {s.durationMs ? `${(s.durationMs / 1000).toFixed(1)}s` : '< 1s'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(s.firstEventAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/sessions/${s.sessionId}`} 
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors inline-flex items-center focus:opacity-100"
                      >
                        Journey <ArrowRight size={16} className="ml-1.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
