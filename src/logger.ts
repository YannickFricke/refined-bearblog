import createDebugLogger, { Debugger } from 'debug';

const ROOT_LOGGER = createDebugLogger('refined bearblog');

export function createSubLogger(
	name: string,
	parentLogger: Debugger = ROOT_LOGGER,
): Debugger {
	return parentLogger.extend(name);
}
