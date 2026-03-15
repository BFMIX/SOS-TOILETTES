import React from "react";

import { AppProviders } from "@/core/providers/AppProviders";
import { RootNavigator } from "@/core/navigation/RootNavigator";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";

const AppContent = () => {
  useAppBootstrap();
  return <RootNavigator />;
};

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
