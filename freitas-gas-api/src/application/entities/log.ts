import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

export interface LogsProps {
  data: any;
  createdAt: Date;
}

export class Log {
  private _id: string;
  private props: LogsProps;

  constructor(props: Replace<LogsProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get data(): any {
    return this.props.data;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: Replace<LogsProps, { createdAt?: Date }>, id?: string) {
    const log = new Log(props, id);

    return log;
  }
}
