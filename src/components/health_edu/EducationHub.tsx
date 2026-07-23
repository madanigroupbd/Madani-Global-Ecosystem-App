import React, { useState } from 'react';
import { EducationalResource } from '../../types';
import { GraduationCap, BookOpen, Video, Download, Search, Play, FileText, CheckCircle2, X } from 'lucide-react';

interface EducationHubProps {
  resources: EducationalResource[];
}

export const EducationHub: React.FC<EducationHubProps> = ({ resources }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReader, setActiveReader] = useState<EducationalResource | null>(null);

  const categories = [
    'ALL',
    'Islamic & Quran/Tafsir',
    'Software Engineering & Coding',
    'Science & Math',
    'Skill Development'
  ];

  const filtered = resources.filter((r) => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.authorOrInstructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            Free Educational Institution Hub & Billions Resource Digital Library
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full Tafsir, Quranic Arabic grammar, software engineering coding masterclasses, and national science textbooks — 100% free access.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-amber-300 font-bold">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          100K+ Video Courses & PDF Library
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedCategory === c
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search books, tafsir, coding..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {res.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono ${
                  res.format === 'PDF_BOOK'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-teal-950 text-teal-300 border border-teal-800'
                }`}>
                  {res.format === 'PDF_BOOK' ? 'PDF BOOK' : 'VIDEO COURSE'}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-100">{res.title}</h4>
              <p className="text-xs text-slate-400">
                Author / Instructor: <strong className="text-slate-200">{res.authorOrInstructor}</strong>
              </p>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 line-clamp-2">
                {res.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                {res.downloadCount.toLocaleString()} Downloads • {res.fileSizeOrDuration}
              </span>

              <button
                onClick={() => setActiveReader(res)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
              >
                {res.format === 'PDF_BOOK' ? <BookOpen className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {res.format === 'PDF_BOOK' ? 'Read / Download PDF' : 'Stream Video Masterclass'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal Simulation */}
      {activeReader && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {activeReader.format === 'PDF_BOOK' ? (
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Video className="w-5 h-5 text-teal-400" />
                )}
                <h4 className="font-bold text-base text-slate-100">{activeReader.title}</h4>
              </div>
              <button
                onClick={() => setActiveReader(null)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewer Simulation Screen */}
            <div className="bg-slate-950 rounded-xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[260px]">
              {activeReader.format === 'PDF_BOOK' ? (
                <>
                  <FileText className="w-12 h-12 text-emerald-400 animate-bounce" />
                  <div>
                    <h5 className="font-bold text-sm text-slate-200">Interactive PDF Reader Initialized</h5>
                    <p className="text-xs text-slate-400 max-w-md mt-1">
                      Full digital book rendering: {activeReader.title} by {activeReader.authorOrInstructor}.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => alert(`Downloaded full PDF archive (${activeReader.fileSizeOrDuration})`)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF ({activeReader.fileSizeOrDuration})
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full aspect-video bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                    <Play className="w-16 h-16 text-teal-400 group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-3 left-3 text-xs font-mono bg-black/60 px-2 py-0.5 rounded text-slate-300">
                      Duration: {activeReader.fileSizeOrDuration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Streaming 1080p Masterclass Lesson: {activeReader.title}
                  </p>
                </>
              )}
            </div>

            <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200 block mb-0.5">Ecosystem Guarantee:</strong>
              This educational resource is provided 100% free with zero advertisements as part of the Madani Global Education Initiative.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
