import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import GlobalTooltip from './components/ui/GlobalTooltip';
import { ImageFile, CullingSuggestions, Orientation } from './components/ui/AppProperties';
import { ContextProviders, useAppState } from './context/ContextProviders';
import { useSortedImageList } from './hooks/useSortedImageList';
import { useHandlers } from './hooks/useHandlers';
import { useGlobalEffects } from './hooks/useGlobalEffects';
import Modals from './window/Modals';
import clsx from 'clsx';
import LibraryExportPanel from './components/panel/right/LibraryExportPanel';
import Resizer from './components/ui/Resizer';
import MainView from './window/MainView';
import { MemoizedFolderTree } from './window/MemoizedFolderTree';
import TitleBar from './window/TitleBar';

function App() {
  const {
    selectedImage,
    appSettings,
    rootPath,
    isWindowFullScreen,
    isLayoutReady,
    multiSelectedPaths,
    isFullScreen,
    isAnimatingTheme,
    isLibraryExportPanelVisible,
    setIsLibraryExportPanelVisible,
    rightPanelWidth,
    setRightPanelWidth,
    isResizing,
    exportState,
    setExportState,
  } = useAppState();

  const { sortedImageList } = useSortedImageList();

  const { createResizeHandler, handleSettingsChange } = useHandlers();

  useGlobalEffects();

  useKeyboardShortcuts();

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
