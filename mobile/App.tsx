import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { fetchInterests } from "./src/api/interests";
import { colors, fonts } from "./src/theme";
import type { RootStackParamList } from "./src/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [hankenLoaded] = useHankenFonts({ HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold });
  const [spectralLoaded] = useSpectralFonts({ Spectral_400Regular, Spectral_400Regular_Italic, Spectral_500Medium, Spectral_600SemiBold });
  const [handLoaded] = useHandFonts({ LaBelleAurore_400Regular });
  // Whether the very first screen should be the interest/time-budget
  // picker — decided once, from whether this visitor has ever chosen
  // interests before (same "hasChosen" the web app's auto-invite uses),
  // not re-checked on every launch.
  const [initialRoute, setInitialRoute] = useState<"Home" | "Onboarding" | null>(null);

  const fontsLoaded = hankenLoaded && spectralLoaded && handLoaded;

  useEffect(() => {
    if (!fontsLoaded) return;
    fetchInterests()
      .then((d) => setInitialRoute(d.hasChosen ? "Home" : "Onboarding"))
      .catch(() => setInitialRoute("Home"))
      .finally(() => SplashScreen.hideAsync().catch(() => {}));
  }, [fontsLoaded]);

  const onLayout = useCallback(() => {}, []);

  if (!initialRoute) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <StatusBar style="light" />
      <NavigationContainer>
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
