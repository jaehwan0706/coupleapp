import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { mockCouple, mockEvents, mockPlaces } from './mock';
import type { CalendarEvent, Couple, Place } from './types';

// 서버 연결 전 임시 저장소. W2~W6에서 TanStack Query + STOMP 동기화로 바꾼다.
// 그때도 화면이 쓰는 함수 모양(addPlace, updatePlace ...)은 유지한다.

type State = {
  couple: Couple | null;
  places: Place[];
  events: CalendarEvent[];
};

type Action =
  | { type: 'connect'; couple: Couple }
  | { type: 'logout' }
  | { type: 'disconnect' }
  | { type: 'updateCouple'; patch: Partial<Couple> }
  | { type: 'addPlace'; place: Place }
  | { type: 'updatePlace'; id: string; patch: Partial<Place> }
  | { type: 'removePlace'; id: string }
  | { type: 'addEvent'; event: CalendarEvent }
  | { type: 'updateEvent'; id: string; patch: Partial<CalendarEvent> }
  | { type: 'removeEvent'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'connect':
      return { ...state, couple: action.couple };
    case 'logout':
      // 데이터는 서버(커플 공간)에 남는다. 이 기기에서만 나간다.
      return { ...state, couple: null };
    case 'disconnect':
      return { couple: null, places: [], events: [] };
    case 'updateCouple':
      return state.couple ? { ...state, couple: { ...state.couple, ...action.patch } } : state;
    case 'addPlace':
      return { ...state, places: [action.place, ...state.places] };
    case 'updatePlace':
      return { ...state, places: state.places.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)) };
    case 'removePlace':
      return {
        ...state,
        places: state.places.filter((p) => p.id !== action.id),
        events: state.events.map((e) => ({ ...e, placeIds: e.placeIds.filter((id) => id !== action.id) })),
      };
    case 'addEvent':
      return { ...state, events: [...state.events, action.event] };
    case 'updateEvent':
      return { ...state, events: state.events.map((e) => (e.id === action.id ? { ...e, ...action.patch } : e)) };
    case 'removeEvent':
      return { ...state, events: state.events.filter((e) => e.id !== action.id) };
  }
}

let seq = 0;
function newId(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

function useStoreValue(initial: State) {
  const [state, dispatch] = useReducer(reducer, initial);

  const connect = useCallback((couple: Couple) => dispatch({ type: 'connect', couple }), []);
  const logout = useCallback(() => dispatch({ type: 'logout' }), []);
  const disconnect = useCallback(() => dispatch({ type: 'disconnect' }), []);
  const updateCouple = useCallback((patch: Partial<Couple>) => dispatch({ type: 'updateCouple', patch }), []);

  const addPlace = useCallback((input: Omit<Place, 'id' | 'createdAt'>) => {
    const place: Place = { ...input, id: newId('p'), createdAt: new Date().toISOString() };
    dispatch({ type: 'addPlace', place });
    return place;
  }, []);
  const updatePlace = useCallback((id: string, patch: Partial<Place>) => dispatch({ type: 'updatePlace', id, patch }), []);
  const removePlace = useCallback((id: string) => dispatch({ type: 'removePlace', id }), []);

  const addEvent = useCallback((input: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = { ...input, id: newId('e') };
    dispatch({ type: 'addEvent', event });
    return event;
  }, []);
  const updateEvent = useCallback((id: string, patch: Partial<CalendarEvent>) => dispatch({ type: 'updateEvent', id, patch }), []);
  const removeEvent = useCallback((id: string) => dispatch({ type: 'removeEvent', id }), []);

  return useMemo(
    () => ({ ...state, connect, logout, disconnect, updateCouple, addPlace, updatePlace, removePlace, addEvent, updateEvent, removeEvent }),
    [state, connect, logout, disconnect, updateCouple, addPlace, updatePlace, removePlace, addEvent, updateEvent, removeEvent],
  );
}

type Store = ReturnType<typeof useStoreValue>;

const StoreContext = createContext<Store | null>(null);

/** withMockData: 온보딩 없이 예시 데이터로 시작 (화면 확인용) */
export function StoreProvider({ children, withMockData = false }: { children: ReactNode; withMockData?: boolean }) {
  const store = useStoreValue(
    withMockData ? { couple: mockCouple, places: mockPlaces, events: mockEvents } : { couple: null, places: [], events: [] },
  );
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore는 StoreProvider 안에서만 쓸 수 있어요');
  return store;
}
