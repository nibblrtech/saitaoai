import type { User } from "../domain/user";

export class UserRepository {
  private readonly users: User[] = [];

  save(user: User): void {
    this.users.push(user);
  }

  all(): User[] {
    return [...this.users];
  }
}
