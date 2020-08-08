export type Orders = 'asc' | 'desc';

export class Params {

  limit: number;
  launch_year: string;
  land_success: string;
  launch_success: string;
  [key: string]: string | number;
}

export const DEFAULT_PARAMS: Params = {
  limit: 100,
  launch_year: '',
  land_success: '',
  launch_success: '',
};
