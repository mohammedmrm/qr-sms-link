import { z } from 'zod';

export interface Err {
  messaggioErrore?: string;
  codiceErrore:
    | 'generic'
    | 'signin'
    | 'permission'
    | 'auth'
    | 'GD00500'
    | 'GD1000'
    | 'GD1001'
    | 'GD1002'
    | 'GD1003'
    | 'GD2001'
    | 'GD3001'
    | 'GD3002'
    | 'GD3003'
    | 'GD00314'
    | 'GD00317'
    | 'GDSR003'
    | 'GD00508'
    | 'GD00400'
    | 'GD00404'
    | 'GD00401';

  detail?: any[];
}

export const BOX = z.object({
  confidence: z.number().nullable(),
  box_id: z.string(),
  left: z.number(),
  top: z.number(),
  width: z.number(),
  height: z.number(),
  locked: z.boolean(),
  text: z.string().nullable(),
  edited: z.boolean(),
});
export type BOX = z.infer<typeof BOX>;
export const OCR_VALIDATION = z.object({
  id: z.string(),
  page_url: z.string().url(),
  boxes: z.array(BOX),
});
export type OCR_VALIDATION = z.infer<typeof OCR_VALIDATION>;
