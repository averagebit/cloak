import { useAuthStore } from "../store/auth";
import { createResource, Show, Signal } from "solid-js";
import { http } from "../http";
import { Button } from "./common/Button";
import { reconcile, unwrap } from "solid-js/store";
import { User } from "../shared/interfaces";

function storeUser<T>(user: T): Signal<T> {
    const [store, actions] = useAuthStore();

    return [
        (): User => store,
        (nUser: User): User => {
            actions.setUser(nUser);
            return store;
        }
    ] as Signal<T>;
}

export const Login = () => {
    const [user, actions] = useAuthStore();
    const [userResource] = createResource(() => user.authenticated, http.Auth.user, {
        initialValue: user,
        storage: storeUser
    });

    return (
        <Show when={!user.authenticated} fallback={
            <Button text="Logout" isLoading={userResource.loading} callback={() => actions.setUser(false)} />
        } keyed>
            <Button text="Login" isLoading={userResource.loading} callback={actions.setUserAuthenticated} />
        </Show>
    );
};
