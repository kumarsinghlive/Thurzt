import React, { useState } from 'react';
import { X, Flag, ShieldAlert } from 'lucide-react';
import { MockService } from '../services/mockData';

import { CONFIG } from '../config';

interface ReportModalProps {
  entityId: string;
  entityName: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ entityId, entityName, onClose }) => {
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callHarness = async <T,>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    return fn();
  };

  const reasons = [
    'Spam',
    'Harassment',
    'Fake profile',
    'Inappropriate content',
    'Other'
  ];

  const handleSubmit = async () => {
    if (!reason) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await callHarness('reportEntity', async () => {
        MockService.reportEntity(entityId, reason, details);
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Report Submitted</h3>
          <p className="text-zinc-400 text-sm">Thank you for keeping our community safe. We will review this report shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 pr-10">
          <div className="flex items-center space-x-3 text-red-500 mb-4">
            <Flag className="w-6 h-6" />
            <h3 className="text-xl font-black uppercase tracking-tight">Report {entityName}</h3>
          </div>
          <p className="text-zinc-400 text-sm">Please select a reason for reporting this profile.</p>
        </div>

        <div className="space-y-2">
          {reasons.map(r => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                reason === r 
                  ? 'bg-red-500 text-white' 
                  : 'bg-black/50 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Additional Details (Optional)</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide more context..."
            className="w-full h-24 bg-black/50 border border-white/5 rounded-xl p-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!reason || isSubmitting}
          className="w-full py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
};
