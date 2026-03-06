import clsx from 'clsx';
import { ToastContainer, Slide } from 'react-toastify';
import CollageModal from '../components/modals/CollageModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import CopyPasteSettingsModal from '../components/modals/CopyPasteSettingsModal';
import CreateFolderModal from '../components/modals/CreateFolderModal';
import CullingModal from '../components/modals/CullingModal';
import DenoiseModal from '../components/modals/DenoiseModal';
import HdrModal from '../components/modals/HdrModal';
import ImportSettingsModal from '../components/modals/ImportSettingsModal';
import NegativeConversionModal from '../components/modals/NegativeConversionModal';
import PanoramaModal from '../components/modals/PanoramaModal';
import RenameFileModal from '../components/modals/RenameFileModal';
import RenameFolderModal from '../components/modals/RenameFolderModal';
import { AppSettings } from '../components/ui/AppProperties';
import { useAppState } from '../context/ContextProviders';
import { useHandlers } from '../hooks/useHandlers';
import { useSortedImageList } from '../hooks/useSortedImageList';
import { CopyPasteSettings } from '../utils/adjustments';

export default function Modals() {
  const {
    selectedImage,
    appSettings,
    setIsCreateFolderModalOpen,
    setIsRenameFolderModalOpen,
    setIsRenameFileModalOpen,
    setIsImportModalOpen,
    setIsCopyPasteSettingsModalOpen,
    importSourcePaths,
    folderActionTarget,
    confirmModalState,
    setPanoramaModalState,
    setHdrModalState,
    negativeModalState,
    setNegativeModalState,
    setDenoiseModalState,
    setCullingModalState,
    setCollageModalState,
    thumbnails,
    isLightTheme,
    collageModalState,
    cullingModalState,
    isImportModalOpen,
    renameTargetPaths,
    denoiseModalState,
    isRenameFileModalOpen,
    isRenameFolderModalOpen,
    isCreateFolderModalOpen,
    hdrModalState,
    panoramaModalState,
    isCopyPasteSettingsModalOpen,
  } = useAppState();

  const {
    handleImageSelect,
    executeDelete,
    refreshImageList,
    handleSettingsChange,
    handleRate,
    handleSetColorLabel,
    closeConfirmModal,
    handleSavePanorama,
    handleSaveHdr,
    handleApplyDenoise,
    handleSaveDenoisedImage,
    handleSaveCollage,
    handleSaveRename,
    handleStartImport,
    handleCreateFolder,
    handleRenameFolder,
  } = useHandlers();

  return (
    <>
      <CopyPasteSettingsModal
        isOpen={isCopyPasteSettingsModalOpen}
        onClose={() => setIsCopyPasteSettingsModalOpen(false)}
        settings={appSettings?.copyPasteSettings as CopyPasteSettings}
        onSave={(newSettings) =>
          handleSettingsChange({ ...appSettings, copyPasteSettings: newSettings } as AppSettings)
        }
      />
      <PanoramaModal
        error={panoramaModalState.error}
        finalImageBase64={panoramaModalState.finalImageBase64}
        isOpen={panoramaModalState.isOpen}
        onClose={() =>
          setPanoramaModalState({
            isOpen: false,
            progressMessage: '',
            finalImageBase64: null,
            error: null,
            stitchingSourcePaths: [],
          })
        }
        onOpenFile={(path: string) => {
          handleImageSelect(path);
        }}
        onSave={handleSavePanorama}
        progressMessage={panoramaModalState.progressMessage}
      />
      <HdrModal
        error={hdrModalState.error}
        finalImageBase64={hdrModalState.finalImageBase64}
        isOpen={hdrModalState.isOpen}
        onClose={() =>
          setHdrModalState({
            isOpen: false,
            progressMessage: '',
            finalImageBase64: null,
            error: null,
            stitchingSourcePaths: [],
          })
        }
        onOpenFile={(path: string) => {
          handleImageSelect(path);
        }}
        onSave={handleSaveHdr}
        progressMessage={hdrModalState.progressMessage}
      />
      <NegativeConversionModal
        isOpen={negativeModalState.isOpen}
        onClose={() => setNegativeModalState((prev) => ({ ...prev, isOpen: false }))}
        selectedImagePath={negativeModalState.targetPath}
        onSave={(savedPath) => {
          refreshImageList().then(() => {
            if (selectedImage?.path === negativeModalState.targetPath) {
              handleImageSelect(savedPath);
            }
          });
        }}
      />
      <DenoiseModal
        isOpen={denoiseModalState.isOpen}
        onClose={() => setDenoiseModalState((prev) => ({ ...prev, isOpen: false }))}
        onDenoise={handleApplyDenoise}
        onSave={handleSaveDenoisedImage}
        onOpenFile={handleImageSelect}
        previewBase64={denoiseModalState.previewBase64}
        originalBase64={denoiseModalState.originalBase64 || null}
        isProcessing={denoiseModalState.isProcessing}
        error={denoiseModalState.error}
        progressMessage={denoiseModalState.progressMessage}
      />
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onSave={handleCreateFolder}
      />
      <RenameFolderModal
        currentName={folderActionTarget ? folderActionTarget.split(/[\\/]/).pop() : ''}
        isOpen={isRenameFolderModalOpen}
        onClose={() => setIsRenameFolderModalOpen(false)}
        onSave={handleRenameFolder}
      />
      <RenameFileModal
        filesToRename={renameTargetPaths}
        isOpen={isRenameFileModalOpen}
        onClose={() => setIsRenameFileModalOpen(false)}
        onSave={handleSaveRename}
      />
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
      <ImportSettingsModal
        fileCount={importSourcePaths.length}
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSave={handleStartImport}
      />
      <CullingModal
        isOpen={cullingModalState.isOpen}
        onClose={() =>
          setCullingModalState({ isOpen: false, progress: null, suggestions: null, error: null, pathsToCull: [] })
        }
        progress={cullingModalState.progress}
        suggestions={cullingModalState.suggestions}
        error={cullingModalState.error}
        imagePaths={cullingModalState.pathsToCull}
        thumbnails={thumbnails}
        onApply={(action, paths) => {
          if (action === 'reject') {
            handleSetColorLabel('red', paths);
          } else if (action === 'rate_zero') {
            handleRate(1, paths);
          } else if (action === 'delete') {
            executeDelete(paths, { includeAssociated: false });
          }
          setCullingModalState({ isOpen: false, progress: null, suggestions: null, error: null, pathsToCull: [] });
        }}
        onError={(err) => {
          setCullingModalState((prev) => ({ ...prev, error: err, progress: null }));
        }}
      />
      <CollageModal
        isOpen={collageModalState.isOpen}
        onClose={() => setCollageModalState({ isOpen: false, sourceImages: [] })}
        onSave={handleSaveCollage}
        sourceImages={collageModalState.sourceImages}
        thumbnails={thumbnails}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme={isLightTheme ? 'light' : 'dark'}
        transition={Slide}
        toastClassName={() =>
          clsx(
            'relative flex min-h-16 p-4 rounded-lg justify-between overflow-hidden cursor-pointer mb-4',
            '!bg-surface !text-text-primary !border !border-border-color !shadow-2xl !max-w-[420px]',
          )
        }
      />
    </>
  );
}
