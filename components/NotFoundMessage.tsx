import { capitalize } from 'lodash/fp';

export type NotFoundMessageProps = {
  label?: string;
};

const NotFoundMessage = ({ label }: NotFoundMessageProps) => {
  return (
    <div className="flex items-center justify-center h-10 ">
      <p className="text-text-400 body-2 capitalize"> No {label ? capitalize(label) : 'options'} found</p>
    </div>
  );
};

export default NotFoundMessage;
