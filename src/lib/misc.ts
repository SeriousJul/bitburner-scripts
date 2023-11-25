export const newLine = "\n";
/** scp: Only works for scripts, .lit and .txt files. */
export const scpExtensions = [".lit", ".txt", ".js"];
export const lineHeader = "########################";

export class ThreadCounts {
  private ratio: number;
  constructor(public homeThreads: number, public threads: number) {
    this.ratio = (homeThreads || 1) / (threads || 1);
  }

  public removeThreads(threads: number, host: string) {
    if (host === "home") {
      this._removeHomeThreads(threads);
    } else {
      this._removeThreads(threads);
    }
  }

  private _removeHomeThreads(homeThreads: number) {
    this.homeThreads -= homeThreads;
    if (this.homeThreads > 0) {
      this.threads = Math.ceil(this.threads - homeThreads * this.ratio);
    } else if (this.homeThreads === 0) {
      this.threads = 0;
    } else {
      throw new Error("Tried to remove more threads than it has");
    }
  }

  private _removeThreads(threads: number) {
    this.threads -= threads;
    if (this.threads > 0) {
      this.homeThreads = Math.ceil(this.homeThreads - threads / this.ratio);
    } else if (this.threads === 0) {
      this.homeThreads = 0;
    } else {
      throw new Error("Tried to remove more threads than it has");
    }
  }

  public isEmpty() {
    return !this.threads;
  }

  public getThreadCount(host: string) {
    return host === "home" ? this.homeThreads : this.threads;
  }
}

export type T = ThreadCounts[];
