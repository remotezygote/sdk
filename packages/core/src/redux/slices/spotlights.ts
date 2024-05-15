import { createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ClientView } from "../types";
import { AddSpotlightRequest, type RemoveSpotlightRequest, type Spotlight } from "@whereby.com/media";
import { selectSignalConnectionRaw, signalEvents } from "./signalConnection";
import { selectLocalParticipantRaw } from "./localParticipant";
import { createAppAuthorizedThunk } from "../thunk";
import { selectIsAuthorizedToSpotlight } from "./authorization";
import { selectAllClientViews } from "./room";

/**
 * State mapping utils
 */

export function streamIdForClient({ isPresentation, stream }: Pick<ClientView, "isPresentation" | "stream">) {
    // outboundId and inboundId are the streamId's used by SFU V2
    return isPresentation ? stream?.outboundId ?? stream?.inboundId ?? stream?.id : "0";
}

export function isClientSpotlighted({
    spotlights,
    isPresentation,
    clientId,
    stream,
}: {
    spotlights: Spotlight[];
    isPresentation?: boolean;
    clientId: string;
    stream: ClientView["stream"];
}) {
    return !!spotlights.find((s) => {
        const streamId = streamIdForClient({ isPresentation, stream });
        return s.clientId === clientId && s.streamId === streamId;
    });
}

function mergeSpotlight(spotlights: Spotlight[], spotlight: Spotlight) {
    const found = spotlights.find((s) => s.clientId === spotlight.clientId && s.streamId === spotlight.streamId);
    if (found) {
        return spotlights;
    }
    return spotlights.concat(spotlight);
}

function mapSpotlightsToClientViews(spotlights: Spotlight[], clientViews: ClientView[]) {
    return spotlights.reduce((acc, s) => {
        const clientView = clientViews.find((c) => s.clientId === c.clientId && s.streamId === streamIdForClient(c));
        if (clientView && !acc.includes(clientView)) {
            acc.push(clientView);
        }
        return acc;
    }, [] as ClientView[]);
}

/**
 * Reducer
 */

export interface SpotlightsState {
    sorted: { clientId: string; streamId: string }[];
}

const initialState: SpotlightsState = {
    sorted: [],
};

export const spotlightsSlice = createSlice({
    name: "spotlights",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signalEvents.roomJoined, (state, action) => {
            if (!action.payload.room) {
                return state;
            }

            const { spotlights } = action.payload.room;

            return {
                ...state,
                sorted: spotlights,
            };
        });
        builder.addCase(signalEvents.spotlightAdded, (state, action) => {
            const { clientId, streamId } = action.payload;
            return {
                ...state,
                sorted: mergeSpotlight(state.sorted, { clientId, streamId }),
            };
        });
        builder.addCase(signalEvents.spotlightRemoved, (state, action) => {
            const { clientId, streamId } = action.payload;
            return {
                ...state,
                sorted: state.sorted.filter((s) => !(s.clientId === clientId && s.streamId === streamId)),
            };
        });
        builder.addMatcher(isAnyOf(signalEvents.clientKicked, signalEvents.clientLeft), (state, action) => {
            const { clientId } = action.payload;
            return {
                ...state,
                sorted: state.sorted.filter((s) => s.clientId !== clientId),
            };
        });
    },
});

/**
 * Action creators
 */

export const doSpotlightParticipant = createAppAuthorizedThunk(
    (state) => selectIsAuthorizedToSpotlight(state),
    ({ id }: { id: string }) =>
        (_, getState) => {
            const state = getState();
            const clientView = selectAllClientViews(state).find((c) => c.clientId === id);

            if (!clientView) {
                return;
            }
            const { socket } = selectSignalConnectionRaw(state);
            const streamId = streamIdForClient(clientView);
            const payload: AddSpotlightRequest = { clientId: clientView.id, streamId: streamId ?? "0" };
            socket?.emit("add_spotlight", payload);
        },
);

export const doRemoveSpotlight = createAppAuthorizedThunk(
    (state) => selectIsAuthorizedToSpotlight(state),
    ({ id }: { id: string }) =>
        (_, getState) => {
            const state = getState();
            const clientView = selectAllClientViews(state).find((c) => c.clientId === id);

            if (!clientView) {
                return;
            }
            const { socket } = selectSignalConnectionRaw(state);
            const streamId = streamIdForClient(clientView);
            const payload: RemoveSpotlightRequest = { clientId: clientView.id, streamId: streamId ?? "0" };

            socket?.emit("remove_spotlight", payload);
        },
);

/**
 * Selectors
 */

export const selectSpotlightsRaw = (state: RootState) => state.spotlights;
export const selectSpotlights = (state: RootState) => state.spotlights.sorted;
export const selectIsLocalParticipantSpotlighted = createSelector(
    selectLocalParticipantRaw,
    selectSpotlights,
    (localParticipant, spotlights) => {
        return isClientSpotlighted({ clientId: localParticipant.id, stream: localParticipant.stream, spotlights });
    },
);
export const selectSpotlightedClientViews = createSelector(
    selectAllClientViews,
    selectSpotlights,
    (clientViews, spotlights) => {
        return mapSpotlightsToClientViews(spotlights, clientViews);
    },
);
