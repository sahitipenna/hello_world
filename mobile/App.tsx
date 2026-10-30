import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useFonts as useHankenFonts, HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold } from "@expo-google-fonts/hanken-grotesk";
import { useFonts as useSpectralFonts, Spectral_400Regular, Spectral_400Regular_Italic, Spectral_500Medium, Spectral_600SemiBold } from "@expo-google-fonts/spectral";
import { useFonts as useHandFonts, LaBelleAurore_400Regular } from "@expo-google-fonts/la-belle-aurore";

import HomeScreen from "./src/screens/HomeScreen";
import SectionScreen from "./src/screens/SectionScreen";
import QuizScreen from "./src/screens/QuizScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { hasAnsweredToday } from "./src/lib/dailyPrompt";
import { colors, fonts } from "./src/theme";
import type { RootStackParamList } from "./src/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [hankenLoaded] = useHankenFonts({ HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold });
  const [spectralLoaded] = useSpectralFonts({ Spectral_400Regular, Spectral_400Regular_Italic, Spectral_500Medium, Spectral_600SemiBold });
  const [handLoaded] = useHandFonts({ LaBelleAurore_400Regular });
  // Whether the very first screen should be the "what are you curious
  // about today" prompt — once per day, decided from AsyncStorage (see
  // src/lib/dailyPrompt.ts), not from the server's one-time "has ever
  // chosen interests" flag.
  const [initialRoute, setInitialRoute] = useState<"Home" | "Onboarding" | null>(null);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const fontsLoaded = hankenLoaded && spectralLoaded && handLoaded;

  useEffect(() => {
    if (!fontsLoaded) return;
    hasAnsweredToday()
      .then((answered) => setInitialRoute(answered ? "Home" : "Onboarding"))
      .catch(() => setInitialRoute("Home"))
      .finally(() => SplashScreen.hideAsync().catch(() => {}));
  }, [fontsLoaded]);

  // Catches the case where the app was never force-quit across a day
  // boundary — a cold start only re-checks once, but resuming from the
  // background should also re-offer the prompt the first time that
  // happens on a new day. Skips it if some other screen (Section, Quiz)
  // is already on top, so a resume mid-article doesn't yank the reader
  // away from what they were doing.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      hasAnsweredToday().then((answered) => {
        if (answered) return;
        const current = navigationRef.current?.getCurrentRoute()?.name;
        if (current && current !== "Onboarding") {
          navigationRef.current?.navigate("Onboarding", { auto: true });
        }
      });
    });
    return () => sub.remove();
  }, [navigationRef]);

  const onLayout = useCallback(() => {}, []);

  if (!initialRoute) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <StatusBar style="light" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerStyle: { backgroundColor: colors.ink },
            headerTintColor: colors.paper,
            headerTitleStyle: { fontFamily: fonts.sansSemiBold },
            headerBackTitle: "Back",
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: "Go Dilly",
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Onboarding", { auto: false })}>
                  <Text style={{ color: colors.paper, fontFamily: fonts.sansMedium, fontSize: 14 }}>Interests</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Section"
            component={SectionScreen}
            options={({ route }) => ({ title: route.params.section.title })}
          />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Daily Quiz" }} />
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            initialParams={{ auto: initialRoute === "Onboarding" }}
            options={{ title: "Your interests", presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
