// src/pages/opportunities/PublicOpportunities.jsx
import { useEffect, useState } from 'react';
import { useAuth, publicApi } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SAMPLE_OPPORTUNITIES = [
	{
		id: 'sample-rajpura-recycling-drive',
		sample: true,
		title: 'Neighbourhood Recycling Drive',
		description: 'A sample volunteer listing for sorting clean paper and plastic at a community collection event. This preview is not an active event.',
		location: 'Rajpura, Punjab',
		duration: 'One morning',
		required_skills: ['Teamwork', 'Sorting'],
		status: 'sample',
	},
	{
		id: 'sample-banur-e-waste',
		sample: true,
		title: 'E-waste Sorting Workshop',
		description: 'A sample opportunity showing how a local e-waste awareness and safe sorting session could be listed for volunteers.',
		location: 'Banur, Punjab',
		duration: '2 hours',
		required_skills: ['Awareness', 'Organization'],
		status: 'sample',
	},
	{
		id: 'sample-rajpura-composting',
		sample: true,
		title: 'Community Composting Pilot',
		description: 'A sample listing for helping residents learn how to separate kitchen scraps and start a shared composting pilot.',
		location: 'Rajpura, Punjab',
		duration: 'Flexible',
		required_skills: ['Community outreach'],
		status: 'sample',
	},
];

export default function PublicOpportunities() {
	const { api, user } = useAuth();
	const [opps, setOpps] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [appliedIds, setAppliedIds] = useState(new Set());
	const [selectedOpp, setSelectedOpp] = useState(null);

	const openView = (opp) => setSelectedOpp(opp);
	const closeView = () => setSelectedOpp(null);

	useEffect(() => {
		let mounted = true;
		const fetch = async () => {
			try {
				// Use public API for opportunities list (no auth needed)
				const res = await publicApi.get('/api/opportunities');
				if (!mounted) return;
				const opportunityData = Array.isArray(res.data)
					? res.data
					: res.data?.data || res.data?.opportunities || [];
				setOpps(Array.isArray(opportunityData) ? opportunityData : []);
				// If logged in as volunteer, fetch their applied IDs
				if (user?.role === 'volunteer') {
					try {
						// Use authenticated api for user-specific data
						const apps = await api.get('/api/applications/my');
						const appData = apps.data?.data || apps.data || [];
						const ids = new Set(
							appData.map(a => a?.opportunity_id?._id).filter(Boolean)
						);
						if (mounted) setAppliedIds(ids);
					} catch (e) {
						console.warn('[PublicOpportunities] failed to load applied IDs', e);
					}
				}
			} catch (err) {
				setError(err?.response?.data?.message || err.message || 'Failed to load opportunities');
			} finally {
				if (mounted) setLoading(false);
			}
		};
		fetch();
		return () => (mounted = false);
	}, [api, user]);

	const handleApply = async (id) => {
		if (String(id).startsWith('sample-')) {
			toast('Sample listings are for preview only. Ask a partner NGO to publish a live opportunity to apply.');
			return;
		}
		if (!window.confirm('Apply for this opportunity?')) return;
		try {
			await api.post(`/api/applications/${id}/apply`);
			toast.success('Application submitted');
			setAppliedIds(prev => new Set([...prev, id]));
		} catch (err) {
			console.error('[apply error]', err);
			toast.error(err.response?.data?.message || 'Failed to apply');
		}
	};

	if (loading) return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
		</div>
	);

	if (error) return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg w-full">
				<h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
				<p className="text-red-600">{error}</p>
			</div>
		</div>
	);
	const showingSamples = opps.length === 0;
	const visibleOpps = showingSamples ? SAMPLE_OPPORTUNITIES : opps;

	return (
		<>
			<div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
						<Link to="/opportunities" className="text-sm text-gray-500">Browse all</Link>
					</div>
					{showingSamples && (
						<div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
							<strong>Sample opportunities</strong> — previews only. These are not live events and applications are disabled until an NGO publishes real listings.
						</div>
					)}

					{visibleOpps.length === 0 ? (
						<div className="bg-white rounded-xl p-8 text-center">No opportunities found.</div>
					) : (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{visibleOpps.map((o) => (
								<div key={o._id || o.id} className="bg-white rounded-xl p-5 shadow">
									{o.sample && <span className="mb-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">SAMPLE</span>}
									<h3 className="font-semibold text-lg text-gray-900 mb-2 flex items-center">
	{o.title}
	{user?.role === 'volunteer' && Array.isArray(user.skills) && Array.isArray(o.required_skills) && o.required_skills.some(sk => user.skills.includes(sk)) && (
		<span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
			Match
		</span>
	)}
</h3>
									<p className="text-sm text-gray-600 line-clamp-3 mb-3">{o.description}</p>
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-500">{o.location || 'Location not set'}</div>
										<div className="flex items-center gap-4">
											<button onClick={() => openView(o)} className="text-sm text-emerald-600 font-medium">View</button>
															{user?.role === 'ngo' && user._id === o.ngo_id && (
																<Link to={`/dashboard/opportunities/edit/${o._id || o.id}`} className="text-sm text-blue-600 font-medium">Edit</Link>
															)}
											{user?.role === 'volunteer' && !o.sample && (
												<button
													onClick={() => handleApply(o._id || o.id)}
													disabled={appliedIds.has(o._id || o.id)}
													className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${appliedIds.has(o._id || o.id) ? 'bg-gray-200 text-gray-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
													{appliedIds.has(o._id || o.id) ? 'Applied' : 'Apply'}
												</button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{selectedOpp && (
				<div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-5 overflow-y-auto">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
						<div className="p-7 border-b flex justify-between items-center sticky top-0 bg-white z-10">
							<h2 className="text-3xl font-bold text-gray-900 line-clamp-2 pr-10">{selectedOpp.title}</h2>
							<button onClick={closeView} className="p-3 rounded-full hover:bg-gray-100">Close</button>
						</div>

						<div className="p-8 space-y-10">
							{selectedOpp.sample ? (
								<div className="w-full h-64 rounded-xl bg-gradient-to-br from-emerald-700 via-green-600 to-lime-500 p-8 flex flex-col justify-end text-white shadow-md">
									<span className="text-xs font-bold tracking-[0.2em]">SAMPLE LISTING</span>
									<strong className="mt-3 text-3xl">{selectedOpp.location}</strong>
								</div>
							) : (
								<img src={selectedOpp.image ? `${api.defaults.baseURL}${selectedOpp.image}` : 'https://placehold.co/800x600/10b981/ffffff/png?text=Volunteer+Opportunity'} alt={selectedOpp.title} className="w-full h-96 object-cover rounded-xl shadow-md" onError={(e) => e.target.src = 'https://placehold.co/800x600/10b981/ffffff/png?text=Volunteer+Opportunity'} />
							)}

							<div className="grid md:grid-cols-3 gap-10">
								<div className="md:col-span-2 space-y-10">
									<div>
										<h3 className="text-2xl font-semibold text-gray-900 mb-5">Description</h3>
										<p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{selectedOpp.description}</p>
									</div>

									{selectedOpp.required_skills?.length > 0 && (
										<div>
											<h3 className="text-2xl font-semibold text-gray-900 mb-5">Required Skills</h3>
											<div className="flex flex-wrap gap-3">{selectedOpp.required_skills.map(skill => <span key={skill} className="bg-green-100 text-green-800 px-6 py-2.5 rounded-full text-base font-medium">{skill}</span>)}</div>
										</div>
									)}
								</div>

								<div className="space-y-9 bg-gray-50 p-7 rounded-xl">
									<div>
										<h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
										<p className="text-gray-700 text-lg">{selectedOpp.location || 'Not specified'}</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-gray-900 mb-4">Duration</h3>
										<p className="text-gray-700 text-lg">{selectedOpp.duration || 'Flexible'}</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-gray-900 mb-4">Status</h3>
										<span className="inline-block px-7 py-2.5 bg-green-100 text-green-800 rounded-full text-base font-medium">{selectedOpp.status?.toUpperCase() || 'OPEN'}</span>
									</div>

									{selectedOpp.sample ? (
										<p className="pt-8 border-t text-sm text-gray-600">This is demo content only. It cannot be submitted as an application.</p>
									) : user?.role === 'volunteer' && (
										<div className="pt-8 border-t flex justify-end">
											<button onClick={async () => { await handleApply(selectedOpp._id || selectedOpp.id); closeView(); }} disabled={appliedIds.has(selectedOpp._id || selectedOpp.id)} className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${appliedIds.has(selectedOpp._id || selectedOpp.id) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl'}`}>{appliedIds.has(selectedOpp._id || selectedOpp.id) ? 'Already Applied' : 'Apply Now'}</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
