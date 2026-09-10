//import { UserRepository } from "../infrastructure/userRepository";

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  //userRepository: UserRepository;
}

export function createUser(id: string, email: string): User {
  return { id: "prefix" + id, email, createdAt: new Date() };//, userRepository: new UserRepository() };
}