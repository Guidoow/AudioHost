export interface Audio {
  src: string;
  UUID: string;
  handleTimeUpdate: () => void;
  handleOnPause: () => void;
}
