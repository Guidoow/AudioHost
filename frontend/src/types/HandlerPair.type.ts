export interface HandlerPair {
  handleTimeUpdate: (tile?: number) => void;
  handleTimeAssign: () => void;
}
