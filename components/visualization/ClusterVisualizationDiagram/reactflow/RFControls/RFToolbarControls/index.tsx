import { CircularCloseIcon } from '@/components/svgs/CircularCloseIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignals } from '@preact/signals-react/runtime';
import { resetSelectedNodes, selectedNodesCount } from '@/signals/visualiation/misc';
import { AIPanel } from '@/signals/drawers/ai-panel';

const RFToolbar = () => {
  useSignals();
  const isAIPanelOpen = AIPanel.value.isAIPanelOpen;
  const shouldShowToolbar = selectedNodesCount.value > 0 && !isAIPanelOpen;

  const handleResetSelectedNodes = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetSelectedNodes();
  };

  return (
    <AnimatePresence>
      {shouldShowToolbar && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-50"
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200,
            mass: 1.5,
            velocity: 2,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <div className="flex items-center rounded-2xl bg-white shadow-lg px-4 py-2 gap-2">
            <div className="flex items-center bg-white rounded-lg border border-text-200 px-4 py-2 gap-2 min-w-[120px] justify-between">
              <span className="font-inter text-[12px] font-semibold leading-[130%]">{selectedNodesCount}</span>
              <span className="font-inter text-[12px] font-normal leading-[130%]">selected</span>

              <button
                onClick={handleResetSelectedNodes}
                className="text-text-500 hover:text-text-500 transition-colors"
                aria-label="Deselect all nodes"
              >
                <CircularCloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RFToolbar;
