import React, { useState } from 'react';
import { Search, Flame, Map } from 'lucide-react';
import { getHeatmapData } from '../services/api';
import { useApiFetch } from '../hooks/useApiFetch';
import ErrorAlert from '../components/ErrorAlert';

const HeatmapPage = () => {
  const [pageUrl, setPageUrl] = useState('');
  const [searched, setSearched] = useState(false);
  
  const { data: heatmapData, loading, error, execute } = useApiFetch(getHeatmapData, false);

  const fetchHeatmap = async (e) => {
    e.preventDefault();
    if (!pageUrl.trim()) return;
    
    setSearched(true);
    try {
      await execute(pageUrl);
    } catch (err) {
      // Error is handled natively by the hook state
    }
  };

  // Find max count to normalize intensity
  const maxCount = heatmapData ? Math.max(1, ...heatmapData.map(p => p.count)) : 1;

  // Helper to get color based on intensity
  const getIntensityClass = (count) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] blur-[1.5px]';
    if (ratio > 0.5) return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] blur-[1.5px]';
    if (ratio > 0.2) return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] blur-[1px]';
    return 'bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)] blur-[0.5px]';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Map className="text-indigo-600" />
          Interaction Heatmap
        </h2>
        <p className="text-gray-500 mt-1">Visualize where your users are clicking the most on specific pages.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex-shrink-0">
        <form onSubmit={fetchHeatmap} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              placeholder="Enter precise Page URL (e.g., /home or /products?id=1)"
              className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-gray-900"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !pageUrl.trim()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-all font-semibold flex items-center justify-center gap-2 min-w-[200px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Flame size={20} />
                Generate Heatmap
              </>
            )}
          </button>
        </form>
      </div>

      {error && <ErrorAlert message="Failed to load heatmap data" />}

      {searched && !loading && !error && heatmapData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50 rounded-t-xl">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Results for: <span className="font-mono bg-white px-3 py-1 rounded-md text-sm text-indigo-700 border border-gray-200 shadow-sm">{pageUrl}</span>
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm w-full lg:w-auto">
              <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                <MousePointerClick size={16} className="text-gray-400" />
                {heatmapData.length} unique points
              </span>
              <div className="hidden sm:block h-5 w-px bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium text-xs uppercase tracking-wider">Intensity:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Low</span>
                  <div className="flex gap-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]"></div>
                  </div>
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </div>
            </div>
          </div>

          {heatmapData.length === 0 ? (
            <div className="text-center py-20 flex-1 flex flex-col justify-center items-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4 border border-gray-100">
                <Map className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-gray-600 font-medium text-lg">No click data found</p>
              <p className="text-gray-400 mt-1">Try searching for a different URL or generating clicks first.</p>
            </div>
          ) : (
            <div className="relative w-full flex-1 overflow-auto bg-slate-50 min-h-[500px]"
                 style={{ 
                   backgroundImage: `
                     linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                     linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                   `, 
                   backgroundSize: '40px 40px',
                   backgroundPosition: 'center top'
                 }}>
              <div className="absolute top-0 left-0 min-w-[2500px] min-h-[2500px]">
                {heatmapData.map((point, i) => (
                  <div
                    key={i}
                    className={`absolute w-8 h-8 rounded-full opacity-[0.65] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all ${getIntensityClass(point.count)}`}
                    style={{ left: point.x, top: point.y }}
                    title={`Clicks: ${point.count}`}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeatmapPage;
