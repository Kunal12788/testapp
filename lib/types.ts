export const ROLES = [
  'FIRST_ADMIN',
  'SECOND_ADMIN',
  'THIRD_ADMIN',
  'FOURTH_ADMIN',
  'MAIN_ADMIN',
  'CUSTOMER'
] as const;

export type Role = (typeof ROLES)[number];
