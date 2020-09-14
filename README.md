An API to use [xstate](https://xstate.js.org/docs/) in a composable way!

## Installation

```bash
npm install xstate xsfp
```

## Overview

```js
import { interpret } from 'xstate';
import * as x from 'xsfp';

// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.

// Original way
// const toggleMachine = createMachine({
//   id: 'toggle',
//   initial: 'inactive',
//   states: {
//     inactive: { on: { TOGGLE: 'active' } },
//     active: { on: { TOGGLE: 'inactive' } },
//   },
// });

// xsfp way
const toggleMachine = x.createMachine(
  x.id('toggle'),
  x.states(
    // first state is implicitly the initial state
    // can also be explicit with x.initialState('inactive', ...)
    x.state('inactive', x.on('TOGGLE', 'active')),
    // can also explcitly make transitions
    // provides clarity for single events with multiple transitions
    x.state('active', x.on('TOGGLE', x.transition('inactive')))
  )
);

// Machine instance with internal state
const toggleService = interpret(toggleMachine)
  .onTransition(state => console.log(state.value))
  .start();
// => 'inactive'

toggleService.send('TOGGLE');
// => 'active'

toggleService.send('TOGGLE');
// => 'inactive'
```

## Promise example

```js
import { interpret } from 'xstate';
import * as x from 'xsfp';

const fetchMachine = x.createMachine(
  x.id('SWAPI'),
  x.context({ user: null }),
  x.states(
    x.initialState('idle', x.on('FETCH', 'loading')),
    x.state(
      'loading',
      x.invoke(
        (context, event) =>
          fetch('https://swapi.dev/api/people/1').then(res => res.data),
        x.id('fetchLuke'),
        // 'done' and 'error' are reserved events
        x.on('done', 'resolved', x.assign({ user: (_, event) => event.data })),
        x.on('error', 'rejected')
      ),
      x.on('CANCEL', 'idle')
    ),
    x.state('rejected', x.on('FETCH', 'loading')),
    x.finalState('resolved')
  )
);

const swService = interpret(fetchMachine)
  .onTransition(state => console.log(state.value))
  .start();

swService.send('FETCH');
```

## Finite State Machines

```js
import * as x from 'xsfp';

const lightMachine = x.createMachine(
  x.id('light'),
  x.states(
    x.state('green', x.on('TIMER', 'yellow')),
    x.state('yellow', x.on('TIMER', 'red')),
    x.state('red', x.on('TIMER', 'green'))
  )
);

const currentState = 'green';

const nextState = lightMachine.transition(currentState, 'TIMER').value;

// => 'yellow'
```

## Hierarchical (Nested) State Machines

```js
import * as x from 'xsfp';

const pedestrianStates = x.states(
  x.state('walk', x.on('PED_TIMER', 'wait')),
  x.state('wait', x.on('PED_TIMER', 'stop')),
  x.state('stop')
);

const lightMachine = x.createMachine(
  x.id('light'),
  x.state('green', x.on('TIMER', 'yellow')),
  x.state('yellow', x.on('TIMER', 'red')),
  x.state('red', x.on('TIMER', 'green'), pedestrianStates)
);

const currentState = 'yellow';

const nextState = lightMachine.transition(currentState, 'TIMER').value;
// => {
//   red: 'walk'
// }

lightMachine.transition('red.walk', 'PED_TIMER').value;
// => {
//   red: 'wait'
// }
```

## Parallel State Machines

```js
const toggleStates = (toggleEvent: string) =>
  x.states(
    x.state('on', x.on(toggleEvent, 'off')),
    x.state('off', x.on(toggleEvent, 'on'))
  );

const wordMachine = x.createMachine(
  x.id('word'),
  x.parallelStates(
    x.state('bold', toggleStates('TOGGLE_BOLD')),
    x.state('underline', toggleStates('TOGGLE_UNDERLINE')),
    x.state('italics', toggleStates('TOGGLE_ITALICS')),
    x.state(
      'list',
      x.states(
        x.state('none', x.on('BULLETS', 'bullets'), x.on('NUMBERS', 'numbers')),
        x.state('bullets', x.on('NONE', 'none'), x.on('NUMBERS', 'numbers')),
        x.state('numbers', x.on('BULLETS', 'bullets'), x.on('NONE', 'none'))
      )
    )
  )
);

const boldState = wordMachine.transition('bold.off', 'TOGGLE_BOLD').value;

// {
//   bold: 'on',
//   italics: 'off',
//   underline: 'off',
//   list: 'none'
// }

const nextState = wordMachine.transition(
  {
    bold: 'off',
    italics: 'off',
    underline: 'on',
    list: 'bullets',
  },
  'TOGGLE_ITALICS'
).value;

// {
//   bold: 'off',
//   italics: 'on',
//   underline: 'on',
//   list: 'bullets'
// }
```

## History States

```js
const paymentMachine = x.createMachine(
  x.id('payment'),
  x.states(
    x.state(
      'method',
      x.on('NEXT', 'review'),
      x.state('cash', x.on('SWITCH_CHECK', 'check')),
      x.state('check', x.on('SWITCH_CASH', 'cash')),
      x.historyState('hist')
    ),
    x.state('review', x.on('PREVIOUS', 'method.hist'))
  )
);

const checkState = paymentMachine.transition('method.cash', 'SWITCH_CHECK');

// => State {
//   value: { method: 'check' },
//   history: State { ... }
// }

const reviewState = paymentMachine.transition(checkState, 'NEXT');

// => State {
//   value: 'review',
//   history: State { ... }
// }

const previousState = paymentMachine.transition(reviewState, 'PREVIOUS').value;

// => { method: 'check' }
```

## Contribution

Please feel free to make issues and PRs!

## API

The API will not go into too much details, as the library expects the user to have an understanding of how [xstate](https://xstate.js.org/docs/) works.

### states | parallelStates

`states` | `parallelStates` is a function that takes `state` | `initialState` | `finalState` | `historyState` as arguments.

The `initialState` function OR the first `state` function determines the initial state

```js
states(
  initialState('initial'),
  state('second'),
  historyState('hist'),
  finalState('final')
);
```

### state | initialState | historyState | finalState

`state` | `initialState` is a function expects that all the same arguments as `createMachine`.

`historyState` | `finalState` expect no arguments

```js
state(
  states(),
  parallelStates(),
  id(),
  context(),
  history(),
  on(),
  invoke(),
  entry(),
  exit(),
  after(),
  always(),
  activties(),
  meta(),
  data(),
  delimiter()
);
```

### on

`on` is used to describe events and its transitions

```ts
function on(event: string, ...Transition);
```

A `guard` acts as the condition that determines whether the transition described before it will run

```js
on('CLICK', 'open');

// both below are equivalent
on(
  'CLICK',
  'open',
  effect((context, event) => {
    context.refs[event.name]?.open();
  })
);
on(
  'CLICK',
  transition(
    'open',
    effect((context, event) => {
      context.refs[event.name]?.open();
    })
  )
);

// both are equiavalent
on(
  'CLICK',
  'open',
  effect((context, event) => {
    context.refs[event.name]?.open();
  }),
  guard((context, event) => {
    // if false, the effect before will not run
    return context.canOpen;
  })
);

on(
  'CLICK',
  transition(
    'open',
    effect((context, event) => {
      context.refs[event.name]?.open();
    }),
    guard((context, event) => {
      // if false, the effect before will not run
      return context.canOpen;
    })
  )
);
```

A `guard` will also implicitly act as boundaries between different transitions

```js
on(
  'BLUR',
  'error',
  guard((context, event) => !event.value),
  // this will run only if the guard above is false
  'idle',
  assign({ value: (context, event) => event.value })
);

// transitions make this explicit
on(
  'BLUR',
  transition(
    'error',
    guard((context, event) => !event.value)
  ),
  // this will run only if the guard above is false
  transition('idle', assign({ value: (context, event) => event.value }))
);
```

### transition

`transition` is a function that describes an event transition. If a target is specified, it must be the first argument.

It accepts the target state and `assign` | `effect` | `action` | `choose` | `guard` as arguments.

If a `guard` is specified it must be the last argument.

```js
transition('idle');

transition('idle', assign({ value: (context, event) => event.value }));

transition(
  action('setValue'),
  effect((context, event) => {
    context.refs[event.name]?.focus();
  }),
  guard((context, event) => Boolean(event.value))
);
```

### action

`action` is a function that accepts an action config key as the argument

```js
action('setValue');
```

### effect

`effect` is a function that accepts an action function as the argument

Also accepts a cleanup function that will be called within `activities`

```ts
function effect<TContext, TEvent>((context: TContext, event: TEvent) => void | (() => void))

effect((context, event) => {
  context.refs[event.name]?.focus();
});

activities(effect((context) => {
  const intervalId = setInterval(() => {
    // ...
  }, context.timeout)
  return () = {
    clearInterval(interalId)
  }
}))
```

### guard

`guard` is a function that returns a boolean. To be used within `on` or as the last argument of `transition`

```ts
function guard<TContext, TEvent>((context: TContext, event: TEvent) => boolean)

guard(context, event => Boolean(context.values[event.name]))
```

### entry | exit | always

`entry` | `exit` | `always` are functions that expect the same arguments as `on` (minus the event name)

```ts
entry(
  'error',
  guard((context, event) => !event.value),
  // this will run only if the guard above is false
  'idle',
  assign({ value: (context, event) => event.value })
);

exit(
  'error',
  guard((context, event) => !event.value),
  // this will run only if the guard above is false
  'idle',
  assign({ value: (context, event) => event.value })
);

always(
  'error',
  guard((context, event) => !event.value),
  // this will run only if the guard above is false
  'idle',
  assign({ value: (context, event) => event.value })
);
```

### choose

`choose` accepts the same arguments as `transition` (except for a target state)
`Guard` acts as action boundaries as well

```js
x.choose(
  x.action('onSave'),
  x.guard(context => Boolean(context.value)),
  // will do action below if guard is false
  x.assign({
  value: (context) => context.initialValue,
});
);
```

### choice

`choice` accepts the same arguments as `transition` (except for a target state).
Useful for explicitly setting boundaries
(analagous to `transition` within `on`)

```js
x.choose(
  x.choice(
    x.action('onSave'),
    x.guard(context => Boolean(context.value))
  ),
  // will do action below if guard is false
  x.choice(
    x.assign({
      value: context => context.initialValue,
    })
  )
);
```

### after

`after` is a function that takes accepts `delay` arguments

```ts
after(
  2000,
  effect((context, event) => {
    context.refs[event.name]?.focus();
  })
);

after(
  (context, event) => {
    context.values[event.name] ? 2000 : 3000;
  },
  effect((context, event) => {
    context.refs[event.name]?.focus();
  })
);
```

### delay

```ts
function delay<TContext, TEvent>(
  delay: number | ((context: TContext, event: TEvent) => number),
  ...Effects
);
```

### invoke

`invoke` accepts the `src` type as the first argument, and `on` | `id` | `data` | `autoForward`

`'done'` and `'error'` events are reserved for the respective `onDone` and `onError` configs

```js
x.invoke(
  (context, event) =>
    fetch('https://swapi.dev/api/people/1').then(res => res.data),
  x.id('fetchLuke'),
  // 'done' and 'error' are reserved events
  x.on('done', 'resolved', x.assign({ user: (_, event) => event.data })),
  x.on('error', 'rejected')
);
```

### id

`id` is a function that takes a `string`

```ts
function id(id: string);
```

### context

`context` is a function that takes the context of the machine or a function that returns the context of the machine

```ts
function context<TContext>(context: TContext | () => TContext)
```

### history

`history` is a function that takes the history types

```ts
function history(type: 'shallow' | 'deep' | 'none');
```
