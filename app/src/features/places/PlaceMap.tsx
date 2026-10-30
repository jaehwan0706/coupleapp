import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { placeCategories, useTheme } from '@/theme';
import type { Place } from '../types';

// 카카오맵 WebView(W3, ADR-003)가 붙기 전까지 쓰는 지도 자리.
// 저장한 핀의 위경도를 화면 좌표로 단순 투영해서 핀 모양·상태 표현을 확인한다.

const MAP_BG = '#EEEBE4';
// 핀을 놓는 범위 (화면 비율). 위쪽은 검색바·칩, 아래쪽은 목록 버튼을 피한다.
const X_RANGE = [0.12, 0.88] as const;
const Y_RANGE = [0.3, 0.85] as const;

type Props = {
  places: Place[];
  selectedId?: string;
  onSelect: (place: Place) => void;
};

export function PlaceMap({ places, selectedId, onSelect }: Props) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  const lats = places.map((p) => p.lat);
  const lngs = places.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const span = (a: number, b: number) => (b - a === 0 ? 1 : b - a);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: MAP_BG }]} onLayout={onLayout} accessibilityLabel="지도 미리보기">
      <View style={[styles.road, { top: '38%', left: 0, right: 0, height: 10 }]} />
      <View style={[styles.road, { top: '58%', left: 0, right: 0, height: 6 }]} />
      <View style={[styles.road, { left: '30%', top: 0, bottom: 0, width: 10 }]} />
      <View style={[styles.road, { left: '74%', top: '30%', bottom: 0, width: 6 }]} />
      <View style={styles.park} />
      <View style={styles.river} />
      {box.w > 0 &&
        places.map((p) => {
          const x = X_RANGE[0] + ((p.lng - minLng) / span(minLng, maxLng)) * (X_RANGE[1] - X_RANGE[0]);
          const y = Y_RANGE[0] + (1 - (p.lat - minLat) / span(minLat, maxLat)) * (Y_RANGE[1] - Y_RANGE[0]);
          return (
            <MapPin
              key={p.id}
              place={p}
              selected={p.id === selectedId}
              style={{ left: x * box.w - 18, top: y * box.h - 44 }}
              onPress={() => onSelect(p)}
            />
          );
        })}
    </View>
  );
}

/** 저장한 핀: 가고 싶다 = 흰 채움 + 색 테두리 / 가봤다 = 색 채움 + 체크 배지 */
function MapPin({ place, selected, style, onPress }: { place: Place; selected: boolean; style: object; onPress: () => void }) {
  const { colors } = useTheme();
  const c = placeCategories[place.category].color;
  const visited = place.status === 'visited';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${place.name}, ${visited ? '가봤다' : '가고 싶다'}`}
      onPress={onPress}
      style={[styles.pin, style, selected && styles.selected]}
    >
      <View style={[styles.head, { borderColor: c, backgroundColor: visited ? c : '#fff' }]}>
        <View style={styles.unrotate}>
          <Icon name={place.category} size={16} color={visited ? '#fff' : c} />
        </View>
      </View>
      {visited ? (
        <View style={[styles.ok, { backgroundColor: colors.success }]}>
          <Icon name="check" size={9} color="#fff" strokeWidth={3} />
        </View>
      ) : null}
      {selected ? (
        <View style={styles.label}>
          <AppText variant="caption" style={styles.labelText} numberOfLines={1}>
            {place.name}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  road: { position: 'absolute', backgroundColor: '#fff' },
  park: { position: 'absolute', left: '60%', top: '12%', width: '34%', height: '16%', backgroundColor: '#DCEBD5', borderRadius: 12 },
  river: { position: 'absolute', left: '-10%', right: '-10%', top: '80%', height: 56, backgroundColor: '#CFE3EE', transform: [{ rotate: '-8deg' }] },
  pin: { position: 'absolute', width: 36, height: 44, alignItems: 'center' },
  selected: { transform: [{ scale: 1.25 }], zIndex: 2 },
  head: {
    position: 'absolute',
    left: 2,
    top: 0,
    width: 32,
    height: 32,
    borderWidth: 2.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 0,
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  unrotate: { transform: [{ rotate: '45deg' }] },
  ok: { position: 'absolute', right: -1, bottom: 10, width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', bottom: 46, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, maxWidth: 140 },
  labelText: { fontWeight: '600' },
});
