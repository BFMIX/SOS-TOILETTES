import {
  Easing,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  ReduceMotion,
  SlideInLeft,
  SlideOutLeft,
  withSpring,
  withTiming
} from "react-native-reanimated";

export const motionTimings = {
  fast: 160,
  normal: 240,
  slow: 320
} as const;

export const motionEntering = {
  toast: FadeInDown.duration(motionTimings.normal).reduceMotion(ReduceMotion.System),
  menu: SlideInLeft.duration(motionTimings.normal).reduceMotion(ReduceMotion.System)
} as const;

export const motionExiting = {
  toast: FadeOutDown.duration(motionTimings.fast).reduceMotion(ReduceMotion.System),
  menu: SlideOutLeft.duration(200).reduceMotion(ReduceMotion.System)
} as const;

export const motionLayout = {
  standard: LinearTransition.duration(220).reduceMotion(ReduceMotion.System)
} as const;

export const motionAnimate = {
  soft: (toValue: number) =>
    withTiming(toValue, {
      duration: motionTimings.normal,
      easing: Easing.out(Easing.cubic)
    }),
  quick: (toValue: number) =>
    withTiming(toValue, {
      duration: motionTimings.fast,
      easing: Easing.out(Easing.quad)
    }),
  pop: (toValue: number) =>
    withSpring(toValue, {
      damping: 14,
      stiffness: 180,
      mass: 0.8
    })
} as const;
