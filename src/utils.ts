import type * as xstate from 'xstate'
import type { StateNodeConfigOnDoneTuple, StateNodeConfigOnErrorTuple, StateNodeConfigOnTuple, StateNodeConfigTuple, StatesTuple, TransitionTuple } from './types';

export function last<T>(array: T[]): T {
  return array[array.length - 1];
}

export function extractStates<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  args: (
    | StateNodeConfigTuple<TContext, TStateSchema, TEvent>
    | StatesTuple<TContext, TStateSchema, TEvent>
  )[]
) {
  const states = args.find(([maybeArray]) => Array.isArray(maybeArray)) as
    | StatesTuple<TContext, TStateSchema, TEvent>
    | undefined;

  return [
    ...args.filter(([maybeArray]) => !Array.isArray(maybeArray)),
    ...(states ?? []),
  ];
}

export function extractConfig<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  args: (
    | StateNodeConfigTuple<TContext, TStateSchema, TEvent>
    | StatesTuple<TContext, TStateSchema, TEvent>
  )[]
): xstate.StateNodeConfig<TContext, TStateSchema, TEvent> {
  const nextArgs = extractEvents(extractStates(args));

  return Object.fromEntries(nextArgs);
}

export function extractEvents<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  args: (
    | StateNodeConfigTuple<TContext, TStateSchema, TEvent>
    | StatesTuple<TContext, TStateSchema, TEvent>
  )[]
): (
  | StateNodeConfigTuple<TContext, TStateSchema, TEvent>
  | StatesTuple<TContext, TStateSchema, TEvent>
)[] {
  const events = args.filter(([key]) => key === 'on') as StateNodeConfigOnTuple<
    TContext,
    TStateSchema,
    TEvent
  >[];
  const nextArgs = args.filter(([key]) => key !== 'on');
  if (events.length) {
    const { done, error, ...reducedEvents } = events.reduce(
      (events, [_key, event]) => ({ ...events, ...event }),
      {} as Record<string, xstate.TransitionConfig<TContext, TEvent>[]>
    );
    if (done) {
      // we destructure done because it's a reserved event
      nextArgs.push(['onDone', done] as StateNodeConfigOnDoneTuple<
        TContext,
        TStateSchema,
        TEvent
      >);
    }
    if (error) {
      nextArgs.push(['onError', error] as StateNodeConfigOnErrorTuple<
        TContext,
        TStateSchema,
        TEvent
      >);
    }
    if (Object.keys(reducedEvents).length > 0) {
      nextArgs.push(['on', reducedEvents as any]);
    }
  }

  return nextArgs;
}

export function extractActions<
  TContext = any,
  TEvent extends xstate.EventObject = any
>(
  args:
    | TransitionTuple<TContext, TEvent>[]
    | (string | TransitionTuple<TContext, TEvent>)[]
) {
  return args
    .filter(([key]) => key === 'actions')
    .map(([_key, actions]) => actions)
    .flat() as xstate.Action<TContext, TEvent>[];
}

export function extractGuards<
  TContext = any,
  TEvent extends xstate.EventObject = any
>(
  args:
    | TransitionTuple<TContext, TEvent>[]
    | (string | TransitionTuple<TContext, TEvent>)[]
) {
  return args.filter(([key]) => key === 'cond').map(([_key, guards]) => guards);
}

export function extractTransitions<
  TContext = any,
  TEvent extends xstate.EventObject = any
>(
  args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | TransitionTuple<TContext, TEvent>
  )[]
): xstate.TransitionConfig<TContext, TEvent>[] {
  return args.reduce((transitions, maybeTransitionTuple) => {
    if (
      typeof maybeTransitionTuple === 'object' &&
      !Array.isArray(maybeTransitionTuple)
    ) {
      // if its an object, then its a transition object made from the transition function
      transitions.push(maybeTransitionTuple);
      return transitions;
    }

    let currentTransition = last(transitions);

    // if the currentTransition has cond defined, the next args will describe a new transition
    // until the next the end or until another cond is defined
    if (!currentTransition || currentTransition.cond) {
      currentTransition = {};
      transitions.push(currentTransition);
    }

    if (typeof maybeTransitionTuple === 'string') {
      // if it's a string, then we'll treat it as a transition target
      currentTransition.target = maybeTransitionTuple;
    }

    if (Array.isArray(maybeTransitionTuple)) {
      // if its an array then it's a tuple
      const [type, config] = maybeTransitionTuple;

      if (type === 'actions') {
        const actions = currentTransition.actions
          ? ([...currentTransition.actions, config] as xstate.Action<
              TContext,
              TEvent
            >[])
          : ([config] as xstate.Action<TContext, TEvent>[]);
        currentTransition.actions = actions;
      }

      if (type === 'cond') {
        currentTransition.cond = config as xstate.Guard<TContext, TEvent>;
      }
    }

    return transitions;
  }, [] as xstate.TransitionConfig<TContext, TEvent>[]);
}
