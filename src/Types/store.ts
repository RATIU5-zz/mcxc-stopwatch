export type StoreStateObj = {
	[key: string]: any;
};
export type StoreActionsObj = {
	[key: string]: (globalState: StoreStateObj, payload?: ActionPayload) => StoreStateObj;
};

export type StoreListener = (p: StoreStateObj) => void;

export type ActionPayload = string | number | {} | (() => void);

export type StoreDispatchProps = {
	actionIdentifier: string;
	payload?: ActionPayload;
};
