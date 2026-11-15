import { Component, type ReactNode } from "react";

const button = "inline-flex items-center justify-center rounded-md h-9 px-4 py-2 text-sm font-medium";
const outline = button + " border border-input shadow-sm hover:bg-accent hover:text-accent-foreground";
const primary = button + " bg-primary text-primary-foreground shadow hover:bg-primary/90";

export function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
      <p className="text-6xl font-semibold tracking-tight">404</p>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <div className="flex gap-2">
        <button className={outline} onClick={() => history.back()}>Go back</button>
        <a className={primary} href={import.meta.env.BASE_URL}>Start over</a>
      </div>
    </main>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) { return { error }; }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-24">
        <h1>Something went wrong</h1>
        <p>{this.state.error.message}</p>
        <div className="flex gap-2">
          <button className={outline} onClick={() => this.setState({ error: null })}>Try again</button>
          <a className={primary} href={import.meta.env.BASE_URL}>Home</a>
        </div>
      </main>
    );
  }
}
