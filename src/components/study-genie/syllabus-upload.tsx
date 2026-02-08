'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, ArrowLeft } from 'lucide-react';
import { studyGenieBackend } from '@/services/studygenie-backend';
import AppShell from '@/components/ui/AppShell';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

interface SyllabusUploadProps {
  onUpload: (data: any) => void;
  onNavigate: (view: string) => void;
}

export default function SyllabusUpload({ onUpload, onNavigate }: SyllabusUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Use Next.js API proxy route to avoid CORS and connection issues
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('[Upload] Raw backend response:', data);
      
      // Transform backend response to match our app's format
      let transformedData: any = null;
      
      // Backend returns: { skill_map: { skill_map: [...], total_topics: N }, quiz: {...}, interview_qa: {...} }
      if (data.skill_map) {
        // Check if skill_map is an object with nested skill_map array
        const skillMapData = typeof data.skill_map === 'object' && 'skill_map' in data.skill_map
          ? data.skill_map
          : { skill_map: Array.isArray(data.skill_map) ? data.skill_map : [], total_topics: 0 };
        
        if (skillMapData.skill_map && Array.isArray(skillMapData.skill_map) && skillMapData.skill_map.length > 0) {
          transformedData = studyGenieBackend.transformSkillMapToUnits(skillMapData);
          console.log('[Upload] ✅ Transformed syllabus:', {
            curriculum: transformedData.curriculum,
            units: transformedData.units?.length || 0,
            totalTopics: transformedData.units?.reduce((sum: number, u: any) => sum + (u.topics?.length || 0), 0) || 0
          });
        } else {
          console.error('[Upload] ❌ Invalid skill_map structure:', skillMapData);
          throw new Error('Backend returned empty or invalid skill map');
        }
      } else if (data.units && Array.isArray(data.units)) {
        // Already in correct format, but ensure all topics have required fields
        transformedData = {
          curriculum: data.curriculum || data.title || 'AI-Generated Curriculum',
          units: data.units.map((unit: any) => ({
            ...unit,
            id: unit.id || unit.name || `unit-${unit.name}`,
            name: unit.name || unit.title || 'Unit',
            topics: (unit.topics || []).map((topic: any, idx: number) => ({
              ...topic,
              id: topic.id || `${unit.id || unit.name}-${idx + 1}`,
              name: topic.name || topic.title || `Topic ${idx + 1}`,
              difficulty: topic.difficulty || 'Medium',
            }))
          }))
        };
        console.log('[Upload] ✅ Processed syllabus:', {
          curriculum: transformedData.curriculum,
          units: transformedData.units.length,
          totalTopics: transformedData.units.reduce((sum: number, u: any) => sum + (u.topics?.length || 0), 0)
        });
      } else {
        console.error('[Upload] ❌ Unknown data format:', data);
        throw new Error('Backend returned data in unknown format');
      }
      
      if (!transformedData || !transformedData.units || transformedData.units.length === 0) {
        throw new Error('No units or topics found in syllabus data');
      }
      
      onUpload(transformedData);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload syllabus.';
      
      // Provide helpful error messages
      if (errorMessage.includes('connect') || errorMessage.includes('refused') || errorMessage.includes('Failed to fetch')) {
        alert('⚠️ Backend is not running.\n\nPlease start the Flask backend:\n1. Open a terminal\n2. Navigate to studygenie-ai folder\n3. Run: python -m app.main\n\nOr check BACKEND_SETUP.md for detailed instructions.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('cold')) {
        alert('⏰ Backend is starting up (cold start).\n\nPlease wait 30-60 seconds and try again.\n\nThis is normal for Render free tier deployments.');
      } else {
        alert(`Failed to upload syllabus: ${errorMessage}\n\nPlease check:\n1. Backend is running (http://localhost:5000)\n2. Backend URL is correct in .env.local\n3. See BACKEND_SETUP.md for setup instructions`);
      }
      
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } } as any);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <AppShell
      navProps={{
        showBack: true,
        onBack: () => onNavigate('landing'),
      }}
    >
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#61210F' }}>
              Upload Your Syllabus
            </h1>
            <p className="text-base" style={{ color: '#6B7280' }}>
              Upload your course material and we'll generate your personalized learning path
            </p>
          </div>

          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="bg-white rounded-[1.5rem] p-12 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border-2 border-dashed border-gray-300 hover:border-[#3FDFD5] transition-all text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#3FDFD5] border-t-transparent animate-spin" />
                <p className="text-base font-medium" style={{ color: '#61210F' }}>
                  Analyzing your syllabus...
                </p>
                <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      background: 'linear-gradient(90deg, #3FDFD5, #61210F)',
                    }}
                  />
                </div>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {uploadProgress}% complete
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#3FDFD520' }}>
                  <Upload size={32} style={{ color: '#3FDFD5' }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: '#61210F' }}>
                  Drop your syllabus here
                </h2>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  or click to select (PDF, TXT, MD)
                </p>
                <div className="flex items-center justify-center gap-4 text-sm" style={{ color: '#6B7280' }}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>Extract units & topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Generate skill tree</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <SecondaryButton onClick={() => onNavigate('landing')}>
              Cancel
            </SecondaryButton>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
