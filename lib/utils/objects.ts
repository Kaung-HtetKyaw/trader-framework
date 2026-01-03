export const getContainerID = (podID: string, containerName: string) => {
  return `${podID}-${containerName}`;
};
