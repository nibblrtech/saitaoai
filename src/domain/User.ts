//import { UserRepository } from "../infrastructure/userRepository";

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updated_at: Date;
  //userRepository: UserRepository;
}

export function createUser(id: string, email: string): User {
  return { id: id, email, createdAt: new Date(), updated_at: new Date() };//, userRepository: new UserRepository() };
}