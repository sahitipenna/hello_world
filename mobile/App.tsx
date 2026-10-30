import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useFonts as useHankenFonts, HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold } from "@expo-google-fonts/hanken-grotesk";
import { useFonts as useSpectralFonts, Spectral_400Regular, Spectral_400Regular_Italic, Spectral_500Medium, Spectral_600SemiBold } from "@expo-google-fonts/spectral";
import { useFonts as useHandFonts, LaBelleAurore_400Regular } from "@expo-google-fonts/la-belle-aurore";

import HomeScreen from "./src/screens/HomeScreen";
import SectionScreen from "./src/screens/SectionScreen";
import QuizScreen from "./src/screens/QuizScreen";
import { colors, fonts } from "./src/theme";
import type { RootStackParamList } from "./src/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [hankenLoaded] = useHankenFonts({ HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold });
  const [spectralLoaded] = useSpectralFonts({ Spectral_400Regular, Spectral_400Regular_Italic, Spectral_500Medium, Spectral_600SemiBold });
  const [handLoaded] = useHandFonts({ LaBelleAurore_400Regular });
  const [ready, setReady] = useState(false);

  const fontsLoaded = hankenLoaded && spectralLoaded && handLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  const onLayout = useCallback(() => {}, []);

  if (!ready) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.ink },
            headerTintColor: colors.paper,
            headerTitleStyle: { fontFamily: fonts.sansSemiBold },
            headerBackTitle: "Back",
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Go Dilly" }} />
          <Stack.Screen
            name="Section"
            component={SectionScreen}
            options={({ route }) => ({ title: route.params.section.title })}
          />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Daily Quiz" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
