import { ChatInterface } from "@/components/chat-interface"
import { getDictionary } from "../../../get-dictionnary"
import type { Locale } from "../../../i18n-config"

export default async function ChatPage({
  params,
}: {
  params: Promise<{
    lang: Locale
  }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <ChatInterface dict={dict.chatInterface} commonDict={dict.common} lang={lang} />
}
