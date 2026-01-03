import { RFVisualizationColor, RFVisualizationNode } from '@/types/visualization/react-flow';
import { omit } from 'lodash/fp';

export const DEFAULT_VISUALIZATION_DIMENSIONS = {
  entityGap: 20,
  entityPadding: 30,
  matrix: {
    entityPerRow: 20,
  },
  hierarchy: {
    entityPerRow: 3,
  },
  container: {
    width: 200,
    height: 34,
  },
  group: {
    width: 200,
    height: 200,
  },
  coordinateDimensions: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    whitespaceRect: undefined,
  },
  marker: {
    orient: '90',
  },
};

export class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get right(): number {
    return this.x + this.width;
  }
  get bottom(): number {
    return this.y + this.height;
  }
  get center(): { x: number; y: number } {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }
  get area(): number {
    return this.width * this.height;
  }
}

export const DEFAULT_VISUALIZATION_COLORS: RFVisualizationColor = {
  background: {
    cluster: '#00277B',
    namespace: '#26C300',
    pod: '#ECECF2',
    container: '#ECECF2',
    node: '#ECECF2',
  },
  text: {
    cluster: 'white',
    namespace: 'white',
    pod: '#878AA9',
    container: '#878AA9',
    node: '#878AA9',
  },
};

export const getBgColorByType = (type: 'cluster' | 'namespace' | 'pod' | 'container') => {
  switch (type) {
    case 'cluster':
      return '#00277B';
    case 'namespace':
      return '#26C300';
    case 'pod':
      return '#ECECF2';
    case 'container':
      return '#ECECF2';
  }
};

export const getTextColorByType = (type: 'cluster' | 'namespace' | 'pod' | 'container') => {
  switch (type) {
    case 'cluster':
      return 'white';
    case 'namespace':
      return 'white';
    case 'pod':
      return '#878AA9';
    case 'container':
      return '#878AA9';
  }
};

export const getFlatVisualizationNodes = (nodes: RFVisualizationNode[]) => {
  const result: RFVisualizationNode[] = [];

  nodes.forEach(node => {
    result.push(omit(['children'], node) as RFVisualizationNode);
    if (node.children) {
      result.push(...getFlatVisualizationNodes(node.children));
    }
  });

  return result.map(el => ({
    ...el,
    style: {
      ...(el.style || {}),
      borderRadius: '9px',
    },
  }));
};

/**
 * From [a,b,c,d,e,f] to [[a,b],[c,d],[e,f]] for 2 entity per row
 */
export const getHorizontalChunkedArray = <T>(arr: Array<T>, size: number) => {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

/**
 * From [[a,b],[c,d],[e,f]] to [[a,c,e],[b,d,f]] - transposes horizontally chunked array to columns
 */
export const getTransposedChunkedArray = <T>(chunkedArray: Array<Array<T>>) => {
  if (chunkedArray.length === 0) return [];

  const numColumns = chunkedArray[0].length;
  const result: Array<Array<T>> = Array.from({ length: numColumns }, () => []);

  for (let i = 0; i < chunkedArray.length; i++) {
    for (let j = 0; j < chunkedArray[i].length; j++) {
      result[j].push(chunkedArray[i][j]);
    }
  }

  return result;
};

/**
 * From [a,b,c,d,e,f] to [[a,c],[b,d],[e,f]] for 2 entity per row
 */
export const getVerticalChunkedArray = <T>(arr: Array<T>, size: number) => {
  const result: Array<Array<T>> = Array.from({ length: size }, () => []);

  for (let i = 0; i < arr.length; i++) {
    const remainder = i % size;
    result[remainder].push(arr[i]);
  }

  return result;
};
