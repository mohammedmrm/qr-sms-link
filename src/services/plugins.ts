// both these interfaces are declared in san regolo f/e too
// (this code is actualy copied from that project)

import { Err } from '@/types';
import { z } from 'zod';

export interface PluginInterface {
  currentJob(): Promise<Job>;
  jobComplete(jobId: number | undefined, answer: any): Promise<Job>;
  standalone?: boolean;
}

const Operation = z.object({
  id: z.number().int(),
  op_area: z.string(),
  op_famiglia: z.string(),
  op_prodotto: z.string(),
});

export const Job = z.object({
  id: z.number().int(),
  state: z.enum(['u', 'a', 'c', 's', 'd', 'x']),
  convention: z.string().nullable().optional(),
  operation: Operation,

  incoming: z.object({}).passthrough(),
  outgoing: z.object({}).passthrough().optional(),

  created_at: z.coerce.date(),
  completed_at: z.coerce.date().optional(),
  codiceErrore: z.string().optional(),
  messaggioErrore: z.string().optional(),
});
export type Job = z.infer<typeof Job>;

export function pluginInterface(): PluginInterface {
  if (typeof window === 'undefined') {
    console.error('ssr enabled, cannot find plugins interface');
  }

  const p = window?.parent as any;

  if (p && p.plugins) {
    return p.plugins as PluginInterface;
  }

  console.error('plugins undefined, using fake callback');

  return {
    currentJob() {
      console.log('standalone plugin: job complete');
      const err: Err = {
        codiceErrore: 'GD1002',
        messaggioErrore: 'No container found',
      };
      return Promise.reject(err);
    },
    jobComplete: (jobId: number, answer: any) => {
      console.log('standalone plugin: job complete');
      const err: Err = {
        codiceErrore: 'GD1002',
        messaggioErrore: 'No container found',
      };
      return Promise.reject(err);
    },
    standalone: true,
  };
}

export function jobCompleted(jobId: number, data: any, regoloInterface: PluginInterface) {
  regoloInterface.jobComplete(jobId, data);
}

export function authHeaders() {
  const jwt = localStorage.getItem('jwt');

  if (jwt) {
    return {
      Authorization: `Bearer ${jwt}`,
    };
  }
  return {};
}
