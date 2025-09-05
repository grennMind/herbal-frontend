import { useState } from 'react';
import { Search, Plus, X, Stethoscope, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState({
    age: '',
    sex: 'male'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Common symptoms for quick selection
  const commonSymptoms = [
    { id: 's_21', name: 'Headache', choice_id: 'present' },
    { id: 's_98', name: 'Fever', choice_id: 'present' },
    { id: 's_107', name: 'Cough', choice_id: 'present' },
    { id: 's_15', name: 'Fatigue', choice_id: 'present' },
    { id: 's_1', name: 'Abdominal pain', choice_id: 'present' },
    { id: 's_9', name: 'Nausea', choice_id: 'present' },
    { id: 's_13', name: 'Diarrhea', choice_id: 'present' },
    { id: 's_102', name: 'Runny nose', choice_id: 'present' },
    { id: 's_30', name: 'Sore throat', choice_id: 'present' },
    { id: 's_17', name: 'Dizziness', choice_id: 'present' }
  ];

  const addSymptom = (symptom) => {
    if (!symptoms.find(s => s.id === symptom.id)) {
      setSymptoms([...symptoms, symptom]);
    }
    setSearchTerm('');
  };

  const removeSymptom = (symptomId) => {
    setSymptoms(symptoms.filter(s => s.id !== symptomId));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/ai/symptom-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token
        },
        body: JSON.stringify({
          symptoms: symptoms,
          age: parseInt(userInfo.age) || 30,
          sex: userInfo.sex
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.message || 'Failed to analyze symptoms');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Symptom analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetChecker = () => {
    setSymptoms([]);
    setResults(null);
    setError(null);
    setSearchTerm('');
  };

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !symptoms.find(s => s.id === symptom.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Stethoscope className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Symptom Checker</h2>
        <p className="text-gray-600">
          Describe your symptoms to get potential conditions and herbal remedy suggestions
        </p>
      </div>

      {!results ? (
        <div className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={userInfo.age}
                onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                placeholder="Enter your age"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sex
              </label>
              <select
                value={userInfo.sex}
                onChange={(e) => setUserInfo({...userInfo, sex: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Symptom Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search and add symptoms
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search symptoms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtered Symptoms */}
            {searchTerm && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                {filteredSymptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => addSymptom(symptom)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{symptom.name}</span>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Common Symptoms */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Common Symptoms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {commonSymptoms.filter(s => !symptoms.find(selected => selected.id === s.id)).map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => addSymptom(symptom)}
                  className="p-3 text-sm border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Symptoms */}
          {symptoms.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <motion.div
                    key={symptom.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-full"
                  >
                    <span className="text-sm">{symptom.name}</span>
                    <button
                      onClick={() => removeSymptom(symptom.id)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

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
              onClick={analyzeSymptoms}
              disabled={isAnalyzing || symptoms.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Check Symptoms
                </>
              )}
            </motion.button>

            {symptoms.length > 0 && (
              <button
                onClick={resetChecker}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Medical Disclaimer</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  This tool is for informational purposes only and should not replace professional medical advice. 
                  Always consult with a healthcare provider for proper diagnosis and treatment.
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
            <span className="text-green-700 font-medium">Analysis completed successfully!</span>
          </div>

          {/* Results */}
          {results.conditions && results.conditions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Possible Conditions</h3>
              {results.conditions.slice(0, 5).map((condition, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {condition.name}
                    </h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {Math.round(condition.probability * 100)}% match
                    </span>
                  </div>

                  {condition.herbal_remedies && condition.herbal_remedies.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Suggested Herbal Remedies</h5>
                      <div className="flex flex-wrap gap-2">
                        {condition.herbal_remedies.map((remedy, remedyIndex) => (
                          <span
                            key={remedyIndex}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {remedy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {condition.recommended_products && condition.recommended_products.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Recommended Products</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {condition.recommended_products.map((product, productIndex) => (
                          <div key={productIndex} className="p-3 border border-gray-100 rounded-lg">
                            <h6 className="font-medium text-gray-800">{product.name}</h6>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <span className="text-green-600 font-medium">${product.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">
              {results.disclaimer}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={resetChecker}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Check New Symptoms
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

export default SymptomChecker;
