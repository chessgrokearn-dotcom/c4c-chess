'use client'
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { useState, useEffect, ChangeEvent } from 'react'
import { useAccount, useConnect, useDisconnect, useConnectors, useBalance } from 'wagmi'
import { Chess } from 'chess.js'
import { APP_NAME, C4C_BUY_URL, TIME_OPTIONS, STAKE_OPTIONS, UI_THEMES, UI_LANGS, UI_BOARDS, UI_TRANSLATE, formatTime, formatC4C, getBotMove, saveProfileToStorage, loadProfileFromStorage, resetConnectionStates, getFriends, addFriend, processPayout, FIXED_CSS, injectGlobalStyles, validateStake, formatPrizePool, formatClock, useApproveC4C, useCreateTokenGame, useJoinTokenGame, useClaimWinnings, useGameBalance, publishGameToLobby, getLobbyGames, generateGameInvite, sendInviteToChat, canJoinGame, initClock, tickClock, makeMove, SECTIONS, YOUTUBE_URL, YOUTUBE_BUTTON_TEXT, C4C_EXCHANGE_URL, SOCIAL_SECTION_TITLE, SOCIAL_LINKS, YOUTUBE_SECTION_DESCRIPTION, EXTENDED_BOARD_THEMES, PIECE_STYLES, createNotification, getNotifications, markNotificationRead, playStartSound, showVisualAlert, checkAndStartGame, updatePlayerPresence, areBothPlayersOnline } from '@/lib/config'
import type { GameNotification } from '@/lib/config';

const PIECES: any = { p:{w:'♙',b:'♟'}, n:{w:'♘',b:'♞'}, b:{w:'♗',b:'♝'}, r:{w:'♖',b:'♜'}, q:{w:'♕',b:'♛'}, k:{w:'♔',b:'♚'} }

export default function Page() { return <div className="min-h-screen bg-gray-900 text-white p-8">♟️ c4c-chess loading...</div> }
