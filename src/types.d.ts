import type * as xstate from 'xstate'

type StateNodeConfig<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = xstate.StateNodeConfig<
  TContext,
  TStateSchema['states'][keyof TStateSchema['states']],
  TEvent
> & {
  isInitial?: boolean;
};

type StateTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [string, StateNodeConfig<TContext, TStateSchema, TEvent>];

type StatesTuple<
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

type StateNodeConfigInitialTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'initial',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['initial']
];

type StateNodeConfigTypeTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['type', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['type']];
type StateNodeConfigContextTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'context',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['context']
];
type StateNodeConfigHistoryTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'history',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['history']
];
type StateNodeConfigStatesTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'states',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['states']
];

type StateNodeConfigInvokeTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'invoke',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['invoke']
];
type StateNodeConfigOnTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['on', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['on']];
type StateNodeConfigEntryTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['entry', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['entry']];
type StateNodeConfigExitTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['exit', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['exit']];
type StateNodeConfigOnDoneTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'onDone',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['onDone']
];
type StateNodeConfigAfterTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['after', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['after']];
type StateNodeConfigAlwaysTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'always',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['always']
];
type StateNodeConfigActivitiesTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = [
  'activities',
  xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['activities']
];
type StateNodeConfigMetaTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['meta', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['meta']];
type StateNodeConfigDataTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['data', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['data']];
type StateNodeConfigIdTuple<
  TContext = any,
  TStateSchema extends xstate.StateSchema<any> = any,
  TEvent extends xstate.EventObject = any
> = ['id', xstate.StateNodeConfig<TContext, TStateSchema, TEvent>['id']];
type StateNodeConfigTuple<
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
  | StateNodeConfigAfterTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigAlwaysTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigMetaTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigDataTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigIdTuple<TContext, TStateSchema, TEvent>
  | StateNodeConfigActivitiesTuple<TContext, TStateSchema, TEvent>;

type TransitionTuple<TContext = any, TEvent extends xstate.EventObject = any> =
  | ActionTuple<TContext, TEvent>
  | ActionGuardTuple<TContext, TEvent>;

type ActionTuple<TContext = any, TEvent extends xstate.EventObject = any> =
  | BaseActionTuple<TContext, TEvent>
  | AssignActionTuple<TContext, TEvent>
  | EffectActionTuple<TContext, TEvent>
  | ChooseActionTuple<TContext, TEvent>
  | ComposedActionTuple<TContext, TEvent>
  | KeyActionTuple;

type ActionFunctionWithCleanup<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = (
  context: TContext,
  event: TEvent,
  meta: xstate.ActionMeta<TContext, TEvent>
) => xstate.DisposeActivityFunction | void;

type KeyActionTuple = ['actions', string];

type ComposedActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.Action<TContext, TEvent>[]];

type BaseActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.Action<TContext, TEvent>];

type EffectActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = [
  'actions',
  (
    | xstate.ActionFunction<TContext, TEvent>
    | ActionFunctionWithCleanup<TContext, TEvent>
  )
];

type AssignActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.AssignAction<TContext, TEvent>];

type ActionGuardTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['cond', xstate.Condition<TContext, TEvent>];

type ChooseActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.ChooseAction<TContext, TEvent>];

type Delay<TContext = any, TEvent extends xstate.EventObject = any> =
  | number
  | ((context: TContext, event: TEvent) => number);

type DelayedTransitionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = [Delay<TContext, TEvent>, xstate.TransitionConfig<TContext, TEvent>[]];
