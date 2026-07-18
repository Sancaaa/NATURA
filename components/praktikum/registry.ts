import type { ComponentType } from "react";
import type { StepKind, StepProps } from "@/lib/praktikum/types";
import { InfoStep } from "./steps/InfoStep";
import { SliderRevealStep } from "./steps/SliderRevealStep";
import { TapTargetStep } from "./steps/TapTargetStep";
import { DragDropStep } from "./steps/DragDropStep";
import { ObserveStep } from "./steps/ObserveStep";
import { Model3DStep } from "./steps/Model3DStep";

// ============================================================
// STEP REGISTRY - inti dari "scalable tanpa custom code per skenario".
//
// Menambah SKENARIO baru  → cukup data (samples.ts / DB). Tidak sentuh sini.
// Menambah JENIS interaksi → tulis 1 komponen + daftarkan 1 baris di sini.
//
// Yang belum diimplementasi (tap-target, drag-drop, observe, model-3d)
// sengaja dibiarkan kosong: runner menampilkannya sebagai "belum didukung"
// dengan rapi, jadi engine tetap jalan sambil primitif menyusul.
// ============================================================
export const STEP_REGISTRY: Partial<
  Record<StepKind, ComponentType<StepProps<never>>>
> = {
  info: InfoStep as ComponentType<StepProps<never>>,
  "slider-reveal": SliderRevealStep as ComponentType<StepProps<never>>,
  "tap-target": TapTargetStep as ComponentType<StepProps<never>>,
  "drag-drop": DragDropStep as ComponentType<StepProps<never>>,
  observe: ObserveStep as ComponentType<StepProps<never>>,
  "model-3d": Model3DStep as ComponentType<StepProps<never>>,
};
