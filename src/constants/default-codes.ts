export const DEFAULT_CODE_JS = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

export const DEFAULT_CODE_TS = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

export const DEFAULT_CODE_PYTHON = `def fibonacci(n):
  if n <= 1:
    return n
  return fibonacci(n - 1) + fibonacci(n - 2)`;

export const DEFAULT_CODE_JAVA = `public class Fibonacci {
  public static int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}`;

export const DEFAULT_CODE_CSHARP = `public class Fibonacci {
  public static int Fibonacci(int n) {
    if (n <= 1) return n;
    return Fibonacci(n - 1) + Fibonacci(n - 2);
  }
}`;

export const DEFAULT_CODE_RUBY = `def fibonacci(n)
  if n <= 1
    return n
  end
  fibonacci(n - 1) + fibonacci(n - 2)
end`;

export const DEFAULT_CODE_RUST = `fn fibonacci(n: u32) -> u32 {
  if n <= 1 {
    return n;
  }
  fibonacci(n - 1) + fibonacci(n - 2)
}`;

export const DEFAULT_CODE_GO = `package main

func fibonacci(n int) int {
  if n <= 1 {
    return n
  }
  return fibonacci(n-1) + fibonacci(n-2)
}`;

export const DEFAULT_CODE_SQL = `CREATE TABLE Fibonacci (
  n INT PRIMARY KEY,
  value INT NOT NULL
);`;
