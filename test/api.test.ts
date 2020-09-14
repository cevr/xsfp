import { Machine } from 'xstate';
import * as x from '../src';
import * as utils from '../src/utils';

describe('xsfp', () => {
  it('extracts machine config', () => {
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
});
