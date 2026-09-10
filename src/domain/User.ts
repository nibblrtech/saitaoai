export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export function createUser(id: string, email: string): User {
  return { id: id, email, createdAt: new Date() };
}
