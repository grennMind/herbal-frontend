import { useState } from 'react';
import { Brain, Sparkles, Loader2, AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendationEngine = () => {
  const [formData, setFormData] = useState({
    conditions: [],
    preferences: '',
    allergies: '',
    currentMedications: '',
    lifestyle: ''
  });
  const [conditionInput, setConditionInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const commonConditions = [
    'Stress and Anxiety',
    'Digestive Issues',
    'Sleep Problems',
    'Joint Pain',
    'Headaches',
    'Common Cold',
    'Fatigue',
    'Skin Issues',
    'High Blood Pressure',
    'Inflammation'
  ];

  const addCondition = (condition) => {
    if (!formData.conditions.includes(condition)) {
      setFormData({
        ...formData,
        conditions: [...formData.conditions, condition]
      });
    }
    setConditionInput('');
  };

  const removeCondition = (condition) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter(c => c !== condition)
    });
  };

  const generateRecommendations = async () => {
    if (formData.conditions.length === 0) {
      setError('Please add at least one health condition');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          conditions: formData.conditions,
          preferences: formData.preferences,
          allergies: formData.allergies,
          currentMedications: formData.currentMedications,
          lifestyle: formData.lifestyle
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.data);
      } else {
        setError(data.message || 'Failed to generate recommendations');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Recommendation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetEngine = () => {
    setFormData({
      conditions: [],
      preferences: '',
      allergies: '',
      currentMedications: '',
      lifestyle: ''
    });
    setConditionInput('');
    setRecommendations(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Recommendation Engine</h2>
        <p className="text-gray-600">
          Get personalized herbal remedy recommendations based on your health conditions and preferences
        </p>
      </div>

      {!recommendations ? (
        <div className="space-y-6">
          {/* Health Conditions */}
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-3">
              Health Conditions <span className="text-red-500">*</span>
            </label>
            
            {/* Add Custom Condition */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                placeholder="Type a health condition..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && conditionInput.trim()) {
                    addCondition(conditionInput.trim());
                  }
                }}
              />
              <button
                onClick={() => conditionInput.trim() && addCondition(conditionInput.trim())}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Common Conditions */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
              {commonConditions.filter(c => !formData.conditions.includes(c)).map((condition) => (
                <button
                  key={condition}
                  onClick={() => addCondition(condition)}
                  className="p-3 text-sm border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                >
                  {condition}
                </button>
              ))}
            </div>

            {/* Selected Conditions */}
            {formData.conditions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.conditions.map((condition) => (
                  <motion.div
                    key={condition}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center px-3 py-2 bg-purple-100 text-purple-800 rounded-full"
                  >
                    <span className="text-sm">{condition}</span>
                    <button
                      onClick={() => removeCondition(condition)}
                      className="ml-2 hover:text-purple-600"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferences
              </label>
              <textarea
                value={formData.preferences}
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                placeholder="e.g., prefer organic products, capsules over teas, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies & Sensitivities
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                placeholder="List any known allergies or sensitivities..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <textarea
                value={formData.currentMedications}
                onChange={(e) => setFormData({...formData, currentMedications: e.target.value})}
                placeholder="List current medications for interaction checking..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle Notes
              </label>
              <textarea
                value={formData.lifestyle}
                onChange={(e) => setFormData({...formData, lifestyle: e.target.value})}
                placeholder="Diet, exercise, stress levels, sleep patterns..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
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
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRecommendations}
              disabled={isGenerating || formData.conditions.length === 0}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Recommendations
                </>
              )}
            </motion.button>

            {formData.conditions.length > 0 && (
              <button
                onClick={resetEngine}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Reset Form
              </button>
            )}
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Important Notice</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  These AI-generated recommendations are for educational purposes only. Always consult with 
                  healthcare professionals before starting any herbal treatment, especially if you have 
                  existing medical conditions or take medications.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700 font-medium">
              Personalized recommendations generated successfully!
            </span>
          </div>

          {/* Recommendations */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Your Personalized Recommendations</h3>
            
            {recommendations.recommendations && (
              <div className="prose max-w-none">
                {typeof recommendations.recommendations === 'string' ? (
                  <div className="whitespace-pre-wrap text-gray-700">
                    {recommendations.recommendations}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.recommendations.map((rec, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          {rec.herb || rec.name}
                        </h4>
                        <p className="text-gray-700 mb-3">{rec.description}</p>
                        
                        {rec.benefits && (
                          <div className="mb-3">
                            <h5 className="font-medium text-gray-900 mb-2">Benefits</h5>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {rec.benefits.map((benefit, bIndex) => (
                                <li key={bIndex}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {rec.dosage && (
                          <div className="mb-3">
                            <h5 className="font-medium text-gray-900 mb-1">Recommended Dosage</h5>
                            <p className="text-gray-700">{rec.dosage}</p>
                          </div>
                        )}

                        {rec.products && rec.products.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Available Products</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {rec.products.map((product, pIndex) => (
                                <div key={pIndex} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                  <div>
                                    <h6 className="font-medium text-gray-800">{product.name}</h6>
                                    <p className="text-sm text-gray-600">{product.form}</p>
                                    <span className="text-green-600 font-medium">${product.price}</span>
                                  </div>
                                  <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                    <ShoppingCart className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Safety Notes */}
            {recommendations.safety_notes && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Safety Notes</h4>
                <p className="text-orange-800 text-sm">{recommendations.safety_notes}</p>
              </div>
            )}

            {/* Interactions */}
            {recommendations.interactions && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Potential Interactions</h4>
                <p className="text-red-800 text-sm">{recommendations.interactions}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-700 text-sm font-medium">
                {recommendations.disclaimer}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Generated on: {new Date(recommendations.generated_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={resetEngine}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Get New Recommendations
            </button>
            <button
              onClick={() => window.location.href = '/products'}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationEngine;
