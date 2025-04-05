import { z } from "zod";

export const arrayOfIntegersOrUndefined = z.union([
  z.array(z.number().int()),
  z.undefined(),
]);
