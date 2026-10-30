import { EditionSection } from "./types";

export type RootStackParamList = {
  Home: undefined;
  Section: { section: EditionSection; dateISO: string; initialTodoChecks: Record<number, boolean> };
  Quiz: undefined;
  Onboarding: { auto?: boolean } | undefined;
  Shelf: undefined;
};
