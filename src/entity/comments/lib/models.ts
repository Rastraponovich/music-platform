export type TComment = {
  id: number;
  author: string;
  text: string;
  songId: number;
};

export interface IComments {
  [key: number]: TComment[];
}
