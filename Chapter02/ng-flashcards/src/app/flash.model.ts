export interface IFlash {
  question: string;
  answer: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  show: boolean;
  _id: number;
  remembered?: 'correct' | 'incorrect';
}
