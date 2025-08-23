"use client"

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Define a type for the user object from the AuthContext
interface User {
  uid?: string;
  id?: string;
  username?: string;
}

export default function UploadPage() {
  const { user } = useAuth() as { user: User | null };

  const [templateName, setTemplateName] = useState<string>('');
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50000000) { // 50MB limit
        setMessage('File is too large. Max size is 50MB.');
        setTemplateFile(null);
        return;
      }
      setTemplateFile(file);
      setMessage('');
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!templateName.trim() || !templateFile) {
      setMessage('Please provide both a template name and a file.');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    setMessage('');

    try {
      const userId = user?.uid || user?.id;
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      // Create FormData to send both text and file data
      const formData = new FormData();
      formData.append('templateName', templateName.trim());
      formData.append('templateFile', templateFile);
      formData.append('userId', userId);

      const response = await fetch('/api/posters/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred during upload.');
      }

      setUploadStatus('success');
      setMessage('Template uploaded successfully! It will appear in your dashboard soon.');
      setTemplateName('');
      setTemplateFile(null);
    } catch (err: any) {
      setUploadStatus('error');
      setMessage(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Upload a New Template</h1>
        <p className="text-gray-400 mb-8">Upload your high-resolution, high-DPI templates for others to use.</p>

        <motion.form
          onSubmit={handleUpload}
          className="bg-[#111214] p-8 rounded-xl shadow-inner border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Template Name */}
          <div className="mb-6">
            <label htmlFor="templateName" className="block text-gray-300 font-semibold text-left mb-2">
              Template Name
            </label>
            <input
              type="text"
              id="templateName"
              value={templateName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTemplateName(e.target.value)}
              placeholder="e.g., 'Modern Business Flyer'"
              disabled={isUploading}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Template File */}
          <div className="mb-6">
            <label htmlFor="templateFile" className="block text-gray-300 font-semibold text-left mb-2">
              Template File (High-Res)
            </label>
            <div className="flex items-center justify-center w-full relative">
              <label
                htmlFor="templateFile"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
                  ${isUploading ? 'bg-gray-700 text-gray-500' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-400'}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudUpload size={48} />
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-center">SVG, PNG, JPG, or PDF (up to 50MB)</p>
                  {templateFile && (
                    <p className="mt-2 text-sm text-green-400 font-medium">Selected: {templateFile.name}</p>
                  )}
                </div>
              </label>
              <input
                id="templateFile"
                type="file"
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`text-center p-3 rounded-lg text-sm mb-4 font-medium
                  ${uploadStatus === 'error' ? 'bg-red-900/40 text-red-300' : 'bg-green-900/40 text-green-300'}`}
              >
                {message}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Upload Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isUploading || uploadStatus === 'success'}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${isUploading
                ? 'bg-blue-800 text-blue-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
              ${uploadStatus === 'success' ? 'bg-green-600 text-white cursor-not-allowed' : ''}
              ${uploadStatus === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : ''}`}
          >
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </motion.div>
              ) : uploadStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
                  exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                >
                  <CheckCircle size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <CloudUpload size={20} />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="ml-2">
              {isUploading ? 'Uploading...' : uploadStatus === 'success' ? 'Upload Complete!' : 'Upload Template'}
            </span>
          </motion.button>
        </motion.form>

        <p className="text-gray-600 mt-8 text-sm">
          <AlertTriangle size={16} className="inline-block mr-1 text-yellow-500" />
          For best results, please ensure your template files are at least 300 DPI.
        </p>
      </div>
    </div>
  );
}
