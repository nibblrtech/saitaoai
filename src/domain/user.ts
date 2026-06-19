//import { UserRepository } from "../infrastructure/userRepository";

export interface User {
  id: string;
  email: string;
  //userRepository: UserRepository;
}

export function createUser(id: string, email: string): User {
  return { id, email};//, userRepository: new UserRepository() };
}
