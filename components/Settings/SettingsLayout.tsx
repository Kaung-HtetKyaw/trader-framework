export type SettingsLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
};

/**
 * A layout wrapper component for settings pages that provides consistent styling and structure.
 * This component creates a full-height flex container with content distributed with gap of 32px.
 *
 * @param {SettingsLayoutProps} props - The component props
 * @param {React.ReactNode | React.ReactNode[]} props.children - The content to be rendered within the settings layout
 * @returns {JSX.Element} A div container with flex layout styling
 *
 * @example
 * ```tsx
 * <SettingsLayout>
 *   <SettingsHeader />
 *   <SettingsContent />
 *   <SettingsFooter />
 * </SettingsLayout>
 * ```
 */
const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return <div className="h-full flex flex-col gap-8">{children}</div>;
};

export default SettingsLayout;
