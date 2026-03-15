import { useEffect } from "react";

import { useSessionStore } from "@/core/store/useSessionStore";

export const useAppBootstrap = () => {
  const bootstrap = useSessionStore((state) => state.bootstrap);
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    if (status === "idle") {
      void bootstrap();
    }
  }, [bootstrap, status]);

  return status;
};
