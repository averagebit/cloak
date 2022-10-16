import { createStore } from "solid-js/store";
import { createContext, createResource, useContext } from "solid-js";
import { createAuth, AuthActions, AuthStore } from "./auth";
import {
    createChannel,
    ChannelActions,
    ChannelState,
    defaultChannel
} from "./channel";
import { http } from "./http";
import { Channel, User } from "../shared/interfaces";

export type State = {
    channel: ChannelState;
    user: AuthStore;
};

export type Actions = {
    channel: ChannelActions;
    user: AuthActions;
};

type Store = [State, Actions];

export const MainContext = createContext();

export const initStore = () => {
    const [channel] = createResource<Channel>(() => defaultChannel);

    const initialState: State = {
        channel: channel,
        user: {} as User
    };

    const [state, setState] = createStore(initialState);
    const [authStore, authActions] = createAuth(http);
    const [channelState, channelActions] = createChannel(http);

    setState({
        channel: channelState,
        user: authStore
    });

    const actions: Actions = {
        channel: channelActions,
        user: authActions
    };

    return [state, actions];
};

export const useStore = (): Store => {
    const store = useContext(MainContext) as Store;
    console.log(store)
    return store;
};



