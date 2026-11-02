import { useEffect, useState } from 'react';
import { MapPinned, Recycle } from 'lucide-react';
import { publicApi } from '../../contexts/AuthContext';

const outline = 'M160 26 208 33 239 43 267 45 287 61 305 70 325 83 353 92 376 105 365 119 347 124 369 134 347 144 327 139 309 150 298 168 305 182 295 196 304 214 292 230 281 249 276 268 262 287 255 311 244 333 238 355 225 383 214 397 204 376 190 359 180 339 162 321 153 301 137 286 128 269 108 260 93 247 76 238 62 218 73 197 89 183 95 164 108 151 120 136 127 116 139 103 136 83 147 69 147 49 160 26 Z';
const points = { 'Punjab':[143,101], Haryana:[151,123], Delhi:[164,132], Rajasthan:[116,166], Gujarat:[103,220], 'Uttar Pradesh':[196,133], 'Madhya Pradesh':[172,190], Bihar:[242,148], 'West Bengal':[265,172], Jharkhand:[240,179], Chhattisgarh:[218,204], Odisha:[249,214], Maharashtra:[166,238], Goa:[161,275], Telangana:[197,245], 'Andhra Pradesh':[207,278], Karnataka:[179,288], Kerala:[189,344], 'Tamil Nadu':[211,337], Sikkim:[260,131], Assam:[304,119], 'Arunachal Pradesh':[323,108], Nagaland:[316,139], Manipur:[311,154], Mizoram:[299,173], Tripura:[289,157], Meghalaya:[295,137], 'Himachal Pradesh':[157,83], Uttarakhand:[178,99], 'Jammu and Kashmir':[157,57], Ladakh:[195,58], 'Andaman and Nicobar Islands':[294,320], Lakshadweep:[78,306], Chandigarh:[148,110], Puducherry:[218,319] };

export default function IndiaActivityMap() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    publicApi.get('/api/impact', { params: { area: 'Rajpura' } })
      .then(({ data }) => { if (active) setStates(data.states || []); })
      .catch(() => { if (active) setUnavailable(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const totalKg = states.reduce((sum, state) => sum + (Number(state.kg) || 0), 0);

  return (
    <div className="wz-route-card wz-india-hero-card" aria-label="India recycling activity map">
      <div className="wz-route-top">
        <div><span className="wz-overline"><MapPinned size={13} /> INDIA · VERIFIED ACTIVITY</span><h2>Every green point<br />marks progress.</h2></div>
        <span className="wz-route-icon"><Recycle size={19} /></span>
      </div>
      <div className="wz-india-hero-map-wrap">
        <svg className="wz-india-hero-map" viewBox="45 16 340 405" role="img" aria-label={`${states.length} Indian states with completed recycling pickups`}>
          <path className="wz-india-shape" d={outline} />
          {states.map((state) => {
            const [x, y] = points[state.name] || [143, 101];
            return <g key={state.name}>
              <circle cx={x} cy={y} r="14" className="wz-hero-map-pulse" />
              <circle cx={x} cy={y} r="6" className="wz-hero-map-dot"><title>{state.name}: {Number(state.kg).toLocaleString()} kg</title></circle>
              <text x={x + 8} y={y - 7} className="wz-map-state-label">{state.name.toUpperCase()}</text>
            </g>;
          })}
          {!states.length && <g><circle cx="143" cy="101" r="14" className="wz-hero-map-pulse" /><circle cx="143" cy="101" r="6" className="wz-hero-map-dot"><title>Punjab · Rajpura and Banur focus area</title></circle><text x="151" y="94" className="wz-map-state-label">PUNJAB</text></g>}
        </svg>
        <div className="wz-india-map-caption"><span className="wz-live-dot" /><div><strong>Rajpura &amp; Banur</strong><small>Punjab · local focus areas</small></div></div>
      </div>
      <div className="wz-route-foot"><span><span className="wz-live-dot" /> {loading ? 'Loading verified activity' : unavailable ? 'Activity data unavailable' : `${states.length} active state${states.length === 1 ? '' : 's'}`}</span><span>{unavailable ? 'Retry on reload' : `${totalKg.toLocaleString()} kg verified`}</span></div>
    </div>
  );
}
