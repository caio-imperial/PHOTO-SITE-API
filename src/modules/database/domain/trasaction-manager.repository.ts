export abstract class Transaction {
  abstract start(): Promise<void>;
  abstract commit(): Promise<void>;
  abstract rollback(): Promise<void>;
  abstract getSession(): unknown; // Retorna um tipo genérico
}
