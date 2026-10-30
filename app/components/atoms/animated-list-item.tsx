import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  motionTokens,
  spring,
  useShouldReduceMotion,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';

type AnimatedListItemProps = {
  children: ReactNode;
  className?: string;
  index: number;
};

export function AnimatedListItem({
  children,
  className,
  index,
}: AnimatedListItemProps) {
  const shouldReduceMotion = useShouldReduceMotion();
  const entranceSpring = useTempoTransition(spring.pop);
  const fadeTransition = useTempoTransition(motionTokens.transition.fade);
  const popOutTransition = useTempoTransition(motionTokens.transition.popOut);
  const staggerTransition = useTempoTransition({
    delay: Math.min(index, 8) * motionTokens.stagger.stack,
  });
  const entranceTransition = shouldReduceMotion
    ? fadeTransition
    : entranceSpring;
  const exitTransition = shouldReduceMotion ? fadeTransition : popOutTransition;
  const staggerDelay = shouldReduceMotion ? 0 : (staggerTransition.delay ?? 0);

  return (
    <motion.li
      layout={shouldReduceMotion ? false : 'position'}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.94, y: 12, filter: 'blur(4px)' }
      }
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { ...entranceTransition, delay: staggerDelay },
      }}
      exit={{
        opacity: 0,
        ...(shouldReduceMotion
          ? {}
          : { scale: 0.98, y: -4, filter: 'blur(2px)' }),
        transition: exitTransition,
      }}
      transition={shouldReduceMotion ? fadeTransition : entranceSpring}
      className={className}
    >
      {children}
    </motion.li>
  );
}
