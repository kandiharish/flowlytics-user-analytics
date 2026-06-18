import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, MousePointerClick, FileText, ArrowRight } from 'lucide-react';
import { getSessions } from '../services/api';
import { useApiFetch } from '../hooks/useApiFetch';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import MetricCard from '../components/MetricCard';

const SessionsPage = () => {
  const { data: sessions, loading, error } = useApiFetch(getSessions, true, []);

  const metrics = useMemo(() => {
    if (!sessions) return { totalSessions: 0, totalEvents: 0, totalPageViews: 0, totalClicks: 0 };
    
    const totalSessions = sessions.length;
    const totalEvents = sessions.reduce((sum, s) => sum + s.eventCount, 0);
    // Approximation due to backend data constraint
    const totalPageViews = totalSessions;
    const totalClicks = Math.max(0, totalEvents - totalPageViews);

    return { totalSessions, totalEvents, totalPageViews, totalClicks };
  }, [sessions]);

  if (loading) return <Loader message="Loading dashboard data..." />;
  if (error) return <ErrorAlert message="Failed to load dashboard data" />;

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Sessions" 
            value={metrics.totalSessions} 
            icon={Users} 
            colorClass="bg-blue-100 text-blue-600" 
          />
          <MetricCard 
            title="Total Events" 
            value={metrics.totalEvents} 
            icon={Activity} 
            colorClass="bg-purple-100 text-purple-600" 
          />
          <MetricCard 
            title="Total Clicks" 
            value={metrics.totalClicks} 
            icon={MousePointerClick} 
            colorClass="bg-amber-100 text-amber-600" 
          />
          <MetricCard 
            title="Total Page Views" 
            value={metrics.totalPageViews} 
            icon={FileText} 
            colorClass="bg-emerald-100 text-emerald-600" 
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Sessions</h2>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {s.eventCount}
                      </span>
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
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors inline-flex items-center opacity-0 group-hover:opacity-100 focus:opacity-100"
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
