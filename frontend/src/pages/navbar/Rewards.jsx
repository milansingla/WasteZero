import { ArrowRight, Award, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImpactExplorer from '../../components/Impact/ImpactExplorer';

export default function Rewards() {
  return (
    <main className="wz-rewards-page">
      <header className="wz-rewards-hero">
        <span className="wz-overline">LOCAL RECYCLING REWARDS</span>
        <h1>Good work deserves<br /><em>to be recognised.</em></h1>
        <p>The top 10 recyclers in Rajpura and Banur earn an Eco Leader badge and community reward eligibility based on verified completed pickups.</p>
        <div className="wz-rewards-rule"><span><Award size={17} /> Top 10 per area</span><span><Recycle size={17} /> Completed pickups count</span><span>Ranked by kilograms</span></div>
      </header>
      <ImpactExplorer showSamples />
      <div className="wz-rewards-cta"><div><span className="wz-overline">YOUR NEXT PICKUP COUNTS</span><h2>Put your good intentions on the board.</h2><p>Schedule a Rajpura or Banur pickup. Your kilograms join the rankings after the collection is completed.</p></div><Link to="/dashboard/pickups" className="wz-button wz-button-primary">Arrange a pickup <ArrowRight size={18} /></Link></div>
    </main>
  );
}
