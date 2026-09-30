const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/pages/RegistryView.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// We need to add the edit button next to the couple's name
const searchStr1 = `<h1 className="text-3xl sm:text-5xl font-extrabold text-[#2C1810] mb-4">
              {registry.couple_names}
            </h1>`;
const replaceStr1 = `<div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#2C1810] mr-4">
                {registry.couple_names}
              </h1>
              <button
                onClick={() => {
                  setEditForm(registry);
                  setEditOpen(true);
                }}
                className="p-2 bg-white rounded-full text-[#B8860B] hover:bg-[#FDFBF7] shadow-sm border border-[#E8DCC4] transition-colors"
                title="Edit Registry"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>`;

content = content.replace(searchStr1, replaceStr1);

// We need to add PencilIcon to the imports
if (!content.includes('PencilIcon')) {
    content = content.replace('TrashIcon } from "lucide-react";', 'TrashIcon, PencilIcon, ImageIcon } from "lucide-react";');
}

// And we need to add the picture management button
const searchStr2 = `<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button`;
const replaceStr2 = `<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowPicturesModal(true)}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white border-2 border-[#E8DCC4] text-[#B8860B] font-semibold rounded-xl hover:bg-[#FDFBF7] transition-colors shadow-sm"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Manage Pictures
              </button>
              <button`;

content = content.replace(searchStr2, replaceStr2);

// And we need to replace the delete confirm modal with all the original modals
// Find where the Custom Confirmation Modal for Item Deletion starts
const modalStart = content.indexOf('{/* Custom Confirmation Modal for Item Deletion */}');
const newModals = `{/* Edit Registry Modal */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <Dialog.Panel className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white rounded-3xl shadow-xl max-w-md w-full mx-auto p-6 sm:p-8 z-20 text-left overflow-hidden">
            <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-6">
              Edit Registry Details
            </Dialog.Title>
            <form onSubmit={handleUpdateRegistry} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Couple Names
                </label>
                <input
                  type="text"
                  value={editForm.couple_names || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      couple_names: e.target.value,
                    })
                  }
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={editForm.wedding_date?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      wedding_date: e.target.value,
                    })
                  }
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Story
                </label>
                <StoryBuilder
                  onApply={(storyText) =>
                    setEditForm({ ...editForm, story: storyText })
                  }
                />
                <textarea
                  value={editForm.story || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, story: e.target.value })
                  }
                  rows={4}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] mt-2"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Manage Pictures Modal */}
      <Dialog
        open={showPicturesModal}
        onClose={() => setShowPicturesModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <Dialog.Panel className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full mx-auto p-6 sm:p-8 z-20 text-left overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                Manage Wedding Pictures
              </Dialog.Title>
              <button onClick={() => setShowPicturesModal(false)}>
                <XIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Add New Picture
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-semibold file:bg-[#B8860B]/10 file:text-[#B8860B] hover:file:bg-[#B8860B]/20 transition-colors border border-gray-200 rounded-xl"
                />
                <button
                  onClick={handleAddPicture}
                  disabled={uploading || !selectedFile}
                  className="w-full sm:w-auto px-6 py-3 bg-[#B8860B] text-white font-semibold rounded-xl shadow-sm hover:bg-[#8B6508] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {pictures.map((picUrl, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={picUrl} alt="Wedding" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        setPictureToDelete(picUrl);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Picture Confirmation Modal */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <Dialog.Panel className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

          <div className="relative bg-white rounded-3xl shadow-xl max-w-sm w-full mx-auto p-6 sm:p-8 z-20 text-left overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>

            <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-2">
              Remove Picture?
            </Dialog.Title>
            <div className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to remove this picture from your registry? This action cannot be undone.
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                onClick={confirmDeletePicture}
              >
                Yes, Remove Picture
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default RegistryView;
`;

const newContent = content.substring(0, modalStart) + newModals;
fs.writeFileSync(filePath, newContent, 'utf-8');

console.log('RegistryView updated.');
