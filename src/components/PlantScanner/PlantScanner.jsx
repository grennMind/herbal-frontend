import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Leaf, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PlantScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file,
          preview: e.target.result
        });
        setResults(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Image = await convertImageToBase64(selectedImage.file);
      
      const response = await fetch('http://localhost:5000/api/ai/plant-identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [base64Image],
          modifiers: ["crops_fast", "similar_images", "health_only", "disease_similar_images"],
          plant_details: ["common_names", "url", "name_authority", "wiki_description", "taxonomy"]
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.message || 'Failed to identify plant');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Plant identification error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Plant Scanner</h2>
        <p className="text-gray-600">
          Upload or capture an image of a plant to identify it and learn about its medicinal properties
        </p>
      </div>

      {!selectedImage ? (
        <div className="space-y-4">
          {/* Upload Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <Upload className="h-12 w-12 text-green-500 mb-4" />
              <span className="text-lg font-medium text-gray-700">Upload Image</span>
              <span className="text-sm text-gray-500 mt-1">Choose from gallery</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <Camera className="h-12 w-12 text-green-500 mb-4" />
              <span className="text-lg font-medium text-gray-700">Take Photo</span>
              <span className="text-sm text-gray-500 mt-1">Use camera</span>
            </motion.button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Tips for better results:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure good lighting and clear focus</li>
              <li>• Include leaves, flowers, or distinctive features</li>
              <li>• Avoid blurry or heavily filtered images</li>
              <li>• Take photos from multiple angles if possible</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={selectedImage.preview}
              alt="Selected plant"
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={resetScanner}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Leaf className="h-5 w-5 mr-2" />
                  Identify Plant
                </>
              )}
            </motion.button>

            <button
              onClick={resetScanner}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Choose Different Image
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-700 font-medium">Plant identified successfully!</span>
                </div>

                {results.suggestions && results.suggestions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Identification Results</h3>
                    {results.suggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {suggestion.plant_name}
                            </h4>
                            {suggestion.plant_details?.common_names && (
                              <p className="text-gray-600">
                                Common names: {suggestion.plant_details.common_names.join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {Math.round(suggestion.probability * 100)}% match
                          </span>
                        </div>

                        {suggestion.plant_details?.wiki_description && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                            <p className="text-gray-700 text-sm">
                              {suggestion.plant_details.wiki_description.citation}
                            </p>
                          </div>
                        )}

                        {suggestion.medicinal_uses && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Medicinal Uses</h5>
                            <div className="flex flex-wrap gap-2">
                              {suggestion.medicinal_uses.map((use, useIndex) => (
                                <span
                                  key={useIndex}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {suggestion.safety_info && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h5 className="font-medium text-yellow-900 mb-1">Safety Information</h5>
                            <p className="text-yellow-800 text-sm">{suggestion.safety_info}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={resetScanner}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Scan Another Plant
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PlantScanner;
