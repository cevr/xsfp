import { __assign, __read, __spread } from "tslib";
import { Machine, assign as xAssign } from 'xstate';
import { choose as xChoose } from 'xstate/lib/actions';
import * as utils from './utils';
export function states() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var maybeInitialStateTuple = args.find(function (_a) {
        var _b = __read(_a, 2), _key = _b[0], stateConfig = _b[1];
        return stateConfig.isInitial;
    });
    var initialTuple;
    if (maybeInitialStateTuple) {
        var _a = __read(maybeInitialStateTuple, 2), stateName = _a[0], config = _a[1];
        initialTuple = ['initial', stateName];
        delete config.isInitial;
    }
    else {
        var _b = __read(args, 1), _c = __read(_b[0], 1), firstStateKey = _c[0];
        initialTuple = ['initial', firstStateKey];
    }
    var states = Object.fromEntries(args);
    return [['states', states], initialTuple];
}
export function parallel() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var states = Object.fromEntries(args);
    return [
        ['states', states],
        ['type', 'parallel'],
    ];
}
export function initial(stateName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var _a = __read(state.apply(void 0, __spread([stateName], args)), 2), stateConfig = _a[1];
    return [stateName, __assign(__assign({}, stateConfig), { isInitial: true })];
}
export function state(stateName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return [
        stateName,
        utils.extractConfig(args),
    ];
}
export function final(stateName) {
    return [stateName, { type: 'final' }];
}
export function on(event) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var eventTuple = [event, utils.extractTransitions(args)];
    return ['on', Object.fromEntries([eventTuple])];
}
export function assign(assignment) {
    return ['actions', xAssign(assignment)];
}
export function action(act) {
    return ['actions', act];
}
export function effect(effect) {
    return ['actions', effect];
}
export function guard(cond) {
    return ['cond', cond];
}
export function transition() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var actions = utils.extractActions(args);
    var cond = utils.last(utils.extractGuards(args));
    return {
        target: args.find(function (arg) {
            return typeof arg === 'string';
        }),
        actions: actions.length ? actions : undefined,
        cond: cond
    };
}
export function invoke(src) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var on = args
        .filter(function (_a) {
        var _b = __read(_a, 1), key = _b[0];
        return key === 'on';
    })
        .reduce(function (events, _a) {
        var _b = __read(_a, 2), _key = _b[0], event = _b[1];
        return (__assign(__assign({}, events), event));
    }, {});
    return [
        'invoke',
        {
            src: src,
            onDone: on.done,
            onError: on.error
        },
    ];
}
export function always() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return ['always', utils.extractTransitions(args)];
}
export function choose() {
    var choices = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        choices[_i] = arguments[_i];
    }
    return [
        'actions',
        xChoose(
        // we can leverage the extractTransitions function because we disallow strings at the type level
        utils.extractTransitions(choices)),
    ];
}
export function choice() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var actions = utils.extractActions(args);
    var cond = utils.last(utils.extractGuards(args));
    return {
        cond: cond,
        actions: actions
    };
}
export function id(name) {
    return ['id', name];
}
export function entry() {
    var actions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        actions[_i] = arguments[_i];
    }
    return ['entry', utils.extractActions(actions)];
}
export function exit() {
    var actions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        actions[_i] = arguments[_i];
    }
    return ['exit', utils.extractActions(actions)];
}
export function meta(meta) {
    return ['meta', meta];
}
export function data(data) {
    return ['data', data];
}
export function history(history) {
    return ['history', history === 'none' ? false : history];
}
export function context(context) {
    return ['context', context];
}
export function activities() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var activities = args.map(function (_a) {
        var _b = __read(_a, 2), activity = _b[1];
        var name = activity.name || activity.toString();
        return {
            id: name,
            type: name,
            exec: activity
        };
    });
    return ['activities', activities];
}
export function after() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return ['after', Object.fromEntries(args)];
}
export function delay(delay) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return [delay, utils.extractTransitions(args)];
}
export function composeActions() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var actions = utils.extractActions(args);
    return ['actions', actions];
}
export function createMachine() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var config = utils.extractConfig(args);
    return Machine(config);
}
//# sourceMappingURL=index.js.map