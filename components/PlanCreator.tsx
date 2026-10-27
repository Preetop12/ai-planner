
import React, { useState, useRef } from 'react';
import { Sparkles, BrainCircuit, FileText, Upload, X, Check } from 'lucide-react';
import { PlanGenerationInput } from '../types';

interface PlanCreatorProps {
  onGenerate: (data: PlanGenerationInput) => Promise<void>;
  isGenerating: boolean;
}

const PlanCreator: React.FC<PlanCreatorProps> = ({ onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState<PlanGenerationInput>({
    subject: '', syllabus: '', examDate: '', dailyStudyHours: 2, learningStyle: 'visual',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const convertToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fileData;
    if (file) fileData = { base64: await convertToBase64(file), mimeType: file.type };
    onGenerate({ ...formData, fileData });
  };

  const labelClass = "text-xs font-bold uppercase tracking-widest ml-1 block mb-2";

  return (
    <div
      className="max-w-3xl mx-auto rounded-[2.5rem] overflow-hidden glass"
      style={{
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
      }}
    >
      {/* Header */}
      <div className="p-8 pb-6" style={{ borderBottom: '1px solid rgba(196,149,106,0.1)', background: 'rgba(196,149,106,0.03)' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 btn-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <BrainCircuit className="w-8 h-8" style={{ color: '#fff8f0' }} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--cream)' }}>Plan Your Success</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Nemotron Ultra turns your syllabus into a daily roadmap
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-7">
        {/* Subject + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} style={{ color: 'var(--text-dim)' }}>Subject</label>
            <input
              required type="text" placeholder="e.g. Molecular Biology"
              className="pro-input w-full px-5 py-3.5 rounded-xl text-sm"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'var(--text-dim)' }}>Exam Date</label>
            <input
              required type="date"
              className="pro-input w-full px-5 py-3.5 rounded-xl text-sm"
              value={formData.examDate}
              onChange={e => setFormData({ ...formData, examDate: e.target.value })}
            />
          </div>
        </div>

        {/* PDF Upload */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text-dim)' }}>Syllabus PDF (optional)</label>
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault(); setIsDragging(false);
              const f = e.dataTransfer.files[0];
              if (f?.type === 'application/pdf') setFile(f);
              else alert('Please upload a PDF file.');
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-10 cursor-pointer flex flex-col items-center justify-center gap-4 transition-all duration-300"
            style={{
              borderColor: isDragging ? 'var(--coffee)' : 'rgba(196,149,106,0.2)',
              background: isDragging ? 'rgba(196,149,106,0.05)' : 'transparent'
            }}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
            {file ? (
              <div className="flex items-center gap-5 rounded-2xl px-6 py-4 w-full max-w-sm" style={{ background: 'rgba(110,231,183,0.07)', border: '1px solid rgba(110,231,183,0.2)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(110,231,183,0.15)' }}>
                  <FileText className="w-6 h-6" style={{ color: '#6ee7b7' }} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--cream)' }}>{file.name}</p>
                  <p className="text-xs font-black uppercase tracking-widest mt-0.5 flex items-center gap-1" style={{ color: '#6ee7b7' }}>
                    <Check className="w-3 h-3" /> Linked
                  </p>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-dim)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(196,149,106,0.08)', border: '1px solid rgba(196,149,106,0.15)' }}>
                  <Upload className="w-7 h-7" style={{ color: 'var(--coffee)' }} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm" style={{ color: 'var(--cream)' }}>Drop your PDF here</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Drag & drop or click to browse</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Manual syllabus */}
        {!file && (
          <div>
            <label className={labelClass} style={{ color: 'var(--text-dim)' }}>Or Paste Syllabus Text</label>
            <textarea
              rows={4}
              placeholder="List your topics and objectives here…"
              className="pro-input w-full px-5 py-3.5 rounded-xl text-sm resize-none"
              value={formData.syllabus}
              onChange={e => setFormData({ ...formData, syllabus: e.target.value })}
            />
          </div>
        )}

        {/* Hours + Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} style={{ color: 'var(--text-dim)' }}>Daily Study Hours</label>
            <div className="relative">
              <input
                type="number" min="1" max="24"
                className="pro-input w-full px-5 py-3.5 rounded-xl text-sm pr-16"
                value={formData.dailyStudyHours}
                onChange={e => setFormData({ ...formData, dailyStudyHours: parseInt(e.target.value) })}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black uppercase" style={{ color: 'var(--text-dim)' }}>hrs</span>
            </div>
          </div>
          <div>
            <label className={labelClass} style={{ color: 'var(--text-dim)' }}>Learning Style</label>
            <select
              className="pro-input w-full px-5 py-3.5 rounded-xl text-sm"
              value={formData.learningStyle}
              onChange={e => setFormData({ ...formData, learningStyle: e.target.value as any })}
            >
              <option value="visual">Visual & Spatial</option>
              <option value="reading">Textual Analysis</option>
              <option value="practical">Project Applied</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={isGenerating}
          type="submit"
          className="btn-primary w-full py-5 rounded-2xl text-lg flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <div className="flex gap-1.5">
                {['-0.3s', '-0.15s', '0s'].map((d, i) => (
                  <div key={i} className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: d }} />
                ))}
              </div>
              Building Your Roadmap…
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate Study Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PlanCreator;
