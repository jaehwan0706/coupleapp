// EXPO_PUBLIC_ 값은 앱 번들에 그대로 들어간다. 비밀 키(카카오 REST 키 등)는 넣지 않는다.
export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  wsUrl: process.env.EXPO_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws',
  kakaoJsKey: process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? '',
  kakaoNativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? '',
  mapBaseUrl: process.env.EXPO_PUBLIC_MAP_BASE_URL ?? '',
};
