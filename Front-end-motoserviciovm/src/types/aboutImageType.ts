import type z from 'zod';
import aboutImageSchema from '../zod/aboutImage.schema';

export type AboutImageType = z.infer<typeof aboutImageSchema>;

export const AboutImageInitialState: AboutImageType = {
  image: undefined,
};

export default {};
