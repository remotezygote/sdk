import React, { useEffect, useState } from "react";
import DisplayNameForm from "./DisplayNameForm";
import { UseLocalMediaResult } from "../../lib/react/useLocalMedia/types";
import { useRoomConnection } from "../../lib/react/useRoomConnection";
import { NotificationEvent, NotificationLogLevel } from "packages/core/dist";

export default function VideoExperience({
    displayName,
    roomName,
    roomKey,
    localMedia,
    externalId,
    showHostControls,
    hostOptions,
}: {
    displayName?: string;
    roomName: string;
    roomKey?: string;
    localMedia?: UseLocalMediaResult;
    externalId?: string;
    showHostControls?: boolean;
    hostOptions?: Array<string>;
}) {
    const [chatMessage, setChatMessage] = useState("");
    const [notifications, setNotifications] = useState<Array<string>>([]);
    const [isLocalScreenshareActive, setIsLocalScreenshareActive] = useState(false);

    const { state, actions, components } = useRoomConnection(roomName, {
        localMediaOptions: {
            audio: true,
            video: true,
        },
        ...(Boolean(displayName) && { displayName }),
        ...(Boolean(roomKey) && { roomKey }),
        ...(Boolean(localMedia) && { localMedia }),
        ...(Boolean(externalId) && { externalId }),
    });

    const { localParticipant, remoteParticipants, connectionStatus, waitingParticipants, screenshares, events } = state;
    const {
        knock,
        sendChatMessage,
        setDisplayName,
        joinRoom,
        leaveRoom,
        lockRoom,
        muteParticipants,
        kickParticipant,
        endMeeting,
        toggleCamera,
        toggleMicrophone,
        toggleLowDataMode,
        toggleRaiseHand,
        acceptWaitingParticipant,
        rejectWaitingParticipant,
        startScreenshare,
        stopScreenshare,
    } = actions;
    const { VideoView } = components;

    useEffect(() => {
        const sdkLogLevels: Array<NotificationLogLevel> = ["debug", "log", "info", "warn", "error"];
        const sdkEventHandler = ({ timestamp, message, type, level }: NotificationEvent) => {
            const localDate = new Date(timestamp).toLocaleString();
            setNotifications((notifications) => [...notifications, `[${level}] ${localDate}: ${message} (${type})`]);
        };

        sdkLogLevels.map((logLevel) => events?.on(logLevel, sdkEventHandler));

        return () => {
            sdkLogLevels.map((logLevel) => events?.off(logLevel, sdkEventHandler));
        };
    }, [events]);

    return (
        <div>
            {connectionStatus === "connecting" && <span>Connecting...</span>}
            {connectionStatus === "room_locked" && (
                <div style={{ color: "red" }}>
                    <span>Room locked, please knock....</span>
                    <button onClick={() => knock()}>Knock</button>
                </div>
            )}
            {connectionStatus === "knocking" && <span>Knocking...</span>}
            {connectionStatus === "knock_rejected" && <span>Rejected :(</span>}
            {connectionStatus === "connected" && (
                <>
                    <div className="chat">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendChatMessage(chatMessage);
                                setChatMessage("");
                            }}
                        >
                            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                            <button type="submit">Send message</button>
                        </form>
                    </div>
                    <div className="waiting_room">
                        <h2>Waiting room</h2>
                        {waitingParticipants.map((p) => {
                            return (
                                <div key={p.id}>
                                    Waiting: {p.displayName || "unknown"} {p.id}
                                    <button onClick={() => acceptWaitingParticipant(p.id)}>Accept</button>
                                    <button onClick={() => rejectWaitingParticipant(p.id)}>Reject</button>
                                </div>
                            );
                        })}
                    </div>
                    {showHostControls && (
                        <div className="hostControls">
                            Host controls:
                            <button
                                onClick={() => lockRoom(true)}
                                className={localParticipant?.roleName !== "host" ? "hostControlActionDisallowed" : ""}
                            >
                                Lock room
                            </button>
                            <button
                                onClick={() => lockRoom(false)}
                                className={localParticipant?.roleName !== "host" ? "hostControlActionDisallowed" : ""}
                            >
                                Unlock room
                            </button>
                            <button
                                onClick={() => endMeeting(Boolean(hostOptions?.includes("stayBehind")))}
                                className={localParticipant?.roleName !== "host" ? "hostControlActionDisallowed" : ""}
                            >
                                End meeting
                            </button>
                        </div>
                    )}
                    <div className="container">
                        {[localParticipant, ...remoteParticipants].map((participant, i) => (
                            <div className="participantWrapper" key={participant?.id || i}>
                                {participant ? (
                                    <>
                                        <div
                                            className="bouncingball"
                                            style={{
                                                animationDelay: `1000ms`,
                                                ...(participant.isAudioEnabled
                                                    ? {
                                                          border: "2px solid grey",
                                                      }
                                                    : null),
                                                ...(!participant.isVideoEnabled
                                                    ? {
                                                          backgroundColor: "green",
                                                      }
                                                    : null),
                                            }}
                                        >
                                            {participant.stream && participant.isVideoEnabled && (
                                                <VideoView
                                                    muted={participant.isLocalParticipant}
                                                    stream={participant.stream}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            )}
                                        </div>
                                        <div
                                            className="displayName"
                                            title={
                                                "externalId" in participant
                                                    ? participant.externalId || undefined
                                                    : undefined
                                            }
                                        >
                                            {participant.displayName || "Guest"}
                                            {participant.stickyReaction && <div>✋</div>}
                                            {showHostControls && participant.id !== localParticipant?.id ? (
                                                <>
                                                    {" "}
                                                    <button
                                                        onClick={() => {
                                                            muteParticipants([participant.id]);
                                                        }}
                                                        className={
                                                            localParticipant?.roleName !== "host"
                                                                ? "hostControlActionDisallowed"
                                                                : ""
                                                        }
                                                    >
                                                        Mute
                                                    </button>{" "}
                                                    <button
                                                        onClick={() => {
                                                            kickParticipant(participant.id);
                                                        }}
                                                        className={
                                                            localParticipant?.roleName !== "host"
                                                                ? "hostControlActionDisallowed"
                                                                : ""
                                                        }
                                                    >
                                                        Kick
                                                    </button>
                                                </>
                                            ) : null}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        ))}
                        {screenshares.map(
                            (s) =>
                                s.stream && (
                                    <VideoView style={{ width: 200, height: "auto" }} key={s.id} stream={s.stream} />
                                ),
                        )}
                    </div>
                    <div className="controls">
                        <button onClick={() => leaveRoom()}>Leave</button>
                        <button onClick={() => toggleCamera()}>Toggle camera</button>
                        <button onClick={() => toggleMicrophone()}>Toggle microphone</button>
                        <button onClick={() => toggleLowDataMode()}>Toggle low data mode</button>
                        <button onClick={() => toggleRaiseHand()}>Toggle raise hand</button>
                        <button
                            onClick={() => {
                                if (isLocalScreenshareActive) {
                                    stopScreenshare();
                                } else {
                                    startScreenshare();
                                }
                                setIsLocalScreenshareActive((prev) => !prev);
                            }}
                        >
                            Toggle screenshare
                        </button>
                        <DisplayNameForm initialDisplayName={displayName} onSetDisplayName={setDisplayName} />
                    </div>
                    <div className="notifications">
                        Notifications log:
                        <div>
                            <textarea rows={10} cols={120} value={notifications.join("\n")} readOnly />
                        </div>
                    </div>
                </>
            )}
            {connectionStatus === "leaving" && <span>Leaving...</span>}
            {connectionStatus === "disconnected" && <span>Disconnected</span>}
            {["kicked", "left"].includes(connectionStatus) && (
                <button onClick={() => joinRoom()}>Re-join {connectionStatus} room</button>
            )}
        </div>
    );
}
