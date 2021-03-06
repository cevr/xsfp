import * as xstate from 'xstate';
import { Machine, assign as xAssign } from 'xstate';
import { choose as xChoose } from 'xstate/lib/actions';

import * as types from './types';
import * as utils from './utils';

export function states<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
>(
  ...args: (types.StateTuple<TContext, TEvent, TStateSchema> | string)[]
): types.StatesTuple<TContext, TEvent, TStateSchema> {
  const normalizedArgs: types.StateTuple<
    TContext,
    TEvent,
    TStateSchema
  >[] = args.map(maybeStateName => {
    if (typeof maybeStateName === 'string') {
      return [maybeStateName, {}];
    }
    return maybeStateName;
  });

  const maybeInitialStateTuple = normalizedArgs.find(
    ([_key, stateConfig]) => stateConfig.isInitial
  );

  let initialTuple: ['initial', keyof TStateSchema['states']];

  if (maybeInitialStateTuple) {
    const [stateName, config] = maybeInitialStateTuple;
    initialTuple = ['initial', stateName as keyof TStateSchema['states']];
    delete config.isInitial;
  } else {
    const [[firstStateKey]] = normalizedArgs;
    initialTuple = ['initial', firstStateKey as keyof TStateSchema['states']];
  }

  const states = Object.fromEntries(normalizedArgs) as xstate.StatesConfig<
    TContext,
    TStateSchema,
    TEvent
  >;

  return [['states', states], initialTuple];
}

export function parallelStates<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
>(
  ...args: [string, xstate.StateNodeConfig<TContext, TStateSchema, TEvent>][]
): types.StatesTuple<TContext, TEvent, TStateSchema> {
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
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
>(
  stateName: string,
  ...args: (
    | types.StateNodeConfigTuple<TContext, TEvent, TStateSchema>
    | types.StatesTuple<TContext, TEvent, TStateSchema>
  )[]
): types.StateTuple<TContext, TEvent, TStateSchema> {
  const [, stateConfig] = state<TContext, TEvent, TStateSchema>(
    stateName,
    ...args
  );
  return [stateName, { ...stateConfig, isInitial: true }];
}

export function state<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
>(
  stateName: string,
  ...args: (
    | types.StateNodeConfigTuple<TContext, TEvent, TStateSchema>
    | types.StatesTuple<TContext, TEvent, TStateSchema>
  )[]
): types.StateTuple<TContext, TEvent, TStateSchema> {
  return [
    stateName,
    utils.extractConfig<TContext, TEvent, TStateSchema>(
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

export function historyState<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
>(
  stateName: string,
  history?: 'shallow' | 'deep',
  target?: string
): types.StateTuple<TContext, TEvent, TStateSchema> {
  return [
    stateName,
    { type: 'history', history: history ?? 'shallow', target },
  ];
}

export function on<TContext = any, TEvent extends xstate.EventObject = any>(
  event: string,
  ...args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | types.TransitionTuple<TContext, TEvent>
  )[]
): types.StateNodeConfigOnTuple<TContext, TEvent> {
  const eventTuple = [event, utils.extractTransitions<TContext, TEvent>(args)];
  return ['on', Object.fromEntries([eventTuple])];
}

export function onDone<
  TContext = any,
  TEvent extends xstate.DoneEventObject = any
>(
  ...args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | types.TransitionTuple<TContext, TEvent>
  )[]
): types.StateNodeConfigOnDoneTuple<TContext, TEvent> {
  return ['onDone', utils.extractTransitions<TContext, TEvent>(args)];
}

export function onError<
  TContext = any,
  TEvent extends xstate.DoneInvokeEvent<any> = any
>(
  ...args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | types.TransitionTuple<TContext, TEvent>
  )[]
): types.OnErrorTuple<TContext, TEvent> {
  return ['onError', utils.extractTransitions<TContext, TEvent>(args)];
}

export function assign<TContext = any, TEvent extends xstate.EventObject = any>(
  assignment:
    | xstate.Assigner<TContext, TEvent>
    | xstate.PropertyAssigner<TContext, TEvent>
): types.AssignActionTuple<TContext, TEvent> {
  return ['actions', xAssign<TContext, TEvent>(assignment)];
}

export function action(act: string): types.KeyActionTuple {
  return ['actions', act];
}

export function effect<TContext = any, TEvent extends xstate.EventObject = any>(
  effect:
    | xstate.ActionFunction<TContext, TEvent>
    | types.ActionFunctionWithCleanup<TContext, TEvent>
): types.EffectActionTuple<TContext, TEvent> {
  return ['actions', effect];
}

export function guard<TContext = any, TEvent extends xstate.EventObject = any>(
  cond: xstate.Condition<TContext, TEvent>
): types.ActionGuardTuple<TContext, TEvent> {
  return ['cond', cond];
}

export function transition<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TArgs extends
    | [string, ...types.ActionTuple<TContext, TEvent>[]]
    | [
        types.ActionTuple<TContext, TEvent>,
        ...types.ActionTuple<TContext, TEvent>[]
      ] = [string]
>(
  ...args:
    | [string]
    | [
        ...TArgs,
        types.ActionTuple<TContext, TEvent>,
        types.ActionGuardTuple<TContext, TEvent>
      ]
): xstate.TransitionConfig<TContext, TEvent> {
  const actions = utils.extractActions<TContext, TEvent>(args);
  const cond = utils.last(utils.extractGuards<TContext, TEvent>(args)) as
    | xstate.Condition<TContext, TEvent>
    | undefined;

  return {
    target: (args as any).find(
      (arg: string | types.TransitionTuple<TContext, TEvent>) =>
        typeof arg === 'string'
    ) as string | undefined,
    actions: actions.length ? actions : undefined,
    cond,
  };
}

export function autoForward() {
  return ['autoForward', true];
}

export function invoke<TContext = any, TEvent extends xstate.EventObject = any>(
  src: xstate.InvokeConfig<TContext, TEvent>['src'],
  ...args: (
    | types.StateNodeConfigIdTuple
    | types.StateNodeConfigDataTuple<TContext, TEvent>
    | types.StateNodeConfigOnDoneTuple<TContext, TEvent>
    | types.OnErrorTuple<TContext, xstate.DoneInvokeEvent<any>>
    | types.AutoForwardTuple
  )[]
): types.StateNodeConfigInvokeTuple<TContext, TEvent> {
  return ['invoke', { src, ...Object.fromEntries(args) }];
}

export function always<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | types.TransitionTuple<TContext, TEvent>
  )[]
): types.StateNodeConfigAlwaysTuple<TContext, TEvent> {
  return ['always', utils.extractTransitions<TContext, TEvent>(args)];
}

export function choose<TContext = any, TEvent extends xstate.EventObject = any>(
  ...choices: (
    | xstate.TransitionConfig<TContext, TEvent>
    | types.TransitionTuple<TContext, TEvent>
  )[]
): types.ChooseActionTuple<TContext, TEvent> {
  return [
    'actions',
    xChoose<TContext, TEvent>(
      // we can leverage the extractTransitions function because we disallow strings at the type level
      utils.extractTransitions<TContext, TEvent>(
        choices
      ) as xstate.ChooseConditon<TContext, TEvent>[]
    ),
  ];
}

export function choice<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args:
    | [
        types.ActionTuple<TContext, TEvent>,
        ...types.TransitionTuple<TContext, TEvent>[]
      ]
    | [types.ActionTuple<TContext, TEvent>]
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

export function pure<TContext = any, TEvent extends xstate.EventObject = any>(
  create: (
    context: TContext,
    event: TEvent
  ) => types.ActionTuple<TContext, TEvent>
): types.PureActionTuple<TContext, TEvent> {
  return [
    'actions',
    xstate.actions.pure<TContext, TEvent>((context, event) => {
      return utils.extractActions<TContext, TEvent>([create(context, event)]);
    }),
  ];
}

export function send<TContext = any, TEvent extends xstate.EventObject = any>(
  event:
    | string
    | TEvent
    | xstate.ExprWithMeta<TContext, TEvent, xstate.EventObject>,
  options?: xstate.SendActionOptions<TContext, TEvent>
): types.ActionTuple<TContext, TEvent> {
  return ['actions', xstate.actions.send<TContext, TEvent>(event, options)];
}

export function id(name: string): types.StateNodeConfigIdTuple {
  return ['id', name];
}

export function entry<TContext = any, TEvent extends xstate.EventObject = any>(
  ...actions: types.BaseActionTuple<TContext, TEvent>[]
): types.StateNodeConfigEntryTuple<TContext, TEvent> {
  return ['entry', utils.extractActions<TContext, TEvent>(actions)];
}

export function exit<TContext = any, TEvent extends xstate.EventObject = any>(
  ...actions: types.BaseActionTuple<TContext, TEvent>[]
): types.StateNodeConfigExitTuple<TContext, TEvent> {
  return ['exit', utils.extractActions<TContext, TEvent>(actions)];
}

export function meta<TStateSchema extends xstate.StateSchema<any> = any>(
  meta: TStateSchema extends {
    meta: infer D;
  }
    ? D
    : any
): types.StateNodeConfigMetaTuple<TStateSchema> {
  return ['meta', meta];
}

export function data<TContext = any, TEvent extends xstate.EventObject = any>(
  data:
    | xstate.Mapper<TContext, TEvent, any>
    | xstate.PropertyMapper<TContext, TEvent, any>
): types.StateNodeConfigDataTuple<TContext, TEvent> {
  return ['data', data];
}

export function history(
  history: 'none' | 'shallow' | 'deep'
): types.StateNodeConfigHistoryTuple {
  return ['history', history === 'none' ? false : history];
}

export function context<TContext = any>(
  context: Partial<TContext> | (() => Partial<TContext>)
): types.StateNodeConfigContextTuple<TContext> {
  return ['context', context];
}

export function activities<
  TContext = any,
  TEvent extends xstate.EventObject = any
>(
  ...args: (string | types.EffectActionTuple<TContext, TEvent>)[]
): types.StateNodeConfigActivitiesTuple<TContext, TEvent> {
  const activities: xstate.Activity<TContext, TEvent>[] = args.map(
    maybeEffect => {
      if (Array.isArray(maybeEffect)) {
        const [, activity] = maybeEffect;
        const name = activity.name || activity.toString();
        return {
          id: name,
          type: name,
          exec: activity,
        };
      }
      return maybeEffect;
    }
  );
  return ['activities', activities];
}

export function after<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args: types.DelayedTransitionTuple<TContext, TEvent>[]
) {
  return ['after', Object.fromEntries(args)];
}

export function delay<TContext = any, TEvent extends xstate.EventObject = any>(
  delay: types.Delay<TContext, TEvent>,
  ...args: (
    | string
    | xstate.TransitionConfig<TContext, TEvent>
    | types.TransitionTuple<TContext, TEvent>
  )[]
): types.DelayedTransitionTuple<TContext, TEvent> {
  return [delay, utils.extractTransitions<TContext, TEvent>(args)];
}

export function delimiter(
  delimiter: string
): types.StateNodeConfigDelimiterTuple {
  return ['delimiter', delimiter];
}

export function merge<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args: types.ActionTuple<TContext, TEvent>[]
): types.ActionTuple<TContext, TEvent>;

export function merge<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args: types.StateNodeConfigOnTuple<TContext, TEvent>[]
): types.StateNodeConfigOnTuple<TContext, TEvent>;

export function merge<TContext = any, TEvent extends xstate.EventObject = any>(
  ...args:
    | types.ActionTuple<TContext, TEvent>[]
    | types.StateNodeConfigOnTuple<TContext, TEvent>[]
):
  | types.ActionTuple<TContext, TEvent>
  | types.StateNodeConfigOnTuple<TContext, TEvent> {
  const [[firstKey]] = args;
  if (firstKey === 'on') {
    return [
      'on',
      (args as types.StateNodeConfigOnTuple<TContext, TEvent>[]).reduce(
        (events, [_key, event]) => ({ ...events, ...event }),
        {} as xstate.TransitionConfig<TContext, TEvent>
      ) as any,
    ];
  }

  const actions = utils.extractActions<TContext, TEvent>(
    args as types.ActionTuple<TContext, TEvent>[]
  );
  const otherActions = actions.filter(action => {
    return !(
      typeof action === 'object' &&
      action.type === xstate.ActionTypes.Assign &&
      typeof action.assignment !== 'function'
    );
  });
  const mergedAssign = (actions.filter(action => {
    return (
      typeof action === 'object' &&
      action.type === xstate.ActionTypes.Assign &&
      typeof action.assignment !== 'function'
    );
  }) as xstate.AssignAction<TContext, TEvent>[]).reduce(
    (mergedAssign, action) => {
      return {
        type: xstate.ActionTypes.Assign,
        assignment: {
          ...mergedAssign.assignment,
          ...action.assignment,
        },
      };
    },
    {} as xstate.AssignAction<TContext, TEvent>
  );
  return ['actions', [mergedAssign, ...otherActions]];
}

export function createMachine<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
>(
  ...args: (
    | types.StateNodeConfigTuple<TContext, TEvent, TStateSchema>
    | types.StatesTuple<TContext, TEvent, TStateSchema>
  )[]
) {
  const config = utils.extractConfig<TContext, TEvent, TStateSchema>(args);
  return Machine<TContext, TStateSchema, TEvent>(config);
}
