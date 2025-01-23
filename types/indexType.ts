import type { Prisma } from "@prisma/client";
import type prisma from "~/tools/prisma";

type UserDataType = {
  id: number;
  email: string,
  username: string,
  rate: number,
  role: RoleType,
  token: string,
};

type RoleType = "ADMIN" | "USER" | "SUBUSER" | "MASTER"
type DataModels = "user" | "person" | "movie" | "intuitionPack" | "castPack" | "quizPack" | "library" | "quizPackRound" | "roomUsers" | "quizPackAnswer" | "team"
type DataFunctions = "getActors" 

type QuizPackAnswer = {
  id:          number,
  isCorrect:   boolean,
  time:        number,
  number:      number,
  score:       number,
  grobValue:   number,
  total:       number,
  textAnswer:  string,
  isFirst:     boolean,  
  user_id:     number,
  answer_id:   number,
  pack_id:     number,
  room_id:     number,
};



type QuizPackRoundCreate = Prisma.Args<typeof prisma.quizPackRound, 'create'>['data']


export type {
  UserDataType,
  RoleType, 
  DataModels,
  DataFunctions,
  QuizPackAnswer,
  QuizPackRoundCreate
};