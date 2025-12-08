export interface ParticipationOption {
  label: string;
  price: number;
}

export type QuestionType =
  | "text"
  | "number"
  | "select"
  | "radio"
  | "checkbox";

export interface Question {
  label: string;
  type: QuestionType;
  options: string[];
}

export interface CreateCompetitionPayload {
  owner: string;

  name: string;
  about: string;
  coverPhoto?: string;

  participationOptions: ParticipationOption[];
  customQuestions: Question[];

  participantLimit?: number;
  mode?: string;
  venue?: string;

  dateStart?: string;
  dateEnd?: string;
  timeStart?: string;
  timeEnd?: string;

  registrationDeadline?: string; 

  judgingCriteria?: string[];
  prizePool?: string[];
}
