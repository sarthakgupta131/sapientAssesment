export type Orders = 'asc' | 'desc';

export class Params {
  order: Orders;
  sort: 'flight_number';
  [key: string]: string | number;
}

export const DEFAULT_PARAMS: Params = {
  order: 'asc',
  sort: 'flight_number',
};
