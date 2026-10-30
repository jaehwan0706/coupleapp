import { z } from 'zod';

import { fromKey, toKey } from '@/lib/date';

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, '14:00 형식으로 입력해 주세요');

/** 일정 등록·수정 폼 (F-31~F-33) */
export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, '제목을 입력해 주세요').max(40, '40자까지 쓸 수 있어요'),
    type: z.enum(['date', 'anniversary', 'etc']),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, '2026-10-31 형식으로 입력해 주세요')
      .refine((v) => toKey(fromKey(v)) === v, '없는 날짜예요'),
    allDay: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
    memo: z.string().max(200, '200자까지 쓸 수 있어요'),
    placeIds: z.array(z.string()),
  })
  .superRefine((v, ctx) => {
    if (v.allDay) return;
    if (!time.safeParse(v.startTime).success) {
      ctx.addIssue({ code: 'custom', path: ['startTime'], message: '14:00 형식으로 입력해 주세요' });
    }
    if (v.endTime && !time.safeParse(v.endTime).success) {
      ctx.addIssue({ code: 'custom', path: ['endTime'], message: '20:00 형식으로 입력해 주세요' });
    } else if (v.endTime && v.endTime <= v.startTime) {
      ctx.addIssue({ code: 'custom', path: ['endTime'], message: '시작보다 늦은 시간으로 정해 주세요' });
    }
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;
