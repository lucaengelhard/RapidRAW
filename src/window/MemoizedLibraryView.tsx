import React from 'react';
import { useAppState } from '../context/ContextProviders';
import BottomBar from '../components/panel/BottomBar';
import CommunityPage from '../components/panel/CommunityPage';
import MainLibrary from '../components/panel/MainLibrary';
import { useHandlers } from '../hooks/useHandlers';
import { useSortedImageList } from '../hooks/useSortedImageList';
import { useThumbnails } from '../hooks/useThumbnails';

export const MemoizedLibraryView = React.memo(() => {
  const {
    activeView,
    setActiveView,
    supportedTypes,
    currentFolderPath,
    libraryActivePath,
    aiModelDownloadStatus,
    appSettings,
    filterCriteria,
    imageRatings,
    importState,
    indexingProgress,
    isIndexing,
    imageList,
    setThumbnails,
    isViewLoading,
    isTreeLoading,
    libraryScrollTop,
    libraryViewMode,
    multiSelectedPaths,
    setThumbnailAspectRatio,
    setThumbnailSize,
    rootPath,
    searchCriteria,
    setFilterCriteria,
    setLibraryScrollTop,
    setLibraryViewMode,
    setSearchCriteria,
    setSortCriteria,
    sortCriteria,
    theme,
    thumbnailAspectRatio,
    thumbnails,
    thumbnailSize,
    isCopied,
    isPasted,
    copiedAdjustments,
    setIsLibraryExportPanelVisible,
    setIsCopyPasteSettingsModalOpen,
    libraryActiveAdjustments,
  } = useAppState();

  const { sortedImageList } = useSortedImageList();

  const { loading: isThumbnailsLoading } = useThumbnails(imageList, setThumbnails);

  const {
    handleClearSelection,
    handleThumbnailContextMenu,
    handleContinueSession,
    handleMainLibraryContextMenu,
    handleGoHome,
    handleLibraryImageSingleClick,
    handleImageSelect,
    handleLibraryRefresh,
    handleOpenFolder,
    handleSettingsChange,
    handleCopyAdjustments,
    handlePasteAdjustments,
    handleRate,
    handleResetAdjustments,
  } = useHandlers();

  return (
    <div className="flex flex-row flex-grow h-full min-h-0">
      <div className="flex-1 flex flex-col min-w-0 gap-2">
        {activeView === 'community' ? (
          <CommunityPage
            onBackToLibrary={() => setActiveView('library')}
            supportedTypes={supportedTypes}
            imageList={sortedImageList}
            currentFolderPath={currentFolderPath}
          />
        ) : (
          <MainLibrary
            activePath={libraryActivePath}
            aiModelDownloadStatus={aiModelDownloadStatus}
            appSettings={appSettings}
            currentFolderPath={currentFolderPath}
            filterCriteria={filterCriteria}
            imageList={sortedImageList}
            imageRatings={imageRatings}
            importState={importState}
            indexingProgress={indexingProgress}
            isIndexing={isIndexing}
            isThumbnailsLoading={isThumbnailsLoading}
            isLoading={isViewLoading}
            isTreeLoading={isTreeLoading}
            libraryScrollTop={libraryScrollTop}
            libraryViewMode={libraryViewMode}
            multiSelectedPaths={multiSelectedPaths}
            onClearSelection={handleClearSelection}
            onContextMenu={handleThumbnailContextMenu}
            onContinueSession={handleContinueSession}
            onEmptyAreaContextMenu={handleMainLibraryContextMenu}
            onGoHome={handleGoHome}
            onImageClick={handleLibraryImageSingleClick}
            onImageDoubleClick={handleImageSelect}
            onLibraryRefresh={handleLibraryRefresh}
            onOpenFolder={handleOpenFolder}
            onSettingsChange={handleSettingsChange}
            onThumbnailAspectRatioChange={setThumbnailAspectRatio}
            onThumbnailSizeChange={setThumbnailSize}
            rootPath={rootPath}
            searchCriteria={searchCriteria}
            setFilterCriteria={setFilterCriteria}
            setLibraryScrollTop={setLibraryScrollTop}
            setLibraryViewMode={setLibraryViewMode}
            setSearchCriteria={setSearchCriteria}
            setSortCriteria={setSortCriteria}
            sortCriteria={sortCriteria}
            theme={theme}
            thumbnailAspectRatio={thumbnailAspectRatio}
            thumbnails={thumbnails}
            thumbnailSize={thumbnailSize}
            onNavigateToCommunity={() => setActiveView('community')}
          />
        )}
        {rootPath && (
          <BottomBar
            isLibraryView={true}
            isPasteDisabled={copiedAdjustments === null || multiSelectedPaths.length === 0}
            isRatingDisabled={multiSelectedPaths.length === 0}
            isResetDisabled={multiSelectedPaths.length === 0}
            onExportClick={() => setIsLibraryExportPanelVisible((prev) => !prev)}
            rating={libraryActiveAdjustments.rating || 0}
            totalImages={imageList.length}
          />
        )}
      </div>
    </div>
  );
});
