import { Machine } from 'xstate';
import * as x from '../src';

describe('xsfp', () => {
  it('creates valid and equivalent xstate machines', () => {
    const normalMachine = Machine({
      id: 'toggle',
      initial: 'inactive',
      activities: ['activity'],
      states: {
        inactive: { on: { TOGGLE: [{ target: 'active' }] } },
        active: {
          type: 'parallel',
          on: {
            TOGGLE: [
              {
                target: 'inactive',
                actions: [
                  {
                    type: 'xstate.assign',
                    assignment: { test: 'test' },
                  },
                  {
                    type: 'function () { }',
                  },
                ],
              },
            ],
          },
          entry: [{ type: 'test' }],
          exit: [{ type: 'test' }],
          always: [{ target: 'inactive' }],
          states: {
            parallel1: {},
            parallel2: {},
          },
        },
        hist: {
          type: 'history',
          history: 'shallow',
        },
        final: {
          type: 'final',
        },
      },
    });
    const xsfpMachine = x.createMachine(
      x.id('toggle'),
      x.activities('activity'),
      x.states(
        x.initialState('inactive', x.on('TOGGLE', 'active')),
        x.state(
          'active',
          x.on(
            'TOGGLE',
            'inactive',
            x.assign({ test: 'test' }),
            x.effect(() => {})
          ),
          x.entry(x.action('test')),
          x.exit(x.action('test')),
          x.always('inactive'),
          x.parallelStates(x.state('parallel1'), x.state('parallel2'))
        ),
        x.historyState('hist'),
        x.finalState('final')
      )
    );
    expect(JSON.stringify(xsfpMachine.toJSON())).toEqual(
      JSON.stringify(normalMachine.toJSON())
    );
  });
});
