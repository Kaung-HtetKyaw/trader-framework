import FileClockLineIcon from '../svgs/FileClockLineIcon';

const NoRecentHistory = () => {
  return (
    <div className=" w-full h-full flex flex-col items-center justify-center gap-4">
      <FileClockLineIcon />
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="title-2 text-text-400">No Recent Activity Found</p>
        <p className="body-1 text-text-400">You haven’t started any chats or actions in this cluster yet.</p>
      </div>
    </div>
  );
};

export default NoRecentHistory;
