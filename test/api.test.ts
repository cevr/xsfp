import { Machine } from 'xstate';
import * as x from '../src';
import * as utils from '../src/utils';

describe('xsfp', () => {
  it('creates valid xstate machine configs', () => {
    const config = {
      id: 'toggle',
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: [{ target: 'active' }] } },
        active: { on: { TOGGLE: [{ target: 'inactive' }] } },
      },
    };
    const machineConfig = [
      x.id('toggle'),
      x.states(
        x.state('inactive', x.on('TOGGLE', 'active')),
        x.state('active', x.on('TOGGLE', 'inactive'))
      ),
    ];
    const xsfpConfig = utils.extractConfig(machineConfig);
    expect(xsfpConfig).toEqual(config);
    expect(JSON.stringify(Machine(xsfpConfig).toJSON())).toBe(
      JSON.stringify(Machine(config).toJSON())
    );
  });

  it('maps reserved events', () => {
    const config = {
      id: 'toggle',
      initial: 'inactive',
      states: {
        active: {
          invoke: {
            src: 'promise',
            onDone: [{ target: 'inactive' }],
            onError: [{ target: 'inactive' }],
          },
        },
        inactive: {},
      },
    };

    const machineConfig = [
      x.id('toggle'),
      x.states(
        x.state(
          'active',
          x.invoke(
            'promise',
            x.on('done', 'inactive'),
            x.on('error', 'inactive')
          )
        ),
        x.initialState('inactive')
      ),
    ];

    const xsfpConfig = utils.extractConfig(machineConfig);

    expect(xsfpConfig).toEqual(config);
    expect(JSON.stringify(Machine(xsfpConfig).toJSON())).toBe(
      JSON.stringify(Machine(config).toJSON())
    );
  });
});
