import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import GlobalTooltip from './components/ui/GlobalTooltip';
import { ImageFile, CullingSuggestions, Orientation } from './components/ui/AppProperties';
import { ContextProviders, useAppState } from './context/ContextProviders';
import { useSortedImageList } from './hooks/useSortedImageList';
import { useHandlers } from './hooks/useHandlers';
import { useGlobalEffects } from './hooks/useGlobalEffects';
import Modals from './window/modals/Modals';
import clsx from 'clsx';
import LibraryExportPanel from './components/panel/right/LibraryExportPanel';
import Resizer from './components/ui/Resizer';
import MainView from './window/MainView';
import { MemoizedFolderTree } from './window/MemoizedFolderTree';
import TitleBar from './window/TitleBar';

export interface CollapsibleSectionsState {
  basic: boolean;
  color: boolean;
  curves: boolean;
  details: boolean;
  effects: boolean;
}

export interface ConfirmModalState {
  confirmText?: string;
  confirmVariant?: string;
  isOpen: boolean;
  message?: string;
  onConfirm?(): void;
  title?: string;
}

export interface MultiSelectOptions {
  onSimpleClick(p: any): void;
  updateLibraryActivePath: boolean;
  shiftAnchor: string | null;
}

export interface CollageModalState {
  isOpen: boolean;
  sourceImages: ImageFile[];
}

export interface PanoramaModalState {
  error: string | null;
  finalImageBase64: string | null;
  isOpen: boolean;
  progressMessage: string | null;
  stitchingSourcePaths: Array<string>;
}

export interface HdrModalState {
  error: string | null;
  finalImageBase64: string | null;
  isOpen: boolean;
  progressMessage: string | null;
  stitchingSourcePaths: Array<string>;
}

export interface DenoiseModalState {
  isOpen: boolean;
  isProcessing: boolean;
  previewBase64: string | null;
  originalBase64?: string | null;
  error: string | null;
  targetPath: string | null;
  progressMessage: string | null;
}

export interface NegativeConversionModalState {
  isOpen: boolean;
  targetPath: string | null;
}

export interface CullingModalState {
  isOpen: boolean;
  suggestions: CullingSuggestions | null;
  progress: { current: number; total: number; stage: string } | null;
  error: string | null;
  pathsToCull: Array<string>;
}

export interface SearchCriteria {
  tags: string[];
  text: string;
  mode: 'AND' | 'OR';
}

function App() {
  const {
    selectedImage,
    appSettings,
    rootPath,
    isWindowFullScreen,
    isLayoutReady,
    multiSelectedPaths,
    setMultiSelectedPaths,
    libraryActivePath,
    setLibraryActivePath,
    setShowOriginal,
    isViewLoading,
    setIsWaveformVisible,
    isFullScreen,
    isAnimatingTheme,
    activeRightPanel,
    activeMaskContainerId,
    setActiveMaskContainerId,
    activeMaskId,
    setActiveMaskId,
    activeAiPatchContainerId,
    activeAiSubMaskId,
    setActiveAiSubMaskId,
    zoom,
    displaySize,
    baseRenderSize,
    originalSize,
    isLibraryExportPanelVisible,
    setIsLibraryExportPanelVisible,
    rightPanelWidth,
    setRightPanelWidth,
    isResizing,
    isStraightenActive,
    setIsStraightenActive,
    copiedFilePaths,
    setCopiedFilePaths,
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
    customEscapeHandler,
    thumbnails,
    history,
    isLightTheme,
    isAnyModalOpen,
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
    exportState,
    isCopyPasteSettingsModalOpen,
    setExportState,
  } = useAppState();

  const { sortedImageList } = useSortedImageList();

  const { canUndo, canRedo } = history;

  const {
    handleBackToLibrary,
    handleImageSelect,
    executeDelete,
    handleDeleteSelected,
    refreshImageList,
    undo,
    redo,
    handleDeleteMaskContainer,
    handleDeleteAiPatch,
    createResizeHandler,
    handleRightPanelSelect,
    handleSettingsChange,
    handleToggleFullScreen,
    handleCopyAdjustments,
    handlePasteAdjustments,
    handleRate,
    handleSetColorLabel,
    closeConfirmModal,
    handlePasteFiles,
    handleZoomChange,
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

  useGlobalEffects();

  useKeyboardShortcuts({
    isModalOpen: isAnyModalOpen,
    activeAiPatchContainerId,
    activeAiSubMaskId,
    activeMaskContainerId,
    activeMaskId,
    activeRightPanel,
    canRedo,
    canUndo,
    copiedFilePaths,
    customEscapeHandler,
    handleBackToLibrary,
    handleCopyAdjustments,
    handleDeleteAiPatch,
    handleDeleteMaskContainer,
    handleDeleteSelected,
    handleImageSelect,
    handlePasteAdjustments,
    handlePasteFiles,
    handleRate,
    handleRightPanelSelect,
    handleSetColorLabel,
    handleToggleFullScreen,
    handleZoomChange,
    isFullScreen,
    isStraightenActive,
    isViewLoading,
    libraryActivePath,
    multiSelectedPaths,
    redo,
    selectedImage,
    setActiveAiSubMaskId,
    setActiveMaskContainerId,
    setActiveMaskId,
    setCopiedFilePaths,
    setIsStraightenActive,
    setIsWaveformVisible,
    setLibraryActivePath,
    setMultiSelectedPaths,
    setShowOriginal,
    sortedImageList,
    undo,
    zoom,
    displaySize,
    baseRenderSize,
    originalSize,
  });

  return (
    <div
      className={clsx(
        'flex flex-col h-screen bg-bg-primary font-sans text-text-primary overflow-hidden select-none',
        (appSettings?.adaptiveEditorTheme || isAnimatingTheme) && 'enable-color-transitions',
      )}
    >
      <div
        className={clsx(
          'flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out z-50',
          isFullScreen ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[60px] opacity-100',
        )}
      >
        {appSettings?.decorations || (!isWindowFullScreen && <TitleBar />)}
      </div>
      <div
        className={clsx(
          'flex-1 flex flex-col min-h-0',
          isLayoutReady && rootPath && 'transition-all duration-300 ease-in-out',
          [
            rootPath && (isFullScreen ? 'p-0 gap-0' : 'p-2 gap-2'),
            !appSettings?.decorations && !isWindowFullScreen && !isFullScreen && (rootPath ? 'pt-12' : 'pt-10'),
          ],
        )}
      >
        <div className="flex flex-row flex-grow h-full min-h-0">
          <MemoizedFolderTree />
          <div className="flex-1 flex flex-col min-w-0">
            <MainView />
          </div>
          {!selectedImage && isLibraryExportPanelVisible && (
            <Resizer
              direction={Orientation.Vertical}
              onMouseDown={createResizeHandler(setRightPanelWidth, rightPanelWidth)}
            />
          )}
          <div
            className={clsx('flex-shrink-0 overflow-hidden', !isResizing && 'transition-all duration-300 ease-in-out')}
            style={{ width: isLibraryExportPanelVisible && !isFullScreen ? `${rightPanelWidth}px` : '0px' }}
          >
            <LibraryExportPanel
              exportState={exportState}
              imageList={sortedImageList}
              isVisible={isLibraryExportPanelVisible}
              multiSelectedPaths={multiSelectedPaths}
              onClose={() => setIsLibraryExportPanelVisible(false)}
              setExportState={setExportState}
              appSettings={appSettings}
              onSettingsChange={handleSettingsChange}
            />
          </div>
        </div>
      </div>
      <Modals />
    </div>
  );
}

const AppWrapper = () => (
  <ContextProviders>
    <App />
    <GlobalTooltip />
  </ContextProviders>
);

export default AppWrapper;
