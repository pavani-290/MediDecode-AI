
import React from 'react';

const MedicalDisclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <i className="fas fa-exclamation-triangle text-amber-600 mt-1 mr-3"></i>
        <div>
          <h3 className="text-amber-800 font-bold text-sm uppercase tracking-wider">Clinical Notice</h3>
          <p className="text-amber-700 text-xs mt-1 leading-relaxed">
            The AI analysis of prescriptions or reports may contain errors. 
            Never start, stop, or change your medication dosage based on this app's output. 
            <strong>Always consult a qualified medical professional</strong> for any medical advice or treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
