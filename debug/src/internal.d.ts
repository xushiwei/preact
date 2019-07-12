import { Component, PreactElement, VNode } from "../../src/internal";

export { Component, PreactElement, VNode };

export interface RendererConfig {
	/** 1 = DEV, 0 = production */
	bundleType: 1 | 0;
	/** The devtools enable different features for different versions of react */
	version: string;
	/** Informative string, currently unused in the devtools  */
	rendererPackageName: string;
	/** Find the root dom node of a vnode */
	findHostInstanceByFiber(vnode: VNode): HTMLElement | Text | null;
	/** Find the closest vnode given a dom node */
	findFiberByHostInstance(instance: HTMLElement): VNode | null;
}

export interface DevtoolsUpdater {
	setState(objOrFn: any): void;
	forceUpdate(): void;
	setInState(path: Array<string | number>, value: any): void;
	setInProps(path: Array<string | number>, value: any): void;
	setInContext(): void;
}

export type NodeType = "Composite" | "Native" | "Wrapper" | "Text";

export interface DevtoolData {
	nodeType: NodeType;
	// Component type
	type: any;
	name: string;
	ref: any;
	key: string | number;
	updater: DevtoolsUpdater | null;
	text: string | number | null;
	state: any;
	props: any;
	children: VNode[] | string | number | null;
	publicInstance: PreactElement | Text | Component;
	memoizedInteractions: any[];

	actualDuration: number,
	actualStartTime: number,
	treeBaseDuration: number,
}

export type EventType = 'unmount' | 'rootCommitted' | 'root' | 'mount' | 'update' | 'updateProfileTimes';

export interface DevtoolsEvent {
	data?: DevtoolData;
	internalInstance: VNode;
	renderer: string;
	type: EventType;
}

export interface DevtoolsHook {
	renderers: Map<string, any>;
	isDisabled?: boolean;
	on(ev: string, listener: () => void): void;
	emit(ev: string, data?: object): void;
	getFiberRoots(rendererId: number): Set<any>;
	inject(config: { renderer: RendererConfig, reactBuildType: number }): string;
	onCommitFiberRoot(rendererId: number, root: VNode): void;
	onCommitFiberUnmount(rendererId: number, vnode: VNode): void;
}

export interface DevtoolsHookMock extends DevtoolsHook {
	emit: DevtoolsHook['emit'] & Sinon.Spy;
	inject: DevtoolsHook['inject'] & Sinon.Spy;
}

export interface DevtoolsMock {
	hook: DevtoolsHookMock;
	connect(): void;
}

export interface DevtoolsWindow extends Window {
	/**
	 * If the devtools extension is installed it will inject this object into
	 * the dom. This hook handles all communications between preact and the
	 * devtools panel.
	 */
	__REACT_DEVTOOLS_GLOBAL_HOOK__?: DevtoolsHook;
	/**
	 * Custom attach function to supply a custom renderer
	 */
	__REACT_DEVTOOLS_ATTACH__?: (hook: DevtoolsHook, id: number, renderer: any, target: Window) => any;
}

export interface AdapterState {
	connected: boolean;
	rendererId: number;
	currentRootId: number;
	pending: any[];
	isProfiling: boolean;
}
