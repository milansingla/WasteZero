import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Medal, RefreshCw } from 'lucide-react';
import { publicApi } from '../../contexts/AuthContext';

const SAMPLE_RANKINGS = {
  Rajpura: [
    { name: 'Demo Recycler 01', kg: 48.6, pickups: 12 },
    { name: 'Demo Recycler 02', kg: 42.3, pickups: 10 },
    { name: 'Demo Recycler 03', kg: 37.8, pickups: 9 },
    { name: 'Demo Recycler 04', kg: 33.4, pickups: 8 },
    { name: 'Demo Recycler 05', kg: 29.1, pickups: 7 },
    { name: 'Demo Recycler 06', kg: 25.7, pickups: 6 },
    { name: 'Demo Recycler 07', kg: 22.2, pickups: 6 },
    { name: 'Demo Recycler 08', kg: 18.9, pickups: 5 },
    { name: 'Demo Recycler 09', kg: 15.4, pickups: 4 },
    { name: 'Demo Recycler 10', kg: 12.1, pickups: 3 },
  ],
  Banur: [
    { name: 'Demo Recycler 01', kg: 44.2, pickups: 11 },
    { name: 'Demo Recycler 02', kg: 39.5, pickups: 9 },
    { name: 'Demo Recycler 03', kg: 35.1, pickups: 8 },
    { name: 'Demo Recycler 04', kg: 30.8, pickups: 8 },
    { name: 'Demo Recycler 05', kg: 27.6, pickups: 7 },
    { name: 'Demo Recycler 06', kg: 23.3, pickups: 6 },
    { name: 'Demo Recycler 07', kg: 20.4, pickups: 5 },
    { name: 'Demo Recycler 08', kg: 17.2, pickups: 5 },
    { name: 'Demo Recycler 09', kg: 13.8, pickups: 4 },
    { name: 'Demo Recycler 10', kg: 10.5, pickups: 3 },
  ],
};

export default function ImpactExplorer({ showSamples = false }) {
  const [area, setArea] = useState('Rajpura');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (selectedArea = area) => {
    setLoading(true);
    setError(false);
    try {
      const response = await publicApi.get('/api/impact', { params: { area: selectedArea } });
      setData(response.data);
    } catch {
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [area]);

  useEffect(() => { load(area); }, [area, load]);

  const showSampleData = showSamples && !loading && !error && !data?.rankings?.length;
  const visibleRankings = showSampleData ? SAMPLE_RANKINGS[area] : data?.rankings || [];
  const visibleKg = showSampleData
    ? visibleRankings.reduce((total, entry) => total + entry.kg, 0)
    : data?.areaTotalKg || 0;
  const visiblePickups = showSampleData
    ? visibleRankings.reduce((total, entry) => total + entry.pickups, 0)
    : data?.completedPickups || 0;

  return (
    <section className="wz-impact" aria-labelledby="impact-title">
      <div className="wz-impact-head">
        <div><span className="wz-overline">THE COMMUNITY SCOREBOARD</span><h2 id="impact-title">Local effort,<br /><em>visible progress.</em></h2></div>
        <p>Rankings use verified completed pickups. The home map highlights Indian states with recorded recycling activity.</p>
      </div>
      <article className="wz-impact-panel wz-rank-panel wz-rank-wide">
        <div className="wz-panel-head"><div><span className="wz-panel-kicker"><Medal size={14} /> TOP 10 AREA RANKING</span><h3>Neighbors leading the way</h3></div><button type="button" className="wz-refresh" onClick={() => load()} aria-label="Refresh leaderboard" title="Refresh"><RefreshCw size={17} /></button></div>
        <div className="wz-rank-controls"><label className="wz-area-select-label" htmlFor="wz-area-select">Choose a community</label><select id="wz-area-select" className="wz-area-select" value={area} onChange={(event) => setArea(event.target.value)}><option value="Rajpura">Rajpura · Punjab</option><option value="Banur">Banur · Punjab</option></select></div>
        {showSampleData && <div className="wz-impact-empty wz-demo-notice"><strong>DEMO DATA — NOT REAL PEOPLE OR VERIFIED ACTIVITY</strong><span>These fictional top-10 entries are examples only. Live rankings will replace them when verified pickup data is available.</span></div>}
        {loading ? <div className="wz-impact-empty" role="status">Loading verified community totals…</div> : error ? <div className="wz-impact-empty"><strong>Could not load the leaderboard</strong><span>Check that the WasteZero API is running, then try again.</span><button type="button" className="wz-inline-action" onClick={() => load()}>Try again <ArrowRight size={14} /></button></div> : visibleRankings.length ? <div className="wz-rank-list">{visibleRankings.map((entry, index) => { const rank = entry.rank || index + 1; return <div className={`wz-rank-row ${rank <= 3 ? 'wz-rank-podium' : ''}`} key={`${rank}-${entry.name}`}><span className="wz-rank-number">{String(rank).padStart(2, '0')}</span><span className="wz-rank-name">{entry.name}<small>{showSampleData ? `${entry.pickups} sample pickups` : `${entry.pickups} completed pickup${entry.pickups === 1 ? '' : 's'}`}</small></span><strong>{entry.kg.toLocaleString()} <small>kg</small></strong><span className="wz-reward-chip">{showSampleData ? 'Demo badge' : 'Eco Leader badge'}</span></div>; })}</div> : <div className="wz-impact-empty"><strong>{area} is ready for its first leaderboard entry</strong><span>Completed pickups count toward the local top 10. The top ten earn Eco Leader recognition and reward eligibility.</span><Link className="wz-inline-action" to="/dashboard/pickups">Arrange a pickup <ArrowRight size={14} /></Link></div>}
        <div className="wz-rank-foot"><span><span className="wz-live-dot" /> {showSampleData ? 'Sample figures only' : 'Completed pickups only'}</span><span>{visibleKg.toLocaleString()} kg · {visiblePickups} pickups</span></div>
        <p className="wz-impact-note">{showSampleData ? 'Sample rankings are fictional and are not used for rewards or eligibility.' : 'Top 10 recognition is based on verified completed kilograms. Names are shortened for privacy.'}</p>
      </article>
    </section>
  );
}
