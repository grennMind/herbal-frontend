import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  X, 
  Plus, 
  Save, 
  Eye, 
  AlertCircle,
  CheckCircle,
  BookOpen,
  Leaf,
  Heart,
  Loader2
} from 'lucide-react';
import uploadService from '../../services/uploadService';

const ResearchPostForm = ({ post = null, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content: '',
    references: [],
    attachments: [],
    relatedHerbId: '',
    relatedDiseaseId: '',
    status: 'published'
  });
  
  const [herbs, setHerbs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newReference, setNewReference] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Load herbs and diseases for dropdowns
  useEffect(() => {
    fetchHerbsAndDiseases();
    if (post) {
      setFormData({
        title: post.title || '',
        abstract: post.abstract || '',
        content: post.content || '',
        references: post.references || [],
        attachments: post.attachments || [],
        relatedHerbId: post.relatedHerbId || '',
        relatedDiseaseId: post.relatedDiseaseId || '',
        status: post.status || 'published'
      });
    }
  }, [post]);

  const fetchHerbsAndDiseases = async () => {
    try {
      // Fetch herbs and diseases from your API
      // For now, using mock data - replace with actual API calls
      setHerbs([
        { id: '1', name: 'Turmeric', scientificName: 'Curcuma longa' },
        { id: '2', name: 'Ginger', scientificName: 'Zingiber officinale' },
        { id: '3', name: 'Echinacea', scientificName: 'Echinacea purpurea' },
        { id: '4', name: 'Chamomile', scientificName: 'Matricaria chamomilla' },
        { id: '5', name: 'Peppermint', scientificName: 'Mentha piperita' }
      ]);
      
      setDiseases([
        { id: '1', name: 'Inflammation' },
        { id: '2', name: 'Digestive Issues' },
        { id: '3', name: 'Stress and Anxiety' },
        { id: '4', name: 'Common Cold' },
        { id: '5', name: 'Insomnia' }
      ]);
    } catch (err) {
      console.error('Error fetching herbs and diseases:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addReference = () => {
    if (newReference.trim()) {
      setFormData(prev => ({
        ...prev,
        references: [...prev.references, newReference.trim()]
      }));
      setNewReference('');
    }
  };

  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      // Validate files
      for (const file of files) {
        uploadService.validateFile(file);
      }

      // Upload files one by one
      const uploadPromises = files.map(async (file) => {
        const tempId = Date.now() + Math.random();
        
        // Add to upload progress
        setUploadProgress(prev => ({
          ...prev,
          [tempId]: { status: 'uploading', progress: 0 }
        }));

        try {
          const result = await uploadService.uploadSingle(file);
          
          // Update progress to completed
          setUploadProgress(prev => ({
            ...prev,
            [tempId]: { status: 'completed', progress: 100 }
          }));

          return {
            id: tempId,
            name: result.filename,
            size: result.size,
            type: result.mimetype,
            url: result.url,
            publicId: result.publicId,
            uploadedAt: result.uploadedAt
          };
        } catch (uploadError) {
          // Update progress to error
          setUploadProgress(prev => ({
            ...prev,
            [tempId]: { status: 'error', progress: 0, error: uploadError.message }
          }));
          throw uploadError;
        }
      });

      const results = await Promise.all(uploadPromises);
      
      // Add successful uploads to the list
      setUploadedFiles(prev => [...prev, ...results]);
      
      // Clear upload progress
      setTimeout(() => {
        setUploadProgress({});
      }, 2000);

    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('Title and content are required');
      }

      // Prepare form data
      const submitData = {
        ...formData,
        attachments: uploadedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
          publicId: file.publicId,
          uploadedAt: file.uploadedAt
        }))
      };

      // Call the save function
      if (onSave) {
        await onSave(submitData);
        setSuccess(isEditing ? 'Research post updated successfully!' : 'Research post created successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to save research post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {isEditing ? 'Edit Research Post' : 'Create Research Post'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              Share your research findings with the community
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-300 flex items-start gap-2"
          >
            <CheckCircle className="h-5 w-5 mt-0.5" />
            <span>{success}</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-300 flex items-start gap-2"
          >
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Research Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
            placeholder="Enter your research title..."
          />
        </div>

        {/* Abstract */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Abstract
          </label>
          <textarea
            name="abstract"
            value={formData.abstract}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none"
            placeholder="Brief summary of your research (optional)..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Research Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={10}
            required
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none"
            placeholder="Describe your research findings, methodology, results, and conclusions..."
          />
        </div>

        {/* Related Herb and Disease */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Leaf className="inline h-4 w-4 mr-1" />
              Related Herb
            </label>
            <select
              name="relatedHerbId"
              value={formData.relatedHerbId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            >
              <option value="">Select a herb (optional)</option>
              {herbs.map(herb => (
                <option key={herb.id} value={herb.id}>
                  {herb.name} ({herb.scientificName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Heart className="inline h-4 w-4 mr-1" />
              Related Disease/Condition
            </label>
            <select
              name="relatedDiseaseId"
              value={formData.relatedDiseaseId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            >
              <option value="">Select a condition (optional)</option>
              {diseases.map(disease => (
                <option key={disease.id} value={disease.id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* References */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            <BookOpen className="inline h-4 w-4 mr-1" />
            References
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                placeholder="Add a reference (URL, citation, etc.)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addReference())}
              />
              <button
                type="button"
                onClick={addReference}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            
            {formData.references.length > 0 && (
              <div className="space-y-2">
                {formData.references.map((ref, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{ref}</span>
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-neutral-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            <Upload className="inline h-4 w-4 mr-1" />
            Attachments
          </label>
          <div className="space-y-3">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{uploadService.getFileIcon(file.type)}</span>
                      <div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block">{file.name}</span>
                        <span className="text-xs text-neutral-500">{uploadService.formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                          title="View file"
                        >
                          <Eye className="h-4 w-4 text-neutral-500" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                        title="Remove file"
                      >
                        <X className="h-4 w-4 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="space-y-2">
                {Object.entries(uploadProgress).map(([tempId, progress]) => (
                  <div key={tempId} className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {progress.status === 'uploading' && (
                        <Loader2 className="h-4 w-4 text-primary-500 animate-spin" />
                      )}
                      {progress.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {progress.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {progress.status === 'uploading' && 'Uploading...'}
                        {progress.status === 'completed' && 'Upload completed'}
                        {progress.status === 'error' && progress.error}
                      </span>
                    </div>
                    {progress.status === 'uploading' && (
                      <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Publication Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="under_review">Under Review</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? 'Update Research Post' : 'Create Research Post'}
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ResearchPostForm;
