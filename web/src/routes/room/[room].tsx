import './room.css'

import { Event } from '@thriving/shared/src/network'
import { Component, For, Index, Show, createMemo } from 'solid-js'
import { Button } from '../../components/button'
import socket from '../../socket'
import { useLocation, useNavigate, useParams } from 'solid-start'
import { Location } from '@solidjs/router'
import {
    actionButton,
    actionItem,
    infoContainer,
    infoItem,
    readyList,
    room,
} from './room.css'
import { playerData, roomData, setPlayerData, setRoomData } from '../../store'
import { Input } from '../../components/input'
import { createSignal } from 'solid-js'
import { entries, playerNameMask } from '../../utils'

const Room: Component = () => {
    const params = useParams<{ room: string }>()
    console.log(params)

    // todo
    // if (roomData.creator.length === 0 || roomData.roomID.length === 0) {
    //     socket.on(Event.RoomData, (data) => {
    //         setRoomData(data)
    //     })
    // }

    const playerName = createMemo(() => playerData.playerName)

    const navigate = useNavigate()

    const returnToHome = () => {
        setRoomData({
            creator: '',
            gameMode: '5p_identity',
            readyStates: {},
            roomID: '',
        })
        navigate('/')
    }

    const toggleReady = () => {
        socket.emit(Event.CPacketChangeReady, {
            playerName: playerName(),
            readyState: !roomData.readyStates[playerName()],
            roomID: roomData.roomID,
        })
    }

    const [tmpPlayerName, setTMPPlayerName] = createSignal('')

    const confirmPlayerName = () => {
        if (tmpPlayerName().trim().length > 0) {
            setPlayerData('playerName', tmpPlayerName())
        }
    }

    return (
        <div class={room}>
            <Show
                when={roomData.creator.length > 0 && roomData.roomID.length > 0}
                fallback={
                    <div>
                        <div class="error">似乎出现了一点问题</div>
                        <Button onClick={returnToHome}>返回主界面</Button>
                    </div>
                }
            >
                <div class={infoContainer}>
                    <div class={infoItem}>
                        <span>房间号：</span>
                        {roomData.roomID}
                    </div>
                    <div class={infoItem}>
                        <span>房主：</span>
                        {roomData.creator}
                    </div>
                    <Show when={playerName().length > 0}>
                        <div class={infoItem}>
                            <span>您的游戏名：</span>
                            {playerName()}
                        </div>
                    </Show>
                </div>
                <div class={readyList}>
                    <Index each={entries(roomData.readyStates)}>
                        {(item) => (
                            <div>
                                {item()[0]}: {item()[1] ? '已准备' : '未准备'}
                            </div>
                        )}
                    </Index>
                </div>
                <Show
                    when={playerName().length > 0}
                    fallback={
                        <>
                            <div class={actionItem}>
                                <Input
                                    onInput={(e) =>
                                        setTMPPlayerName(playerNameMask(e))
                                    }
                                />
                            </div>
                            <div class={actionItem}>
                                <Button
                                    class={actionButton}
                                    onClick={confirmPlayerName}
                                >
                                    确定游戏名
                                </Button>
                            </div>
                        </>
                    }
                >
                    <div class={actionItem}>
                        <Button class={actionButton} onClick={toggleReady}>
                            {roomData.readyStates[playerName()]
                                ? '取消准备'
                                : '准备'}
                        </Button>
                    </div>
                </Show>
                <div class={actionItem}>
                    <Button class={actionButton} onClick={returnToHome}>
                        返回主界面
                    </Button>
                </div>
            </Show>
        </div>
    )
}

export default Room
