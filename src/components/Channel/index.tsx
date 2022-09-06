import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput
} from '@chatscope/chat-ui-kit-react'
import {
  Channel,
  ChannelMessage,
  Client,
  Session,
  Socket
} from '@heroiclabs/nakama-js'

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import './index.scss'

const DEFAULT_CHANNEL = 'Hellven channel'
const DEFAULT_DISPLAY_MESSAGE_TIME = 'HH:mm:ss'

interface IChat {
  session: Session | null
  client: Client
}

interface IMessageSent {
  channelId: string
  username: string | undefined
  message: string
}

// eslint-disable-next-line camelcase
type TMessageReceived = IMessageSent & { message_id: string }

type TMessagesReceied = TMessageReceived[]

// eslint-disable-next-line camelcase
type TChannel = Channel & { room_name: string }

const ChannelChat = ({ session, client }: IChat) => {
  const navigate = useNavigate()
  const [ socket, setSocket ] = useState<Socket | null>(null)
  const [ channel, setChannel ] = useState<TChannel | null>(null)
  const [ messagesReceived, setMessagesReceived ] = useState<TMessagesReceied>([])
  const handdleReceivedMessage = (message: ChannelMessage) => {
    console.info('Message received from channel', message.channel_id)
    console.info('Received message', message)
    if (message.room_name === DEFAULT_CHANNEL && message.content) {
      const newMesasgeContent = {
        ...message.content,
        message_id: message.message_id
      } as TMessageReceived
      console.log('NEW MESSAGE:', newMesasgeContent)
      setMessagesReceived((prev) => [ ...prev, newMesasgeContent ])
    }
  }

  const sendHandler:
    | ((
        innerHtml: string,
        textContent: string,
        innerText: string,
        nodes: NodeList
      ) => void)
    | undefined = (html, textContent, innerText, nodes) => {
      if (!socket || !channel) return
      const payload: IMessageSent = { channelId: channel.id, username: session?.username, message: textContent }
      socket.writeChatMessage(channel.id, payload)
    }

  const getConnection = async () => {
    if (!session) {
      navigate('/')
      return
    }
    const secure = process.env.RPC_USE_SSL === 'true' // Enable if server is run with an SSL certificate
    const trace = false
    const createStatus = true
    const socketClient = client.createSocket(secure, trace)
    socketClient.ondisconnect = (evt) => {
      console.info('Disconnected', evt)
    }
    await socketClient.connect(session, createStatus)
    console.log('Connect successfully')
    return socketClient
  }

  const joinChat = async () => {
    try {
      if (!session) {
        navigate('/')
        return
      }

      const socket = await getConnection()
      if (!socket) {
        console.log('cannot get socket!')
        return
      }
      const type: number = 1
      const target = DEFAULT_CHANNEL
      const persistence: boolean = true
      const hidden: boolean = false
      const channel = (await socket.joinChat(
        target,
        type,
        persistence,
        hidden
      )) as TChannel
      if (channel.id) {
        socket.onchannelmessage = handdleReceivedMessage
        setSocket(socket)
        console.log('CHANNEL', channel)
        setChannel(channel)
      }
    } catch (error) {
      console.log('ERROR: ', error)
    }
  }

  useEffect(() => {
    joinChat()
  }, [])
  return (
    <div className="chatbox-container">
      <div className="cs-message__header group-tittle">
        {channel?.room_name}
      </div>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messagesReceived.map((message) => {
              return (
                <Message
                  key={message.message_id}
                  model={{
                    type: 'html',
                    message: message.message,
                    sentTime: moment().format(DEFAULT_DISPLAY_MESSAGE_TIME),
                    sender: session?.username,
                    direction:
                      message.username !== session?.username
                        ? 'outgoing'
                        : 'incoming',
                    position: 'last'
                  }}
                >
                  <Message.Header sender={message.username} />
                  <Message.HtmlContent
                    html={`<span>${message.message}</span>`}
                  />
                  <Message.Footer
                    sentTime={moment().format(DEFAULT_DISPLAY_MESSAGE_TIME)}
                  />
                </Message>
              )
            })}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Type message here"
            autoFocus
            onSend={sendHandler}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}
export default ChannelChat
