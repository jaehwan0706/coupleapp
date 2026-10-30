import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { IconButton, Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { eventFormSchema, type EventFormValues } from '@/features/events/eventForm';
import { CategoryIcon } from '@/features/places/PlaceRow';
import { useStore } from '@/features/store';
import { todayKey } from '@/lib/date';
import { eventTypes, radius, shadow, space, useTheme, type EventType } from '@/theme';

const typeKeys = Object.keys(eventTypes) as EventType[];

// 캘린더-03 일정 등록·수정 + 캘린더-04 장소 불러오기 (F-31~F-33)
// 날짜·시간은 피커 라이브러리를 고르기 전까지 텍스트로 입력한다.
export default function EventEditScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ id?: string; date?: string; placeId?: string }>();
  const { events, places, addEvent, updateEvent } = useStore();
  const editing = params.id ? events.find((e) => e.id === params.id) : undefined;

  const { control, handleSubmit, formState } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onTouched',
    defaultValues: editing
      ? {
          title: editing.title,
          type: editing.type,
          date: editing.date,
          allDay: editing.allDay,
          startTime: editing.startTime ?? '',
          endTime: editing.endTime ?? '',
          memo: editing.memo ?? '',
          placeIds: editing.placeIds,
        }
      : {
          title: '',
          type: 'date',
          date: params.date ?? todayKey(),
          allDay: false,
          startTime: '14:00',
          endTime: '',
          memo: '',
          placeIds: params.placeId ? [params.placeId] : [],
        },
  });
  const allDay = useWatch({ control, name: 'allDay' });

  const onSubmit = handleSubmit((v) => {
    const event = {
      title: v.title.trim(),
      type: v.type,
      date: v.date,
      allDay: v.allDay,
      startTime: v.allDay ? undefined : v.startTime,
      endTime: v.allDay || !v.endTime ? undefined : v.endTime,
      memo: v.memo.trim() || undefined,
      placeIds: v.placeIds,
    };
    if (editing) {
      updateEvent(editing.id, event);
      router.back();
    } else {
      const created = addEvent(event);
      router.replace(`/event/${created.id}`);
    }
  });

  return (
    <Screen
      title={editing ? '일정 수정' : '일정 추가'}
      right={<IconButton icon="close" label="닫기" onPress={() => router.back()} />}
      footer={<Button label="저장하기" onPress={() => onSubmit()} disabled={formState.isSubmitting} />}
    >
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <TextField label="제목" placeholder="성수 카페 투어" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} maxLength={40} />
        )}
      />

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <View style={styles.field}>
            <AppText variant="caption" tone="secondary">
              유형
            </AppText>
            <View style={styles.row}>
              {typeKeys.map((t) => (
                <Chip key={t} label={eventTypes[t].label} selected={field.value === t} color={eventTypes[t].color} onPress={() => field.onChange(t)} />
              ))}
            </View>
          </View>
        )}
      />

      <View style={styles.field}>
        <AppText variant="caption" tone="secondary">
          날짜·시간
        </AppText>
        <View style={[styles.box, shadow.sm, { backgroundColor: colors.surface }]}>
          <Controller
            control={control}
            name="allDay"
            render={({ field }) => (
              <View style={styles.switchRow}>
                <AppText>종일</AppText>
                <Switch
                  accessibilityLabel="종일"
                  value={field.value}
                  onValueChange={field.onChange}
                  trackColor={{ true: colors.primary, false: colors.borderStrong }}
                  thumbColor="#FFFFFF"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="date"
            render={({ field, fieldState }) => (
              <TextField label="날짜" placeholder="2026-10-31" maxLength={10} value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />
            )}
          />
          {allDay ? null : (
            <View style={styles.row}>
              <View style={styles.flex}>
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field, fieldState }) => (
                    <TextField label="시작" placeholder="14:00" maxLength={5} value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />
                  )}
                />
              </View>
              <View style={styles.flex}>
                <Controller
                  control={control}
                  name="endTime"
                  render={({ field, fieldState }) => (
                    <TextField label="종료 (선택)" placeholder="20:00" maxLength={5} value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />
                  )}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      <Controller
        control={control}
        name="placeIds"
        render={({ field }) => (
          <View style={styles.field}>
            <AppText variant="caption" tone="secondary">
              장소 (누른 순서대로 코스가 돼요)
            </AppText>
            {places.length ? (
              places.map((p) => {
                const order = field.value.indexOf(p.id);
                const on = order >= 0;
                return (
                  <Pressable
                    key={p.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    onPress={() => field.onChange(on ? field.value.filter((x) => x !== p.id) : [...field.value, p.id])}
                    style={[styles.placeRow, { backgroundColor: colors.surface, borderColor: on ? colors.primary : colors.border }]}
                  >
                    <CategoryIcon category={p.category} size={32} />
                    <AppText style={styles.flex} numberOfLines={1}>
                      {p.name}
                    </AppText>
                    <View style={[styles.order, { backgroundColor: on ? colors.primary : 'transparent', borderColor: on ? colors.primary : colors.borderStrong }]}>
                      {on ? (
                        <AppText variant="micro" style={{ color: colors.onPrimary }}>
                          {order + 1}
                        </AppText>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <AppText variant="callout" tone="secondary">
                지도에 저장한 장소가 생기면 여기서 고를 수 있어요
              </AppText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="memo"
        render={({ field, fieldState }) => (
          <TextField label="메모" multiline placeholder="2시에 성수역 3번 출구에서 만나기" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} maxLength={200} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { gap: space[2] },
  row: { flexDirection: 'row', gap: space[2] },
  flex: { flex: 1 },
  box: { borderRadius: radius.md, padding: space[4], gap: space[3] },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], borderWidth: 1.5, borderRadius: radius.md, paddingVertical: space[2], paddingHorizontal: space[3], minHeight: 52 },
  order: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
