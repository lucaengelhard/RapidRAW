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
  const { isLightTheme } = useAppState();

  return (
    <>
      <CopyPasteSettingsModal />
      <PanoramaModal />
      <HdrModal />
      <NegativeConversionModal />
      <DenoiseModal />
      <CreateFolderModal />
      <RenameFolderModal />
      <RenameFileModal />
      <ConfirmModal />
      <ImportSettingsModal />
      <CullingModal />
      <CollageModal />
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
