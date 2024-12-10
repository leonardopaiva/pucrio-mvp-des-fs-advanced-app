export type ApiResponse<T = unknown> = {
    loading: boolean;
    status: number;
    message: string;
    data: T;
  };