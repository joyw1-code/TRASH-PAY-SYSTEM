import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Filter,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';
import { DumpStatus, WasteReport } from '../types/trashpay';

export const TrashReportingView: React.FC = () => {
  const { reports, submitWasteReport, updateReportStatus, currentUser } = useTrashPay();

  const [filterZone, setFilterZone] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [zone, setZone] = useState('Bwaise');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'MODERATE' | 'CRITICAL' | 'HAZARDOUS'>('CRITICAL');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
  );

  const samplePhotos = [
    {
      label: 'Drainage Canal Blockage',
      url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Open Roadside Heap',
      url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Riverbed Plastic Accumulation',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName) return;

    submitWasteReport({
      title,
      zone,
      locationName,
      description: description || 'Dumped plastic and domestic refuse needing collection dispatch.',
      photoUrl,
      lat: zone === 'Katanga' ? 0.3392 : zone === 'Kasese' ? 0.1833 : 0.3541,
      lng: zone === 'Katanga' ? 32.5744 : zone === 'Kasese' ? 30.0833 : 32.5612,
      reporterMsisdn: currentUser.msisdn,
      reporterName: currentUser.fullName,
      severity,
      bountyUGX: severity === 'HAZARDOUS' ? 7500 : severity === 'CRITICAL' ? 5000 : 3000,
    });

    setTitle('');
    setLocationName('');
    setDescription('');
    setShowSubmitModal(false);
  };

  const filteredReports = reports.filter((r) => {
    if (filterZone !== 'ALL' && r.zone !== filterZone) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Citizen Trash Reporting &amp; Cleanup Dispatch
            </h2>
            <span className="text-[10px] font-bold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
              KCCA × WWF Aligned
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Geotag dumped waste, notify local depot collectors, and earn micro-bounties when sites are verified clean.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Report Dumped Waste</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 p-1 rounded-xl">
          <span className="text-stone-400 text-[11px] px-2 font-medium">Zone:</span>
          {['ALL', 'Bwaise', 'Katanga', 'Kasese'].map((z) => (
            <button
              key={z}
              onClick={() => setFilterZone(z)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                filterZone === z
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 p-1 rounded-xl">
          <span className="text-stone-400 text-[11px] px-2 font-medium">Status:</span>
          {['ALL', 'REPORTED', 'DISPATCHED', 'IN_PROGRESS', 'CLEANED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-stone-700 text-white'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-stone-700 transition-all"
          >
            <div>
              {/* Photo Banner with Status Overlay */}
              <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                <img
                  src={report.photoUrl}
                  alt={report.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${
                      report.status === 'CLEANED'
                        ? 'bg-emerald-500 text-stone-950'
                        : report.status === 'IN_PROGRESS'
                        ? 'bg-blue-500 text-white'
                        : report.status === 'DISPATCHED'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {report.status}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm ${
                      report.severity === 'HAZARDOUS'
                        ? 'bg-red-900/90 text-red-200 border border-red-700'
                        : report.severity === 'CRITICAL'
                        ? 'bg-amber-900/90 text-amber-200 border border-amber-700'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {report.severity}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 bg-stone-950/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono font-bold text-amber-300">
                  Bounty: UGX {report.bountyUGX.toLocaleString()}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <h3 className="font-bold text-sm text-white line-clamp-1">
                  {report.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{report.locationName}</span>
                </div>

                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Reporter: <strong className="text-stone-300">{report.reporterName}</strong></span>
                  <span>{report.submittedAt}</span>
                </div>

                {report.assignedAgent && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Assigned: {report.assignedAgent}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Action Bar */}
            <div className="p-3 bg-stone-950/60 border-t border-stone-800 flex items-center justify-between gap-2">
              {report.status === 'REPORTED' && (
                <button
                  onClick={() => updateReportStatus(report.id, 'DISPATCHED', 'Bwaise Depot Crew 1')}
                  className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Dispatch Collector Crew
                </button>
              )}

              {report.status === 'DISPATCHED' && (
                <button
                  onClick={() => updateReportStatus(report.id, 'IN_PROGRESS', 'Bwaise Depot Crew 1')}
                  className="w-full py-1.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Mark Cleanup In-Progress
                </button>
              )}

              {report.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => updateReportStatus(report.id, 'CLEANED', 'Joy Wabule (Bwaise Hub)')}
                  className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-lg text-xs transition-colors shadow-sm"
                >
                  Verify Cleaned &amp; Release Bounty (UGX {report.bountyUGX.toLocaleString()})
                </button>
              )}

              {report.status === 'CLEANED' && (
                <div className="w-full py-1 text-center font-bold text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Site Verified Cleaned · Bounty Paid</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Submit Citizen Waste Report
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-stone-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Report Title / Problem Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blocked Culvert Trench with Plastic Bottles"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Operational Zone
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white outline-hidden focus:border-amber-400"
                  >
                    <option value="Bwaise">Bwaise</option>
                    <option value="Katanga">Katanga</option>
                    <option value="Kasese">Kasese</option>
                    <option value="Kawempe">Kawempe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Dump Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as 'MODERATE' | 'CRITICAL' | 'HAZARDOUS')}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white outline-hidden focus:border-amber-400"
                  >
                    <option value="MODERATE">Moderate (Roadside)</option>
                    <option value="CRITICAL">Critical (Drainage risk)</option>
                    <option value="HAZARDOUS">Hazardous (Waterway)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Specific Landmark / Street Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nabweru Road Culvert near St. Francis Chapel"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Photo Evidence (Select or paste URL)
                </label>
                <div className="flex gap-2 mb-2">
                  {samplePhotos.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(s.url)}
                      className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                        photoUrl === s.url
                          ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                          : 'bg-stone-800 border-stone-700 text-stone-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs font-mono outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Description of Waste Pile
                </label>
                <textarea
                  rows={2}
                  placeholder="Details on estimated weight, types of plastic, accessibility..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-xl font-semibold text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-md"
                >
                  Submit Report (Alert Collectors)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
