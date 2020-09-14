import { __assign, __read, __rest, __spread } from "tslib";
export function last(array) {
    return array[array.length - 1];
}
export function extractStates(args) {
    var states = args.find(function (_a) {
        var _b = __read(_a, 1), maybeArray = _b[0];
        return Array.isArray(maybeArray);
    });
    return __spread(args.filter(function (_a) {
        var _b = __read(_a, 1), maybeArray = _b[0];
        return !Array.isArray(maybeArray);
    }), (states !== null && states !== void 0 ? states : []));
}
export function extractConfig(args) {
    var nextArgs = extractEvents(extractStates(args));
    return Object.fromEntries(nextArgs);
}
export function extractEvents(args) {
    var events = args.filter(function (_a) {
        var _b = __read(_a, 1), key = _b[0];
        return key === 'on';
    });
    var nextArgs = args.filter(function (_a) {
        var _b = __read(_a, 1), key = _b[0];
        return key !== 'on';
    });
    if (events.length) {
        var _a = events.reduce(function (events, _a) {
            var _b = __read(_a, 2), _key = _b[0], event = _b[1];
            return (__assign(__assign({}, events), event));
        }, {}), done = _a.done, reducedEvents = __rest(_a, ["done"]);
        if (done) {
            // we destructure done because it's a reserved event
            nextArgs.push(['onDone', done]);
        }
        nextArgs.push(['on', reducedEvents]);
    }
    return nextArgs;
}
export function extractActions(args) {
    return args
        .filter(function (_a) {
        var _b = __read(_a, 1), key = _b[0];
        return key === 'actions';
    })
        .map(function (_a) {
        var _b = __read(_a, 2), _key = _b[0], actions = _b[1];
        return actions;
    })
        .flat();
}
export function extractGuards(args) {
    return args.filter(function (_a) {
        var _b = __read(_a, 1), key = _b[0];
        return key === 'cond';
    }).map(function (_a) {
        var _b = __read(_a, 2), _key = _b[0], guards = _b[1];
        return guards;
    });
}
export function extractTransitions(args) {
    return args.reduce(function (transitions, maybeTransitionTuple) {
        if (typeof maybeTransitionTuple === 'object' &&
            !Array.isArray(maybeTransitionTuple)) {
            // if its an object, then its a transition object made from the transition function
            transitions.push(maybeTransitionTuple);
            return transitions;
        }
        var currentTransition = last(transitions);
        // if the currentTransition has cond defined, the next args will describe a new transition
        // until the next the end or until another cond is defined
        if (!currentTransition || currentTransition.cond) {
            currentTransition = {};
            transitions.push(currentTransition);
        }
        if (typeof maybeTransitionTuple === 'string') {
            // if it's a string, then we'll treat it as a transition target
            currentTransition.target = maybeTransitionTuple;
        }
        if (Array.isArray(maybeTransitionTuple)) {
            // if its an array then it's a tuple
            var _a = __read(maybeTransitionTuple, 2), type = _a[0], config = _a[1];
            if (type === 'actions') {
                var actions = currentTransition.actions
                    ? __spread(currentTransition.actions, [config])
                    : [config];
                currentTransition.actions = actions;
            }
            if (type === 'cond') {
                currentTransition.cond = config;
            }
        }
        return transitions;
    }, []);
}
//# sourceMappingURL=utils.js.map