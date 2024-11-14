FROM node:20

WORKDIR /usr/src/placenet-app

COPY package*.json ./

RUN npm install && npx install-expo-modules@latest && npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar && npx expo install react-native-web react-dom && npm install axios

EXPOSE 3002

CMD ["npx", "expo", "start"]

