import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResumeData } from '../../types';
import { analyzeResumeWithATS, AtsEvaluation } from '../../services/aiService';
import {
  FileText,
  Sparkles,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Award,
  BookOpen,
} from 'lucide-react';

export const ResumeBuilder: React.FC = () => {
  const { resume, updateResume, isDarkMode } = useApp();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [targetRole, setTargetRole] = useState('Software Development Engineer 1');
  const [targetCompany, setTargetCompany] = useState('Microsoft / Tier 1 Product');

  const [isScanning, setIsScanning] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsEvaluation | null>(
    resume.atsScore
      ? {
          atsScore: resume.atsScore,
          summary: resume.atsFeedback?.summary || '',
          matchedSkills: resume.atsFeedback?.matchedSkills || [],
          missingKeywords: resume.atsFeedback?.missingKeywords || [],
          actionVerbReview: resume.atsFeedback?.actionVerbReview || '',
          formattingAndSectionsScore: 90,
          topRecommendations: resume.atsFeedback?.topRecommendations || [],
        }
      : null
  );

  // Helper functions for array fields
  const handleAddProject = () => {
    updateResume({
      projects: [
        ...resume.projects,
        {
          id: `proj-${Date.now()}`,
          title: 'Full Stack Distributed Task Engine',
          techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          liveUrl: 'https://demo-task-engine.app',
          repoUrl: 'https://github.com/alexchen/task-engine',
          bullets: [
            'Architected distributed event queue processing 12k concurrent jobs with <20ms median latency.',
            'Containerized services using Docker and configured automated CI/CD deployment pipelines.',
          ],
        },
      ],
    });
  };

  const handleDeleteProject = (idx: number) => {
    const updated = [...resume.projects];
    updated.splice(idx, 1);
    updateResume({ projects: updated });
  };

  const handleAddExperience = () => {
    updateResume({
      experience: [
        ...resume.experience,
        {
          id: `exp-${Date.now()}`,
          company: 'Cloud Innovations Lab',
          title: 'Software Development Intern',
          location: 'Bengaluru, India',
          startDate: 'Jan 2026',
          endDate: 'Present',
          bullets: [
            'Collaborated with core engineering team to migrate legacy REST endpoints to typed GraphQL schema.',
            'Optimized database index query plans, reducing average API response latency by 28%.',
          ],
        },
      ],
    });
  };

  const handleDeleteExperience = (idx: number) => {
    const updated = [...resume.experience];
    updated.splice(idx, 1);
    updateResume({ experience: updated });
  };

  const handleScanATS = async () => {
    setIsScanning(true);
    try {
      const serializedResume = `
        ${resume.personal.fullName} - ${resume.personal.summary}
        Skills: ${resume.skills.map((s) => s.items.join(', ')).join(', ')}
        Experience: ${resume.experience.map((e) => `${e.title} at ${e.company}: ${e.bullets.join(' ')}`).join('\n')}
        Projects: ${resume.projects.map((p) => `${p.title} (${p.techStack.join(', ')}): ${p.bullets.join(' ')}`).join('\n')}
      `;

      const result = await analyzeResumeWithATS({
        resumeText: serializedResume,
        targetRole,
        targetCompany,
      });

      setAtsResult(result);
      updateResume({
        atsScore: result.atsScore,
        atsFeedback: {
          summary: result.summary,
          matchedSkills: result.matchedSkills,
          missingKeywords: result.missingKeywords,
          actionVerbReview: result.actionVerbReview,
          topRecommendations: result.topRecommendations,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            ATS Resume Builder & Real-Time Keyword Scanner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-page tech resume builder compliant with Fortune 500 applicant tracking systems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded cursor-pointer font-semibold ${
                activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resume Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded cursor-pointer font-semibold ${
                activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ATS Preview
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* ATS Scanner Bar */}
      <div className={`p-4 rounded-xl border ${cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-1">Target Engineering Role:</span>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. SDE 1 (Full Stack)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 outline-none"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-1">Target Tier / Company:</span>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft, Tier 1"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          <button
            id="run-ats-scan-btn"
            disabled={isScanning}
            onClick={handleScanATS}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:opacity-90 text-white text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Run AI ATS Scan</span>
              </>
            )}
          </button>
        </div>

        {/* ATS Scan Result Summary */}
        {atsResult && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">ATS Match Score:</span>
                <span className="text-xl font-extrabold text-emerald-400">
                  {atsResult.atsScore} / 100
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  {atsResult.atsScore >= 80 ? 'Highly Competitive' : 'Needs Optimization'}
                </span>
              </div>
            </div>

            <p className="text-slate-300 italic">{atsResult.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
                <span className="font-bold text-emerald-400 block mb-1">
                  Matching Found Keywords:
                </span>
                <div className="flex flex-wrap gap-1">
                  {atsResult.matchedSkills.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/30">
                <span className="font-bold text-rose-400 block mb-1">
                  Missing High-Value Keywords:
                </span>
                <div className="flex flex-wrap gap-1">
                  {atsResult.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-medium"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-300 block">AI Resume Recommendations:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                {atsResult.topRecommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* View 1: Editor Form */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Personal & Education & Skills */}
          <div className="space-y-4 text-xs">
            {/* Personal Details */}
            <div className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
              <h3 className="font-bold text-sm text-slate-100">Personal & Contact Info</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personal.fullName}
                    onChange={(e) =>
                      updateResume({
                        personal: { ...resume.personal, fullName: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.personal.email}
                    onChange={(e) =>
                      updateResume({
                        personal: { ...resume.personal, email: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume.personal.phone}
                    onChange={(e) =>
                      updateResume({
                        personal: { ...resume.personal, phone: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={resume.personal.linkedin}
                    onChange={(e) =>
                      updateResume({
                        personal: { ...resume.personal, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Professional Summary</label>
                <textarea
                  rows={2}
                  value={resume.personal.summary}
                  onChange={(e) =>
                    updateResume({
                      personal: { ...resume.personal, summary: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none resize-none"
                />
              </div>
            </div>

            {/* Education */}
            <div className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
              <h3 className="font-bold text-sm text-slate-100">Education Details</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-slate-400 block mb-1">Degree & Major</label>
                  <input
                    type="text"
                    value={resume.education[0]?.degree || ''}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[0] = { ...updated[0], degree: e.target.value };
                      updateResume({ education: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={resume.education[0]?.institution || ''}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[0] = { ...updated[0], institution: e.target.value };
                      updateResume({ education: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-slate-400 block mb-1">CGPA</label>
                    <input
                      type="text"
                      value={resume.education[0]?.cgpa || ''}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[0] = { ...updated[0], cgpa: e.target.value };
                        updateResume({ education: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={resume.education[0]?.endYear || ''}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[0] = { ...updated[0], endYear: e.target.value };
                        updateResume({ education: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
              <h3 className="font-bold text-sm text-slate-100">Technical Skill Categories</h3>
              {resume.skills.map((cat, idx) => (
                <div key={idx}>
                  <label className="text-slate-400 block mb-1 font-semibold">{cat.category}</label>
                  <input
                    type="text"
                    value={cat.items.join(', ')}
                    onChange={(e) => {
                      const updated = [...resume.skills];
                      updated[idx] = {
                        ...cat,
                        items: e.target.value.split(',').map((s) => s.trim()),
                      };
                      updateResume({ skills: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Projects & Internships */}
          <div className="space-y-4 text-xs">
            {/* Projects Section */}
            <div className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-100">Projects</h3>
                <button
                  onClick={handleAddProject}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              <div className="space-y-3">
                {resume.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-3 rounded-lg border border-slate-700/60 bg-slate-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[idx] = { ...proj, title: e.target.value };
                          updateResume({ projects: updated });
                        }}
                        className="font-semibold text-slate-100 bg-transparent border-b border-slate-700 outline-none pb-0.5 flex-1 mr-2"
                      />
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        className="text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Tech stack (comma separated)"
                      value={proj.techStack.join(', ')}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[idx] = { ...proj, techStack: e.target.value.split(',').map((s) => s.trim()) };
                        updateResume({ projects: updated });
                      }}
                      className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Bullet point impact statement..."
                      value={proj.bullets.join('\n')}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[idx] = { ...proj, bullets: e.target.value.split('\n') };
                        updateResume({ projects: updated });
                      }}
                      className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-100">Internship & Experience</h3>
                <button
                  onClick={handleAddExperience}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </div>

              <div className="space-y-3">
                {resume.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-3 rounded-lg border border-slate-700/60 bg-slate-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={exp.company}
                          placeholder="Company"
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[idx] = { ...exp, company: e.target.value };
                            updateResume({ experience: updated });
                          }}
                          className="font-semibold text-slate-100 bg-transparent border-b border-slate-700 outline-none pb-0.5"
                        />
                        <input
                          type="text"
                          value={exp.title}
                          placeholder="Role"
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[idx] = { ...exp, title: e.target.value };
                            updateResume({ experience: updated });
                          }}
                          className="text-slate-300 bg-transparent border-b border-slate-700 outline-none pb-0.5"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteExperience(idx)}
                        className="text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Duration (e.g. Jan 2026 - Present)"
                        value={`${exp.startDate} - ${exp.endDate}`}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx] = { ...exp, startDate: e.target.value, endDate: '' };
                          updateResume({ experience: updated });
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx] = { ...exp, location: e.target.value };
                          updateResume({ experience: updated });
                        }}
                        className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 outline-none"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Bullet points (one per line)..."
                      value={exp.bullets.join('\n')}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[idx] = { ...exp, bullets: e.target.value.split('\n') };
                        updateResume({ experience: updated });
                      }}
                      className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: ATS Document Paper Preview */}
      {activeTab === 'preview' && (
        <div className="max-w-3xl mx-auto p-8 bg-white text-black shadow-2xl rounded-lg font-serif border border-slate-300 text-xs space-y-4">
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-black">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
              {resume.personal.fullName}
            </h1>
            <p className="text-[11px] text-gray-700 font-sans">
              {resume.personal.phone} | {resume.personal.email} |{' '}
              <a href={resume.personal.linkedin} target="_blank" rel="noreferrer" className="underline">
                LinkedIn
              </a>{' '}
              |{' '}
              <a href={resume.personal.github} target="_blank" rel="noreferrer" className="underline">
                GitHub
              </a>{' '}
              | {resume.personal.location}
            </p>
          </div>

          {/* Education */}
          <div className="space-y-1.5">
            <h2 className="font-bold text-xs uppercase tracking-wider border-b border-gray-400 pb-0.5 font-sans">
              Education
            </h2>
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <span className="font-bold">{edu.institution}</span>
                  <div className="italic text-[11px]">{edu.degree} in {edu.field}</div>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[11px]">{edu.startYear} – {edu.endYear}</span>
                  <div className="font-bold text-[11px]">CGPA: {edu.cgpa}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="space-y-1">
            <h2 className="font-bold text-xs uppercase tracking-wider border-b border-gray-400 pb-0.5 font-sans">
              Technical Skills
            </h2>
            <div className="text-[11px] space-y-0.5">
              {resume.skills.map((skillCat, idx) => (
                <p key={idx}>
                  <span className="font-bold">{skillCat.category}:</span> {skillCat.items.join(', ')}
                </p>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs uppercase tracking-wider border-b border-gray-400 pb-0.5 font-sans">
              Professional Experience
            </h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span>
                    {exp.title} – <span className="font-normal">{exp.company}</span>
                  </span>
                  <span className="text-[11px] font-normal">{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-2 text-gray-800">
                  {exp.bullets.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <h2 className="font-bold text-xs uppercase tracking-wider border-b border-gray-400 pb-0.5 font-sans">
              Academic & SDE Projects
            </h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{proj.title}</span>
                  <span className="text-[10px] text-gray-600 font-sans italic">{proj.techStack.join(', ')}</span>
                </div>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-2 text-gray-800">
                  {proj.bullets.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
