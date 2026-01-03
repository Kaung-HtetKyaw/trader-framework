import LoadingSpinner from '../LoadingSpinner';
import { BaseButton } from '../ui/base-button';

/**
 * Props for the SettingsActionBar component
 */
export type SettingsActionBarProps = {
  /** Whether the save button should be disabled */
  disabled?: boolean;
  /** Callback function to be called when the save button is clicked */
  onSubmit: () => void;

  isLoading: boolean;
};

/**
 * A component that renders a save action bar for settings pages.
 * This component displays a "Save Changes" button that can be enabled or disabled.
 * The button is positioned at the left side of the container and has different
 * styles based on its disabled state.
 *
 * @param {SettingsActionBarProps} props - The component props
 * @param {boolean} [props.disabled] - Whether the save button should be disabled
 * @param {() => void} props.onSubmit - Callback function to be called when the save button is clicked
 * @returns {JSX.Element} A div containing a save button with appropriate styling
 *
 * @example
 * ```tsx
 * <SettingsActionBar
 *   disabled={!hasChanges}
 *   onSubmit={handleSaveChanges}
 * />
 * ```
 */
const SettingsActionBar = ({ disabled, onSubmit, isLoading }: SettingsActionBarProps) => {
  return (
    <div className="w-full flex justify-start">
      <BaseButton
        type="submit"
        className={`px-6 py-2 font-medium rounded-md transition ${
          disabled
            ? 'bg-text-50 text-text-400 cursor-not-allowed font-normal'
            : 'bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer font-normal'
        }`}
        disabled={disabled}
        onClick={onSubmit}
      >
        {isLoading ? (
          <LoadingSpinner className="w-full gap-2">
            <p>Saving Changes...</p>
          </LoadingSpinner>
        ) : (
          <span>Save Changes</span>
        )}
      </BaseButton>
    </div>
  );
};

export default SettingsActionBar;
