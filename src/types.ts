import * as xstate from 'xstate';

export type StateNodeConfig<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = (
  | xstate.StateNodeConfig<
      TContext,
      TStateSchema['states'][keyof TStateSchema['states']],
      TEvent
    >
  | xstate.HistoryStateNodeConfig<TContext, TEvent>
) & {
  isInitial?: boolean;
};

export type StateTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [string, StateNodeConfig<TContext, TStateSchema, TEvent>];

export type StatesTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  StateNodeConfigStatesTuple<TContext, TStateSchema, TEvent>,
  (
    | StateNodeConfigInitialTuple<TContext, TStateSchema, TEvent>
    | StateNodeConfigTypeTuple<TContext, TStateSchema, TEvent>
  )
];

export type StateNodeConfigInitialTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'initial',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['initial']
];
export type StateNodeConfigDelimiterTuple = ['delimiter', string];
export type StateNodeConfigTypeTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['type', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['type']];
export type StateNodeConfigContextTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'context',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['context']
];
export type StateNodeConfigHistoryTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'history',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['history']
];
export type StateNodeConfigStatesTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'states',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['states']
];

export type StateNodeConfigInvokeTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'invoke',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['invoke']
];
export type StateNodeConfigOnTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['on', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['on']];
export type StateNodeConfigEntryTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['entry', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['entry']];
export type StateNodeConfigExitTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['exit', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['exit']];
export type StateNodeConfigOnDoneTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'onDone',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['onDone']
];
export type StateNodeConfigOnErrorTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'onError',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['onDone']
];
export type StateNodeConfigAfterTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['after', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['after']];
export type StateNodeConfigAlwaysTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'always',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['always']
];
export type StateNodeConfigActivitiesTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'activities',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['activities']
];
export type StateNodeConfigMetaTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['meta', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['meta']];
export type StateNodeConfigDataTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['data', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['data']];
export type StateNodeConfigIdTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['id', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['id']];
export type StateNodeConfigTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> =
  | StateNodeConfigInitialTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigTypeTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigContextTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigHistoryTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigStatesTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigInvokeTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigOnTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigEntryTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigExitTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigOnDoneTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigOnErrorTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigAfterTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigAlwaysTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigMetaTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigDataTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigIdTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigActivitiesTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigDelimiterTuple;

export type TransitionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ActionTuple<TContext, TEvent> | ActionGuardTuple<TContext, TEvent>;

export type ActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> =
  | BaseActionTuple<TContext, TEvent>
  | AssignActionTuple<TContext, TEvent>
  | EffectActionTuple<TContext, TEvent>
  | ChooseActionTuple<TContext, TEvent>
  | ComposedActionTuple<TContext, TEvent>
  | KeyActionTuple;

export type ActionFunctionWithCleanup<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = (
  context: TContext,
  event: TEvent,
  meta: xstate.ActionMeta<TContext, TEvent>
) => xstate.DisposeActivityFunction | void;

export type KeyActionTuple = ['actions', string];

export type ComposedActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.Action<TContext, TEvent>[]];

export type BaseActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.Action<TContext, TEvent>];

export type EffectActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = [
  'actions',
  (
    | xstate.ActionFunction<TContext, TEvent>
    | ActionFunctionWithCleanup<TContext, TEvent>
  )
];

export type AssignActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.AssignAction<TContext, TEvent>];

export type ActionGuardTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['cond', xstate.Condition<TContext, TEvent>];

export type ChooseActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.ChooseAction<TContext, TEvent>];

export type Delay<TContext = any, TEvent extends xstate.EventObject = any> =
  | number
  | ((context: TContext, event: TEvent) => number);

export type DelayedTransitionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = [Delay<TContext, TEvent>, xstate.TransitionConfig<TContext, TEvent>[]];

export type AutoForwardTuple = ['autoForward', true];
