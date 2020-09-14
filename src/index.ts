import type * as xstate from 'xstate';
import { Machine, assign as xAssign } from 'xstate';
import { choose as xChoose } from 'xstate/lib/actions';

import type { ActionFunctionWithCleanup, ActionGuardTuple, ActionTuple, AssignActionTuple, BaseActionTuple, ChooseActionTuple, Delay, DelayedTransitionTuple, EffectActionTuple, KeyActionTuple, StateNodeConfigActivitiesTuple, StateNodeConfigAlwaysTuple, StateNodeConfigDataTuple, StateNodeConfigEntryTuple, StateNodeConfigExitTuple, StateNodeConfigHistoryTuple, StateNodeConfigIdTuple, StateNodeConfigInvokeTuple, StateNodeConfigMetaTuple, StateNodeConfigOnTuple, StateNodeConfigTuple, StatesTuple, StateTuple, TransitionTuple } from './types'
import * as utils from './utils'

export function states<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  ...args: StateTuple<TContext, TStateSchema, TEvent>[]
): StatesTuple<TContext, TStateSchema, TEvent> {
  const maybeInitialStateTuple = args.find(
    ([_key, stateConfig]) => stateConfig.isInitial
  );

  let initialTuple: ['initial', keyof TStateSchema['states']];

  if (maybeInitialStateTuple) {
    const [stateName, config] = maybeInitialStateTuple;
    initialTuple = ['initial', stateName as keyof TStateSchema['states']];
    delete config.isInitial;
  } else {
    const [[firstStateKey]] = args;
    initialTuple = ['initial', firstStateKey as keyof TStateSchema['states']];
  }

  const states = Object.fromEntries(args) as xstate.StatesConfig<
    TContext,
    TStateSchema,
    TEvent
  >;

  return [['states', states], initialTuple];
}

export function parallelStates<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  ...args: [string, xstate.StateNodeConfig<TContext, TStateSchema, TEvent>][]
): StatesTuple<TContext, TStateSchema, TEvent> {
  const states = Object.fromEntries(args) as xstate.StatesConfig<
    TContext,
    TStateSchema,
    TEvent
  >;

  return [
    ['states', states],
    ['type', 'parallel'],
  ];
}

export function initialState<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  stateName: string,
  ...args: (
    | StateNodeConfigTuple<TContext, TStateSchema, TEvent>
    | StatesTuple<TContext, TStateSchema, TEvent>
  )[]
): StateTuple<TContext, TStateSchema, TEvent> {
  const [, stateConfig] = state<TContext, TStateSchema, TEvent>(
    stateName,
    ...args
  );
  return [stateName, { ...stateConfig, isInitial: true }];
}

export function state<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  stateName: string,
  ...args: (
    | StateNodeConfigTuple<TContext, TStateSchema, TEvent>
    | StatesTuple<TContext, TStateSchema, TEvent>
  )[]
): StateTuple<TContext, TStateSchema, TEvent> {
  return [
    stateName,
    utils.extractConfig<TContext, TStateSchema, TEvent>(
      args
    ) as xstate.StateNodeConfig<
      TContext,
      TStateSchema['states'][keyof TStateSchema['states']],
      TEvent
    >,
  ];
}

export function finalState<
  TContext = any,
  TEvent extends xstate.EventObject = any
>(stateName: string): [string, xstate.FinalStateNodeConfig<TContext, TEvent>] {
  return [stateName, { type: 'final' }];
}

export function on<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  event: string,
  ...args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | TransitionTuple<TContext, TEvent>
  )[]
): StateNodeConfigOnTuple<TContext, TStateSchema, TEvent> {
  const eventTuple = [event, utils.extractTransitions<TContext, TEvent>(args)];
  return ['on', Object.fromEntries([eventTuple])];
}

export function assign<TContext = any, TEvent extends xstate.EventObject = any>(
  assignment:
    | xstate.Assigner<TContext, TEvent>
    | xstate.PropertyAssigner<TContext, TEvent>
): AssignActionTuple<TContext, TEvent> {
  return ['actions', xAssign<TContext, TEvent>(assignment)];
}

export function action(act: string): KeyActionTuple {
  return ['actions', act];
}

export function effect<TContext = any, TEvent extends xstate.EventObject = any>(
  effect:
    | xstate.ActionFunction<TContext, TEvent>
    | ActionFunctionWithCleanup<TContext, TEvent>
): EffectActionTuple<TContext, TEvent> {
  return ['actions', effect];
}

export function guard<TContext = any, TEvent extends xstate.EventObject = any>(
  cond: xstate.Condition<TContext, TEvent>
): ActionGuardTuple<TContext, TEvent> {
  return ['cond', cond];
}

export function transition<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TArgs extends
    | [string, ...ActionTuple<TContext, TEvent>[]]
    | [ActionTuple<TContext, TEvent>, ...ActionTuple<TContext, TEvent>[]] = [
    string
  ]
>(
  ...args:
    | [string]
    | [
        ...TArgs,
        ActionTuple<TContext, TEvent>,
        ActionGuardTuple<TContext, TEvent>
      ]
): xstate.TransitionConfig<TContext, TEvent> {
  const actions = utils.extractActions<TContext, TEvent>(args);
  const cond = utils.last(utils.extractGuards<TContext, TEvent>(args)) as
    | xstate.Condition<TContext, TEvent>
    | undefined;

  return {
    target: (args as any).find(
      (arg: string | TransitionTuple<TContext, TEvent>) =>
        typeof arg === 'string'
    ) as string,
    actions: actions.length ? actions : undefined,
    cond,
  };
}

export function invoke<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  src: xstate.InvokeConfig<TContext, TEvent>['src'],
  ...args: StateNodeConfigOnTuple<TContext, TStateSchema, TEvent>[]
): StateNodeConfigInvokeTuple<TContext, TStateSchema, TEvent> {
  const on = args
    .filter(([key]) => key === 'on')
    .reduce(
      (events, [_key, event]) => ({ ...events, ...event }),
      {} as {
        done?: xstate.TransitionConfig<TContext, xstate.DoneInvokeEvent<any>>[];
        error?: xstate.TransitionConfig<
          TContext,
          xstate.DoneInvokeEvent<any>
        >[];
      }
    );
  return [
    'invoke',
    {
      src,
      onDone: on.done,
      onError: on.error,
    },
  ];
}

export function always<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  ...args: TransitionTuple<TContext, TEvent>[]
): StateNodeConfigAlwaysTuple<TContext, TStateSchema, TEvent> {
  return ['always', utils.extractTransitions<TContext, TEvent>(args)];
}

export function choose<TContext = any, TEvent extends xstate.EventObject = any>(
  ...choices: TransitionTuple<TContext, TEvent>[]
): ChooseActionTuple<TContext, TEvent> {
  return [
    'actions',
    xChoose<TContext, TEvent>(
      // we can leverage the extractTransitions function because we disallow strings at the type level
      utils.extractTransitions<TContext, TEvent>(choices) as xstate.ChooseConditon<
        TContext,
        TEvent
      >[]
    ),
  ];
}

export function choice<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args:
    | [ActionTuple<TContext, TEvent>, ...TransitionTuple<TContext, TEvent>[]]
    | [ActionTuple<TContext, TEvent>]
): xstate.ChooseConditon<TContext, TEvent> {
  const actions = utils.extractActions<TContext, TEvent>(args);
  const cond = utils.last(utils.extractGuards<TContext, TEvent>(args)) as
    | xstate.Condition<TContext, TEvent>
    | undefined;

  return {
    cond,
    actions,
  };
}

export function id<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(name: string): StateNodeConfigIdTuple<TContext, TStateSchema, TEvent> {
  return ['id', name];
}

export function entry<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  ...actions: BaseActionTuple<TContext, TEvent>[]
): StateNodeConfigEntryTuple<TContext, TStateSchema, TEvent> {
  return ['entry', utils.extractActions<TContext, TEvent>(actions)];
}

export function exit<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  ...actions: BaseActionTuple<TContext, TEvent>[]
): StateNodeConfigExitTuple<TContext, TStateSchema, TEvent> {
  return ['exit', utils.extractActions<TContext, TEvent>(actions)];
}

export function meta<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  meta: TStateSchema extends {
    meta: infer D;
  }
    ? D
    : any
): StateNodeConfigMetaTuple<TContext, TStateSchema, TEvent> {
  return ['meta', meta];
}

export function data<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  data:
    | xstate.Mapper<TContext, TEvent, any>
    | xstate.PropertyMapper<TContext, TEvent, any>
): StateNodeConfigDataTuple<TContext, TStateSchema, TEvent> {
  return ['data', data];
}

export function history<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  history: 'none' | 'shallow' | 'deep'
): StateNodeConfigHistoryTuple<TContext, TStateSchema, TEvent> {
  return ['history', history === 'none' ? false : history];
}

export function context<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  context: TContext | (() => TContext)
): StateNodeConfigTuple<TContext, TStateSchema, TEvent> {
  return ['context', context];
}

export function activities<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  ...args: EffectActionTuple<TContext, TEvent>[]
): StateNodeConfigActivitiesTuple<TContext, TStateSchema, TEvent> {
  const activities: xstate.ActivityDefinition<TContext, TEvent>[] = args.map(
    ([, activity]) => {
      const name = activity.name || activity.toString();
      return {
        id: name,
        type: name,
        exec: activity,
      };
    }
  );
  return ['activities', activities];
}

export function after<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args: DelayedTransitionTuple<TContext, TEvent>[]
) {
  return ['after', Object.fromEntries(args)];
}

export function delay<TContext = any, TEvent extends xstate.EventObject = any>(
  delay: Delay<TContext, TEvent>,
  ...args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | TransitionTuple<TContext, TEvent>
  )[]
): DelayedTransitionTuple<TContext, TEvent> {
  return [delay, utils.extractTransitions<TContext, TEvent>(args)];
}

export function composeActions<
  TContext = any,
  TEvent extends xstate.EventObject = any
>(...args: ActionTuple<TContext, TEvent>[]): ActionTuple<TContext, TEvent> {
  const actions = utils.extractActions<TContext, TEvent>(args);
  return ['actions', actions];
}

export function createMachine<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
>(
  ...args: (
    | StateNodeConfigTuple<TContext, TStateSchema, TEvent>
    | StatesTuple<TContext, TStateSchema, TEvent>
  )[]
) {
  const config = utils.extractConfig<TContext, TStateSchema, TEvent>(args);
  return Machine<TContext, TStateSchema, TEvent>(config);
}
