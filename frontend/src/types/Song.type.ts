export interface Song {
  UUID: string;
  title: string;
  author: string;
  image: string;
  src: string;
  date: Date;
  likes: number;
  views: number;
  wave100: number[];
  wave220: number[];

  saved: number;
  comments: number;

  isCreating: true | undefined;
}
