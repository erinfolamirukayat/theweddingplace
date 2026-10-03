import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "lucide-react";
import StoryBuilder from "./StoryBuilder";

interface EditRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  registry: any;
  onSave: (payload: any) => Promise<void>;
}

const EditRegistryModal: React.FC<EditRegistryModalProps> = ({
  isOpen,
  onClose,
  registry,
  onSave,
}) => {
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (registry) {
      setEditForm(registry);
    }
  }, [registry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(editForm);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold text-gray-900 mb-6"
                >
                  Edit Registry Details
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Couple Names
                    </label>
                    <input
                      type="text"
                      required
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
                      required
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
                      City of Ceremony (Optional)
                    </label>
                    <input
                      type="text"
                      value={editForm.wedding_city || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          wedding_city: e.target.value,
                        })
                      }
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      WhatsApp Phone Number (Optional)</label><input type="text" value={editForm.phone || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phone: e.target.value,
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
                      rows={4}
                      value={editForm.story || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          story: e.target.value,
                        })
                      }
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B]"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-[#B8860B] hover:bg-[#8B6508] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditRegistryModal;

