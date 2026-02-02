import type z from 'zod';
import valorSchema from '../zod/valor.schema';

export type ValorType = z.infer<typeof valorSchema>;

export const ValorInitialState: ValorType = {
  title: '',
  desc: '',
  icon: 'Target',
  color: 'text-red-600',
};

export default {};
