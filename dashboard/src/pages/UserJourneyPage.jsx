import React, { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, MousePointerClick, Clock, Globe } from 'lucide-react';
import { getSessionEvents } from '../services/api';
import { useApiFetch } from '../hooks/useApiFetch';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';

const UserJourneyPage = () => {
  const { sessionId } = useParams();
  
  const fetchFn = useCallback(() => getSessionEvents(sessionId), [sessionId]);
  const { data: events, loading, error } = useApiFetch(fetchFn, true, [fetchFn]);

  if (loading) return <Loader message="Loading journey..." />;
  if (error) return <ErrorAlert message="Failed to load user journey" />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <Link to="/" className="text-gray-500 hover:text-indigo-600 mb-2 flex items-center transition-colors text-sm font-medium w-fit">
            <ArrowLeft size={16} className="mr-1.5" /> Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold truncate text-gray-900 flex items-center gap-2">
            Session Journey
          </h2>
          <p className="text-sm text-gray-500 font-mono mt-1">{sessionId}</p>
        </div>
        
        {events && events.length > 0 && (
          <div className="flex gap-4 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Events</span>
                <span className="text-sm font-bold text-gray-900">{events.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {!events || events.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <Globe className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 font-medium">No events recorded for this session.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-indigo-200 ml-4 py-4 md:ml-8">
          {events.map((event, idx) => {
            const isClick = event.eventType === 'click';
            const Icon = isClick ? MousePointerClick : FileText;
            
            return (
              <div key={idx} className="mb-8 ml-6 md:ml-8 relative group">
                <span className={`absolute -left-[35px] md:-left-[43px] flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ring-4 ring-gray-50 transition-transform group-hover:scale-110 ${isClick ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'} -mt-1`}>
                  <Icon size={16} className={isClick ? '' : 'ml-0.5'} />
                </span>
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-indigo-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                      isClick ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {isClick ? 'Click' : 'Page View'}
                    </span>
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-start gap-3">
                    <Globe size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-800 font-mono bg-gray-50 p-2.5 rounded-lg break-all border border-gray-100 flex-1">
                      {event.pageUrl}
                    </p>
                  </div>
                  
                  {isClick && event.metadata && (event.metadata.x !== undefined || event.metadata.y !== undefined) && (
                    <div className="mt-4 flex gap-4 text-sm text-gray-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-700">X:</span> 
                        <span className="font-mono">{event.metadata.x}px</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-700">Y:</span> 
                        <span className="font-mono">{event.metadata.y}px</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserJourneyPage;
