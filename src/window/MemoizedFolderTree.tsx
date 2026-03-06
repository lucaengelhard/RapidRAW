import React from 'react';
import { useAppState } from '../context/ContextProviders';
import clsx from 'clsx';
import { UiVisibility, Orientation } from '../components/ui/AppProperties';
import Resizer from '../components/ui/Resizer';
import { useHandlers } from '../hooks/useHandlers';
import FolderTree from '../components/panel/FolderTree';

export const MemoizedFolderTree = React.memo(() => {
  const {
    rootPath,
    isResizing,
    isFullScreen,
    expandedFolders,
    isTreeLoading,
    uiVisibility,
    currentFolderPath,
    setUiVisibility,
    leftPanelWidth,
    folderTree,
    pinnedFolderTrees,
    pinnedFolders,
    activeTreeSection,
    appSettings,
    setLeftPanelWidth,
  } = useAppState();
  if (!rootPath) return <></>;

  const {
    handleFolderTreeContextMenu,
    handleSelectSubfolder,
    handleToggleFolder,
    handleActiveTreeSectionChange,
    createResizeHandler,
  } = useHandlers();

  return (
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
      <FolderTree
        expandedFolders={expandedFolders}
        isLoading={isTreeLoading}
        isResizing={isResizing}
        isVisible={uiVisibility.folderTree}
        onContextMenu={handleFolderTreeContextMenu}
        onFolderSelect={(path) => handleSelectSubfolder(path, false)}
        onToggleFolder={handleToggleFolder}
        selectedPath={currentFolderPath}
        setIsVisible={(value: boolean) => setUiVisibility((prev: UiVisibility) => ({ ...prev, folderTree: value }))}
        style={{ width: uiVisibility.folderTree ? `${leftPanelWidth}px` : '32px' }}
        tree={folderTree}
        pinnedFolderTrees={pinnedFolderTrees}
        pinnedFolders={pinnedFolders}
        activeSection={activeTreeSection}
        onActiveSectionChange={handleActiveTreeSectionChange}
        showImageCounts={appSettings?.enableFolderImageCounts ?? false}
      />
      <Resizer direction={Orientation.Vertical} onMouseDown={createResizeHandler(setLeftPanelWidth, leftPanelWidth)} />
    </div>
  );
});
