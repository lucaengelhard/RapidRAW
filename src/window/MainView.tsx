import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import BottomBar from '../components/panel/BottomBar';
import Editor from '../components/panel/Editor';
import AIPanel from '../components/panel/right/AIPanel';
import Controls from '../components/panel/right/ControlsPanel';
import CropPanel from '../components/panel/right/CropPanel';
import ExportPanel from '../components/panel/right/ExportPanel';
import MasksPanel from '../components/panel/right/MasksPanel';
import MetadataPanel from '../components/panel/right/MetadataPanel';
import PresetsPanel from '../components/panel/right/PresetsPanel';
import RightPanelSwitcher from '../components/panel/right/RightPanelSwitcher';
import { Orientation, UiVisibility, Panel } from '../components/ui/AppProperties';
import Resizer from '../components/ui/Resizer';
import { useAppState } from '../context/ContextProviders';
import { useHandlers } from '../hooks/useHandlers';
import { useSortedImageList } from '../hooks/useSortedImageList';
import { MemoizedLibraryView } from './MemoizedLibraryView';

export default function MainView() {
  const {
    selectedImage,
    activeAiPatchContainerId,
    activeAiSubMaskId,
    activeMaskContainerId,
    activeMaskId,
    activeRightPanel,
    adjustments,
    brushSettings,
    isFullScreen,
    isStraightenActive,
    setActiveAiSubMaskId,
    setActiveMaskId,
    renderedRightPanel,
    isWbPickerActive,
    overlayMode,
    overlayRotation,
    isResizing,
    setBottomPanelHeight,
    bottomPanelHeight,
    copiedAdjustments,
    multiSelectedPaths,
    setRightPanelWidth,
    rightPanelWidth,
    slideDirection,
    collapsibleSectionsState,
    copiedSectionAdjustments,
    histogram,
    setCollapsibleSectionsState,
    setCopiedSectionAdjustments,
    theme,
    appSettings,
    setIsSliderDragging,
    imageList,
    setIsStraightenActive,
    setIsRotationActive,
    setOverlayRotation,
    setOverlayMode,
    aiModelDownloadStatus,
    copiedMask,
    isGeneratingAiMask,
    setActiveMaskContainerId,
    setBrushSettings,
    setCopiedMask,
    setCustomEscapeHandler,
    setIsMaskControlHovered,
    setActiveView,
    exportState,
    setExportState,
    isAIConnectorConnected,
    isGeneratingAi,
    setActiveAiPatchContainerId,
  } = useAppState();

  const {
    handleBackToLibrary,
    setAdjustments,
    createResizeHandler,
    handleRate,
    handleAutoAdjustments,
    handleLutSelect,
    toggleWbPicker,
    handleSetColorLabel,
    handleTagsChanged,
    handleGenerateAiForegroundMask,
    handleGenerateAiSkyMask,
    handleSettingsChange,
    handleDeleteAiPatch,
    handleGenerativeReplace,
    handleToggleAiPatchVisibility,
    handleRightPanelSelect,
  } = useHandlers();

  const { sortedImageList } = useSortedImageList();

  const panelVariants: any = {
    animate: (direction: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: direction === 0 ? 0 : 0.2, ease: 'circOut' },
    }),
    exit: (direction: number) => ({
      opacity: direction === 0 ? 1 : 0.2,
      y: direction === 0 ? 0 : direction > 0 ? -20 : 20,
      transition: { duration: direction === 0 ? 0 : 0.1, ease: 'circIn' },
    }),
    initial: (direction: number) => ({
      opacity: direction === 0 ? 1 : 0.2,
      y: direction === 0 ? 0 : direction > 0 ? 20 : -20,
    }),
  };

  if (selectedImage) {
    return (
      <div className="flex flex-row flex-grow h-full min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <Editor />
          <div
            className={clsx(
              'flex flex-col w-full overflow-hidden flex-shrink-0',
              !isResizing && 'transition-all duration-300 ease-in-out',
            )}
            style={{
              maxHeight: isFullScreen ? '0px' : '500px',
              opacity: isFullScreen ? 0 : 1,
            }}
          >
            <Resizer
              direction={Orientation.Horizontal}
              onMouseDown={createResizeHandler(setBottomPanelHeight, bottomPanelHeight)}
            />
            <BottomBar
              isPasteDisabled={copiedAdjustments === null}
              isRatingDisabled={!selectedImage}
              isCopyDisabled={!selectedImage}
              rating={adjustments.rating || 0}
              totalImages={sortedImageList.length}
            />
          </div>
        </div>

        <div
          className={clsx(
            'flex h-full overflow-hidden flex-shrink-0',
            !isResizing && 'transition-all duration-300 ease-in-out',
          )}
          style={{
            maxWidth: isFullScreen ? '0px' : '1000px',
            opacity: isFullScreen ? 0 : 1,
          }}
        >
          <Resizer
            onMouseDown={createResizeHandler(setRightPanelWidth, rightPanelWidth)}
            direction={Orientation.Vertical}
          />
          <div className="flex bg-bg-secondary rounded-lg h-full">
            <div
              className={clsx('h-full overflow-hidden', !isResizing && 'transition-all duration-300 ease-in-out')}
              style={{ width: activeRightPanel ? `${rightPanelWidth}px` : '0px' }}
            >
              <div style={{ width: `${rightPanelWidth}px` }} className="h-full">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  {activeRightPanel && (
                    <motion.div
                      animate="animate"
                      className="h-full w-full"
                      custom={slideDirection}
                      exit="exit"
                      initial="initial"
                      key={renderedRightPanel}
                      variants={panelVariants}
                    >
                      {renderedRightPanel === Panel.Adjustments && (
                        <Controls
                          adjustments={adjustments}
                          collapsibleState={collapsibleSectionsState}
                          copiedSectionAdjustments={copiedSectionAdjustments}
                          handleAutoAdjustments={handleAutoAdjustments}
                          histogram={histogram}
                          selectedImage={selectedImage}
                          setAdjustments={setAdjustments}
                          setCollapsibleState={setCollapsibleSectionsState}
                          setCopiedSectionAdjustments={setCopiedSectionAdjustments}
                          theme={theme}
                          handleLutSelect={handleLutSelect}
                          appSettings={appSettings}
                          isWbPickerActive={isWbPickerActive}
                          toggleWbPicker={toggleWbPicker}
                          onDragStateChange={setIsSliderDragging}
                        />
                      )}
                      {renderedRightPanel === Panel.Metadata && (
                        <MetadataPanel
                          selectedImage={selectedImage}
                          rating={adjustments.rating || 0}
                          tags={imageList.find((img) => img.path === selectedImage.path)?.tags || []}
                          onRate={handleRate}
                          onSetColorLabel={handleSetColorLabel}
                          onTagsChanged={handleTagsChanged}
                          appSettings={appSettings}
                        />
                      )}
                      {renderedRightPanel === Panel.Crop && (
                        <CropPanel
                          adjustments={adjustments}
                          isStraightenActive={isStraightenActive}
                          selectedImage={selectedImage}
                          setAdjustments={setAdjustments}
                          setIsStraightenActive={setIsStraightenActive}
                          setIsRotationActive={setIsRotationActive}
                          overlayMode={overlayMode}
                          overlayRotation={overlayRotation}
                          setOverlayRotation={setOverlayRotation}
                          setOverlayMode={setOverlayMode}
                        />
                      )}
                      {renderedRightPanel === Panel.Masks && (
                        <MasksPanel
                          activeMaskContainerId={activeMaskContainerId}
                          activeMaskId={activeMaskId}
                          adjustments={adjustments}
                          aiModelDownloadStatus={aiModelDownloadStatus}
                          appSettings={appSettings}
                          brushSettings={brushSettings}
                          copiedMask={copiedMask}
                          histogram={histogram}
                          isGeneratingAiMask={isGeneratingAiMask}
                          onGenerateAiForegroundMask={handleGenerateAiForegroundMask}
                          onGenerateAiSkyMask={handleGenerateAiSkyMask}
                          onSelectContainer={setActiveMaskContainerId}
                          onSelectMask={setActiveMaskId}
                          selectedImage={selectedImage}
                          setAdjustments={setAdjustments}
                          setBrushSettings={setBrushSettings}
                          setCopiedMask={setCopiedMask}
                          setCustomEscapeHandler={setCustomEscapeHandler}
                          onDragStateChange={setIsSliderDragging}
                          setIsMaskControlHovered={setIsMaskControlHovered}
                        />
                      )}
                      {renderedRightPanel === Panel.Presets && (
                        <PresetsPanel
                          activePanel={activeRightPanel}
                          adjustments={adjustments}
                          selectedImage={selectedImage}
                          onNavigateToCommunity={() => {
                            handleBackToLibrary();
                            setActiveView('community');
                          }}
                          setAdjustments={setAdjustments}
                        />
                      )}
                      {renderedRightPanel === Panel.Export && (
                        <ExportPanel
                          adjustments={adjustments}
                          exportState={exportState}
                          multiSelectedPaths={multiSelectedPaths}
                          selectedImage={selectedImage}
                          setExportState={setExportState}
                          appSettings={appSettings}
                          onSettingsChange={handleSettingsChange}
                        />
                      )}
                      {renderedRightPanel === Panel.Ai && (
                        <AIPanel
                          activePatchContainerId={activeAiPatchContainerId}
                          activeSubMaskId={activeAiSubMaskId}
                          adjustments={adjustments}
                          aiModelDownloadStatus={aiModelDownloadStatus}
                          brushSettings={brushSettings}
                          isAIConnectorConnected={isAIConnectorConnected}
                          isGeneratingAi={isGeneratingAi}
                          isGeneratingAiMask={isGeneratingAiMask}
                          onDeletePatch={handleDeleteAiPatch}
                          onGenerateAiForegroundMask={handleGenerateAiForegroundMask}
                          onGenerativeReplace={handleGenerativeReplace}
                          onSelectPatchContainer={setActiveAiPatchContainerId}
                          onSelectSubMask={setActiveAiSubMaskId}
                          onTogglePatchVisibility={handleToggleAiPatchVisibility}
                          selectedImage={selectedImage}
                          setAdjustments={setAdjustments}
                          setBrushSettings={setBrushSettings}
                          setCustomEscapeHandler={setCustomEscapeHandler}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div
              className={clsx(
                'h-full border-l transition-colors',
                activeRightPanel ? 'border-surface' : 'border-transparent',
              )}
            >
              <RightPanelSwitcher activePanel={activeRightPanel} onPanelSelect={handleRightPanelSelect} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <MemoizedLibraryView />;
}
