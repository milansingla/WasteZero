import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MapPin, PackageCheck, RefreshCw, Recycle, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const formatDate = (value) => value
  ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  : 'Date to be confirmed';

export default function AdminPickups() {
  const { api } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState('');

  const loadPickups = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/admin/pickups');
      setPickups(response.data?.pickups || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Could not load pickup requests';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { loadPickups(); }, [loadPickups]);

  const pendingCount = useMemo(() => pickups.filter((pickup) => pickup.status === 'pending').length, [pickups]);
  const scheduledCount = useMemo(() => pickups.filter((pickup) => pickup.status === 'scheduled').length, [pickups]);
  const visiblePickups = pickups.filter((pickup) => filter === 'all' || (filter === 'pending' ? pickup.status === 'pending' : pickup.status === 'scheduled'));

  const acceptRequest = async (pickupId) => {
    setAcceptingId(pickupId);
    try {
      const response = await api.patch(`/api/admin/pickups/${pickupId}/accept`);
      setPickups((current) => current.map((pickup) => pickup._id === pickupId ? response.data.pickup : pickup));
      toast.success('Pickup request accepted and scheduled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept pickup request');
      if (err.response?.status === 409) loadPickups();
    } finally {
      setAcceptingId('');
    }
  };

  return (
    <section className="space-y-7 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Operations</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Pickup requests</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">Review community collection requests. Accepting a request confirms it and moves it to the scheduled queue.</p>
        </div>
        <button type="button" onClick={loadPickups} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-amber-900">Awaiting approval</p><p className="mt-2 text-3xl font-bold text-amber-950">{pendingCount}</p></div>
            <Clock3 className="text-amber-700" size={26} />
          </div>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-emerald-900">Scheduled</p><p className="mt-2 text-3xl font-bold text-emerald-950">{scheduledCount}</p></div>
            <PackageCheck className="text-emerald-700" size={26} />
          </div>
        </article>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Collection queue</h2>
          <p className="text-sm text-gray-500">Pickup status updates appear on the resident’s Pickups page.</p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1" role="group" aria-label="Filter pickup requests">
          {[['pending', 'Needs review'], ['scheduled', 'Accepted'], ['all', 'All requests']].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-md px-3 py-2 text-xs font-semibold transition ${filter === value ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`} aria-pressed={filter === value}>{label}</button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-800">{error}</p>
          <button type="button" onClick={loadPickups} className="mt-3 text-sm font-semibold text-red-800 underline">Try again</button>
        </div>
      ) : loading ? (
        <div className="rounded-xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">Loading pickup queue…</div>
      ) : visiblePickups.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white px-6 py-14 text-center">
          <Recycle className="mx-auto text-emerald-700" size={34} />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{filter === 'pending' ? 'No requests need approval' : 'No pickup requests here yet'}</h3>
          <p className="mt-2 text-sm text-gray-500">New resident pickup requests will appear here for review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visiblePickups.map((pickup) => (
            <article key={pickup._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold capitalize text-gray-900">{pickup.wasteType} recycling pickup</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${pickup.status === 'pending' ? 'bg-amber-100 text-amber-800' : pickup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{pickup.status}</span>
                  </div>
                  <div className="mt-3 grid gap-x-6 gap-y-2 text-sm text-gray-600 sm:grid-cols-2 xl:grid-cols-4">
                    <span className="inline-flex items-center gap-2"><UserRound size={15} />{pickup.user_id?.name || 'Resident'}</span>
                    <span className="inline-flex items-center gap-2"><MapPin size={15} />{pickup.location}</span>
                    <span className="inline-flex items-center gap-2"><Recycle size={15} />{pickup.quantityKg} kg · {pickup.wasteType}</span>
                    <span className="inline-flex items-center gap-2"><CalendarDays size={15} />{formatDate(pickup.scheduledDate)}</span>
                  </div>
                  {pickup.user_id?.email && <p className="mt-2 text-xs text-gray-400">{pickup.user_id.email}</p>}
                </div>
                {pickup.status === 'pending' ? (
                  <button type="button" onClick={() => acceptRequest(pickup._id)} disabled={acceptingId === pickup._id} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
                    <CheckCircle2 size={17} />{acceptingId === pickup._id ? 'Accepting…' : 'Accept request'}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 size={17} />Approved</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
