"use client";
import { useStoreModalStore } from "@/hooks/use-sotre-modal";
import { useEffect } from "react";

export default function RootPage() {
  const onOpen = useStoreModalStore((state) => state.onOpen);
  const isOpen = useStoreModalStore((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
