export type WithIndex<T> = T & { index?: number };

export type IconProps = {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
  style?: React.CSSProperties;
};
