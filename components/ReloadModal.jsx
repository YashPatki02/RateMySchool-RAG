import React from 'react';

const ReloadModal = ({ showModal, handleCancel, handleReload }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Are you sure you want to reload?</h2>
        <p className="mb-4">You have unsaved changes that will be lost.</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleReload}
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReloadModal;
