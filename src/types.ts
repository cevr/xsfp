import * as xstate from 'xstate';

export type StateNodeConfig<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
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
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
> = [string, StateNodeConfig<TContext, TEvent, TStateSchema>];

export type StatesTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
> = [
  StateNodeConfigStatesTuple<TContext, TEvent, TStateSchema>,
  StateNodeConfigInitialTuple<TStateSchema> | StateNodeConfigTypeTuple
];

export type StateNodeConfigInitialTuple<
  TStateSchema extends xstate.StateSchema<any> = any
> = ['initial', keyof TStateSchema['states']];
export type StateNodeConfigDelimiterTuple = ['delimiter', string];
export type StateNodeConfigTypeTuple = [
  'type',
  'atomic' | 'compound' | 'parallel' | 'final' | 'history'
];
export type StateNodeConfigContextTuple<TContext = any> = [
  'context',
  Partial<TContext> | (() => Partial<TContext>)
];
export type StateNodeConfigHistoryTuple = [
  'history',
  'shallow' | 'deep' | boolean | undefined
];
export type StateNodeConfigStatesTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
> = ['states', xstate.StatesConfig<TContext, TStateSchema, TEvent>];

export type StateNodeConfigInvokeTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = [
  'invoke',
  (xstate.InvokeConfig<TContext, TEvent> | xstate.StateMachine<any, any, any>)[]
];
export type StateNodeConfigOnTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['on', xstate.TransitionsConfig<TContext, TEvent>];
export type StateNodeConfigEntryTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['entry', xstate.Action<TContext, TEvent>[]];
export type StateNodeConfigExitTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['exit', xstate.Action<TContext, TEvent>[]];
export type StateNodeConfigOnDoneTuple<
  TContext = any,
  TEvent extends xstate.DoneEventObject = any
> = ['onDone', xstate.TransitionConfig<TContext, TEvent>[]];
export type OnErrorTuple<
  TContext = any,
  TEvent extends xstate.DoneInvokeEvent<any> = any
> = ['onError', (string | xstate.TransitionConfig<TContext, TEvent>)[]];
export type StateNodeConfigAfterTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['after', xstate.DelayedTransitions<TContext, TEvent>];
export type StateNodeConfigAlwaysTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = [
  'always',
  (
    | xstate.TransitionConfigTarget<TContext, TEvent>
    | xstate.TransitionConfig<TContext, TEvent>
  )[]
];
export type StateNodeConfigActivitiesTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['activities', xstate.Activity<TContext, TEvent>[]];
export type StateNodeConfigMetaTuple<
  TStateSchema extends xstate.StateSchema<any> = any
> = [
  'meta',
  TStateSchema extends {
    meta: infer D;
  }
    ? D
    : any
];
export type StateNodeConfigDataTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = [
  'data',
  (
    | xstate.Mapper<TContext, TEvent, any>
    | xstate.PropertyMapper<TContext, TEvent, any>
  )
];
export type StateNodeConfigIdTuple = ['id', string];
export type StateNodeConfigTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any,
  TStateSchema extends xstate.StateSchema<any> = any
> =
  | StateNodeConfigInitialTuple<TStateSchema>
  | StateNodeConfigTypeTuple
  | StateNodeConfigContextTuple<TContext>
  | StateNodeConfigHistoryTuple
  | StateNodeConfigStatesTuple<TContext, TEvent, TStateSchema>
  | StateNodeConfigInvokeTuple<TContext, TEvent>
  | StateNodeConfigOnTuple<TContext, TEvent>
  | StateNodeConfigEntryTuple<TContext, TEvent>
  | StateNodeConfigExitTuple<TContext, TEvent>
  | StateNodeConfigOnDoneTuple<TContext, TEvent>
  | StateNodeConfigAfterTuple<TContext, TEvent>
  | StateNodeConfigAlwaysTuple<TContext, TEvent>
  | StateNodeConfigMetaTuple<TStateSchema>
  | StateNodeConfigDataTuple<TContext, TEvent>
  | StateNodeConfigIdTuple
  | StateNodeConfigActivitiesTuple<TContext, TEvent>
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
  | PureActionTuple<TContext, TEvent>
  | KeyActionTuple;

export type PureActionTuple<
  TContext = any,
  TEvent extends xstate.EventObject = any
> = ['actions', xstate.PureAction<TContext, TEvent>];

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
