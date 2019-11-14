export interface Log {
    id: string,
    time: Date,
    context: Context,
    description: string,
    user: string,
}

export interface Context {
    method: string,
    params: [],
    result: any,
}

export interface LogDay {
    date: Date,
    logs: Log[],
}