import { Edge, OnEdgesChange, useEdgesState } from '@xyflow/react';
import useStateFromProps from './useStateFromProps';
import { Dispatch, SetStateAction } from 'react';

const useEdgesStateFromProps = <T extends Edge = Edge>(
  initialEdges: T[]
): [edges: T[], setEdges: Dispatch<SetStateAction<T[]>>, onEdgesChange: OnEdgesChange<T>] => {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useStateFromProps(initialEdges, {
    onChange: newEdges => {
      setEdges(newEdges);
    },
  });

  return [edges, setEdges, onEdgesChange];
};

export default useEdgesStateFromProps;
