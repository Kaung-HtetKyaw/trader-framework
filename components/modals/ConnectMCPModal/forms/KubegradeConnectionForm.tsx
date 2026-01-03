import BaseServerConnectionForm, { BaseServerConnectionFormData } from './BaseServerConnectionForm';

export type KubegradeConnectionFormData = BaseServerConnectionFormData;

type KubegradeConnectionFormProps = {
  isConnecting: boolean;
  onConnect: (data: KubegradeConnectionFormData) => void;
};

const KubegradeConnectionForm = ({ onConnect, isConnecting }: KubegradeConnectionFormProps) => {
  return (
    <BaseServerConnectionForm
      title="Kubegrade Configuration"
      label="Configuration"
      placeholder="Enter Kubegrade configuration"
      onConnect={onConnect}
      isConnecting={isConnecting}
    />
  );
};

export default KubegradeConnectionForm;
