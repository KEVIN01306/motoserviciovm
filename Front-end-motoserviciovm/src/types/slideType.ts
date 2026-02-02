import type z from 'zod';
import slideSchema from '../zod/slide.schema';

export type SlideType = z.infer<typeof slideSchema>;

export const SlideInitialState: SlideType = {
  image: undefined,
  tag: undefined,
  promo: undefined,
  subtitle: undefined,
};

export default {};
